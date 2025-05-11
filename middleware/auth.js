const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Récupérer le token depuis les en-têtes ou les cookies
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

    if (!token) {
      console.log('Token manquant');
      return res.status(401).json({
        status: 'error',
        message: 'Accès non autorisé. Token manquant'
      });
    }

    // Vérifier le token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkeyfordev');
      console.log('User decoded:', decoded);  // إضافة الطباعة لرؤية البيانات المستخلصة من التوكن
    } catch (error) {
      console.log('Erreur de vérification du token:', error);  // طباعة الخطأ في حال فشل فك التوكن
      return res.status(401).json({
        status: 'error',
        message: 'Token invalide ou expiré'
      });
    }

    // تعيين المستخدم في الطلب
    req.user = decoded;
    next();

  } catch (error) {
    console.error('Erreur inconnue:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erreur serveur interne'
    });
  }
};
