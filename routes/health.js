// routes/health.js
const express = require('express');
const router = express.Router();

router.get('/info', (req, res) => {
    const memoryUsage = process.memoryUsage();
    res.json({
        status: "OK",
        uptime: process.uptime(),
        memory: {
            total: memoryUsage.heapTotal,
            free: memoryUsage.heapTotal - memoryUsage.heapUsed
        }
    });
});

module.exports = router;