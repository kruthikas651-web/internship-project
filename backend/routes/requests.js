const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/authMiddleware');
const crypto = require('crypto');

// @route   POST /api/requests
// @desc    Submit a new exit request
// @access  Private (Student only)
router.post('/', auth, async (req, res) => {
    if (req.user.role !== 'Student') {
        return res.status(403).json({ message: 'Only students can submit requests' });
    }

    try {
        const { reason, leave_date, leave_time } = req.body;
        
        if (!reason || !leave_date || !leave_time) {
            return res.status(400).json({ message: 'Please provide all details' });
        }

        const [result] = await db.execute(
            'INSERT INTO exit_requests (student_id, reason, leave_date, leave_time, status) VALUES (?, ?, ?, ?, "Pending")',
            [req.user.id, reason, leave_date, leave_time]
        );

        res.status(201).json({ message: 'Request submitted successfully', requestId: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/requests
// @desc    Get exit requests based on role
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        let query = '';
        let params = [];

        if (req.user.role === 'Student') {
            // Student sees their own requests
            query = `
                SELECT r.*, q.token_hash 
                FROM exit_requests r 
                LEFT JOIN qr_passes q ON r.id = q.request_id 
                WHERE r.student_id = ? 
                ORDER BY r.id DESC
            `;
            params = [req.user.id];
        } 
        else if (req.user.role === 'Teacher') {
            // Teacher sees Pending requests
            query = `
                SELECT r.*, u.name as student_name 
                FROM exit_requests r 
                JOIN users u ON r.student_id = u.id 
                WHERE r.status = 'Pending' 
                ORDER BY r.id ASC
            `;
        } 
        else if (req.user.role === 'Parent') {
            // Parent sees Teacher_Approved requests (assuming mock parent setup)
            query = `
                SELECT r.*, u.name as student_name 
                FROM exit_requests r 
                JOIN users u ON r.student_id = u.id 
                WHERE r.status = 'Teacher_Approved' 
                ORDER BY r.id ASC
            `;
        } 
        else if (req.user.role === 'Admin') {
            query = 'SELECT * FROM exit_requests ORDER BY id DESC';
        }
        else {
            return res.status(403).json({ message: 'Access Denied' });
        }

        const [requests] = await db.execute(query, params);
        res.json(requests);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   PUT /api/requests/:id
// @desc    Update request status (Approve/Reject)
// @access  Private (Teacher, Parent)
router.put('/:id', auth, async (req, res) => {
    try {
        const { status } = req.body; // 'Teacher_Approved', 'Parent_Approved', 'Rejected'
        const requestId = req.params.id;

        if (!status) return res.status(400).json({ message: 'Status is required' });

        // Update the request status
        await db.execute('UPDATE exit_requests SET status = ? WHERE id = ?', [status, requestId]);

        let finalStatus = status;

        // If Teacher Approved, check if Parent Permission is NOT required
        if (status === 'Teacher_Approved') {
            // Check global setting first
            const [globalSettings] = await db.execute('SELECT value FROM system_settings WHERE key = ?', ['parent_permission_required']);
            const globalRequiresPermission = globalSettings.length > 0 ? (globalSettings[0].value === 'true') : true;

            if (!globalRequiresPermission) {
                finalStatus = 'Parent_Approved';
                await db.execute('UPDATE exit_requests SET status = ? WHERE id = ?', [finalStatus, requestId]);
            } else {
                // Check if there's a specific parent setting (deprecated but keeping for compatibility)
                const [settings] = await db.execute('SELECT requires_approval FROM parent_settings LIMIT 1');
                if (settings.length > 0 && settings[0].requires_approval === 0) {
                    finalStatus = 'Parent_Approved';
                    await db.execute('UPDATE exit_requests SET status = ? WHERE id = ?', [finalStatus, requestId]);
                }
            }
        }

        // If status is now Parent_Approved (either via direct parent action or auto-approval)
        if (finalStatus === 'Parent_Approved') {
            const token = crypto.randomBytes(20).toString('hex');
            const qrData = `${requestId}-${token}`;
            
            await db.execute(
                'INSERT INTO qr_passes (request_id, token_hash, validity_status) VALUES (?, ?, "Valid")',
                [requestId, qrData]
            );
        }

        res.json({ message: `Request updated to ${finalStatus}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
