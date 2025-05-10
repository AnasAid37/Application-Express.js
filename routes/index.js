// routes/index.js
const express = require('express');
const path = require('path');
const os = require('os');
const router = express.Router();

// Route principale
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

// Route pour vérifier l'état du serveur (health check)
router.get('/health', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'health.html'));
});

// Route pour la page de connexion
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
});

// Route pour la page d'inscription
router.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'register.html'));
});

// Route pour la page des produits
router.get('/products', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'products.html'));
});

// API pour obtenir des informations sur le serveur
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

module.exports = router;