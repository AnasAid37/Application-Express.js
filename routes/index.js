const express = require('express');
const path = require('path');
const os = require('os');
const router = express.Router();

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

router.get('/health', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'health.html'));
});

router.get('/api/info', (req, res) => {
  const serverInfo = {
    hostname: os.hostname(),
    platform: os.platform(),
    cpus: os.cpus().length,
    uptime: os.uptime(),
    memory: {
      total: os.totalmem(),
      free: os.freemem()
    },
    env: process.env.NODE_ENV || 'development'
  };
  
  res.json(serverInfo);
});

router.post('/api/data', (req, res) => {
  const data = req.body;
  
  if (!data || !data.name) {
    return res.status(400).json({ error: 'Données invalides' });
  }
  
  setTimeout(() => {
    res.status(201).json({
      id: Date.now(),
      name: data.name,
      timestamp: new Date().toISOString(),
      processed: true
    });
  }, 500);
});

module.exports = router;