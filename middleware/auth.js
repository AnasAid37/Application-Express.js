

// middleware/auth.js
const jwt = require('jsonwebtoken');
// Dans auth.js ou la fonction de connexion
localStorage.setItem('userId', userData.user._id); // Assurez-vous que c'est bien l'ID correct
module.exports = (req, res, next) => {
  try {
    // Récupérer le token depuis les en-têtes ou les cookies
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
    
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Accès non autorisé. Token manquant'
      });
    }
    
    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkeyfordev');
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({
      status: 'error',
      message: 'Token invalide ou expiré'
    });
  }
};