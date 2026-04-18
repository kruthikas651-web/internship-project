const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/authMiddleware');

// @route   POST /api/qr/scan
// @desc    Security scanning the QR code
// @access  Private (Security only)
router.post('/scan', auth, async (req, res) => {
    if (req.user.role !== 'Security') {
        return res.status(403).json({ message: 'Only Security can scan QR passes' });
    }

    try {
        const { qrData, scanType } = req.body; // qrData is "requestId-token", scanType is "Exit" or "Entry"
        
        if (!qrData || !scanType) return res.status(400).json({ message: 'Missing scan details' });

        // Lookup QR pass
        const [passes] = await db.execute('SELECT * FROM qr_passes WHERE token_hash = ?', [qrData]);
        
        if (passes.length === 0) {
            return res.status(404).json({ message: 'Invalid or Fake QR Code', status: 'Fraud_Attempt' });
        }

        const pass = passes[0];

        // Check if QR pass belongs to an approved request
        const [requests] = await db.execute('SELECT * FROM exit_requests WHERE id = ?', [pass.request_id]);
        if (requests.length === 0) {
            return res.status(400).json({ message: 'Request not found' });
        }
        
        const request = requests[0];

        // Check validity (If it's already Used and they try to Exit again)
        if (scanType === 'Exit' && pass.validity_status === 'Used') {
            // GRACE PERIOD: Check if a successful exit log was created for this pass in the last 3 seconds
            // This handles accidental double-scans from the camera before the UI updates
            const [recentLogs] = await db.execute(
                'SELECT * FROM exit_logs WHERE qr_id = ? AND type = "Exit" AND status = "Success" AND scan_time > datetime("now", "-3 seconds")',
                [pass.id]
            );

            if (recentLogs.length > 0) {
                const [students] = await db.execute('SELECT name FROM users WHERE id = ?', [request.student_id]);
                return res.json({ 
                    message: 'Exit Approved (Recently Verified)', 
                    studentName: students[0].name,
                    status: 'Success' 
                });
            }

            await db.execute('INSERT INTO exit_logs (student_id, qr_id, type, status) VALUES (?, ?, ?, ?)', 
                [request.student_id, pass.id, 'Exit', 'Fraud_Attempt']);
            
            return res.status(400).json({ message: 'QR Code already used for exit! Fraud detected.', status: 'Fraud_Attempt' });
        }

        // Record the Entry/Exit log
        await db.execute('INSERT INTO exit_logs (student_id, qr_id, type, status) VALUES (?, ?, ?, ?)', 
            [request.student_id, pass.id, scanType, 'Success']);

        // Mark pass as used if it was an Exit scan
        if (scanType === 'Exit') {
            await db.execute('UPDATE qr_passes SET validity_status = "Used" WHERE id = ?', [pass.id]);
            await db.execute('UPDATE exit_requests SET status = "Exited" WHERE id = ?', [request.id]);
        }

        // Fetch Student name to greet them
        const [students] = await db.execute('SELECT name FROM users WHERE id = ?', [request.student_id]);

        res.json({ 
            message: scanType === 'Exit' ? 'Exit Approved' : 'Entry Recorded', 
            studentName: students[0].name,
            status: 'Success' 
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error during scan' });
    }
});

module.exports = router;
