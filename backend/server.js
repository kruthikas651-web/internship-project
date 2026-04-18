const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const requestRoutes = require('./routes/requests');
const qrRoutes = require('./routes/qr');
const logRoutes = require('./routes/logs');
const settingsRoutes = require('./routes/settings');

app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/qr', qrRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/settings', settingsRoutes);

// Simple health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'API is running successfully!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
