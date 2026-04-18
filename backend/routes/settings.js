const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/authMiddleware');

// @route   GET /api/settings
// @desc    Get parent settings
// @access  Private (Parent only)
router.get('/', auth, async (req, res) => {
    if (req.user.role !== 'Parent') {
        return res.status(403).json({ message: 'Only parents can access these settings' });
    }

    try {
        const [rows] = await db.execute('SELECT * FROM parent_settings WHERE parent_id = ?', [req.user.id]);
        
        if (rows.length === 0) {
            // Default settings if none found
            return res.json({ requires_approval: true });
        }
        
        // SQLite stores boolean as 1/0
        res.json({ requires_approval: !!rows[0].requires_approval });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/settings
// @desc    Update parent settings
// @access  Private (Parent only)
router.post('/', auth, async (req, res) => {
    if (req.user.role !== 'Parent') {
        return res.status(403).json({ message: 'Only parents can update these settings' });
    }

    try {
        const { requires_approval } = req.body;
        
        // upsert logic for sqlite
        await db.execute(`
            INSERT INTO parent_settings (parent_id, requires_approval) 
            VALUES (?, ?)
            ON CONFLICT(parent_id) DO UPDATE SET requires_approval = excluded.requires_approval
        `, [req.user.id, requires_approval ? 1 : 0]);

        res.json({ message: 'Settings updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/settings/teacher
// @desc    Get global teacher settings
// @access  Private (Teacher only)
router.get('/teacher', auth, async (req, res) => {
    if (req.user.role !== 'Teacher') {
        return res.status(403).json({ message: 'Only teachers can access these settings' });
    }

    try {
        const [rows] = await db.execute('SELECT value FROM system_settings WHERE key = ?', ['parent_permission_required']);
        
        if (rows.length === 0) {
            return res.json({ parent_permission_required: true });
        }
        
        res.json({ parent_permission_required: rows[0].value === 'true' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/settings/teacher
// @desc    Update global teacher settings
// @access  Private (Teacher only)
router.post('/teacher', auth, async (req, res) => {
    if (req.user.role !== 'Teacher') {
        return res.status(403).json({ message: 'Only teachers can update these settings' });
    }

    try {
        const { parent_permission_required } = req.body;
        
        await db.execute(`
            INSERT INTO system_settings (key, value) 
            VALUES ('parent_permission_required', ?)
            ON CONFLICT(key) DO UPDATE SET value = excluded.value
        `, [parent_permission_required ? 'true' : 'false']);

        res.json({ message: 'Global settings updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
