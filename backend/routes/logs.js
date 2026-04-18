const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/authMiddleware');

// @route   GET /api/logs
// @desc    Get all exit/entry logs
// @access  Private (Admin only)
router.get('/', auth, async (req, res) => {
    if (req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Only Admins can view logs' });
    }

    try {
        const query = `
            SELECT l.id, u.name as student_name, l.scan_time, l.type, l.status, q.token_hash
            FROM exit_logs l
            JOIN users u ON l.student_id = u.id
            JOIN qr_passes q ON l.qr_id = q.id
            ORDER BY l.scan_time DESC
        `;
        const [logs] = await db.execute(query);
        res.json(logs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
