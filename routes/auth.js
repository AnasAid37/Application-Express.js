// routes/auth.js
const express = require('express');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Inscription d'un utilisateur
router.post('/register', [
  check('username', 'Le nom d\'utilisateur est requis').not().isEmpty(),
  check('email', 'Veuillez inclure un email valide').isEmail(),
  check('password', 'Entrez un mot de passe avec 6 caractères ou plus').isLength({ min: 6 })
], async (req, res) => {
  // Validation des entrées
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.array()
    });
  }
  
  const { username, email, password } = req.body;
  
  try {
    // Vérifier si l'utilisateur existe déjà
    let user = await User.findOne({ email });
    
    if (user) {
      return res.status(400).json({
        status: 'error',
        message: 'Cet utilisateur existe déjà'
      });
    }
    
    // Créer l'utilisateur
    user = new User({
      username,
      email,
      password
    });
    
    await user.save();
    
    // Générer le JWT
    const payload = {
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    };
    
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secretkeyfordev',
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({
          status: 'success',
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
          }
        });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      status: 'error',
      message: 'Erreur serveur'
    });
  }
});

// Connexion d'un utilisateur
router.post('/login', [
  check('email', 'Veuillez inclure un email valide').isEmail(),
  check('password', 'Le mot de passe est requis').exists()
], async (req, res) => {
  // Validation des entrées
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.array()
    });
  }
  
  const { email, password } = req.body;
  
  try {
    // Vérifier si l'utilisateur existe
    let user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Identifiants invalides'
      });
    }
    
    // Vérifier le mot de passe
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      return res.status(400).json({
        status: 'error',
        message: 'Identifiants invalides'
      });
    }
    
    // Générer le JWT
    const payload = {
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    };
    
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secretkeyfordev',
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({
          status: 'success',
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
          }
        });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      status: 'error',
      message: 'Erreur serveur'
    });
  }
});

// Obtenir l'utilisateur connecté
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.user.id).select('-password');
    res.json({
      status: 'success',
      user
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      status: 'error',
      message: 'Erreur serveur'
    });
  }
});

module.exports = router;