const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const routes = require('./routes');

// Configuration des variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour logger les requêtes
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Middleware pour les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Middleware pour parser le JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', routes);

// Middleware pour gérer les erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).sendFile(path.join(__dirname, 'views', 'error.html'));
});

// Route pour les chemins non trouvés
app.use((req, res) => {
  res.status(404).send('Page non trouvée');
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

// Gestion de la fermeture propre de l'application
process.on('SIGTERM', () => {
  console.log('SIGTERM reçu. Arrêt gracieux...');
  process.exit(0);
});