const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'HireMatrix API is running!' });
});

// Simple test route
app.get('/api/test', (req, res) => {
    res.json({ success: true, message: 'API is working!' });
});

// API routes (will add later)
app.get('/api/jobs', (req, res) => {
    res.json({ success: true, data: [] });
});

app.get('/api/auth/me', (req, res) => {
    res.json({ success: true, message: 'Auth endpoint - Add token' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
