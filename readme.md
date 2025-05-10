# Application Cloud Native avec Express.js

Une application web démontrant les principes de développement Cloud Native, implémentant un système d'authentification complet et des opérations CRUD sur une API RESTful.

![Statut](https://img.shields.io/badge/statut-en%20développement-yellow)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Licence](https://img.shields.io/badge/licence-MIT-green)

## 📋 Fonctionnalités

- **Authentification** : Inscription, connexion et déconnexion des utilisateurs avec JWT
- **Gestion des produits** : Opérations CRUD complètes (Création, Lecture, Mise à jour, Suppression)
- **Surveillance** : Page d'état du service avec métriques en temps réel
- **API RESTful** : Interface bien définie pour la communication client-serveur
- **Interface utilisateur intuitive** : Frontend responsive et réactif

## 🚀 Technologies utilisées

### Backend
- **Node.js & Express.js** : Framework web pour le serveur
- **MongoDB** : Base de données NoSQL
- **JWT** : JSON Web Tokens pour l'authentification
- **Middlewares Express** : Pour la gestion des requêtes et l'authentification

### Frontend
- **HTML5 & CSS3** : Structure et style des pages
- **JavaScript vanilla** : Interactions client et appels API
- **Fetch API** : Communication asynchrone avec le backend
- **LocalStorage** : Stockage des tokens d'authentification

## 📦 Structure du projet

```
/
├── app.js                 # Point d'entrée de l'application
├── package.json           # Dépendances du projet
├── config/                # Configuration de l'application
│   └── db.js              # Configuration de la base de données
├── middleware/            # Middleware personnalisés
│   └── auth.js            # Middleware d'authentification
├── models/                # Modèles de données
│   ├── user.js            # Modèle utilisateur
│   └── product.js         # Modèle produit
├── routes/                # Routes de l'API
│   ├── index.js           # Routes principales
│   ├── auth.js            # Routes d'authentification
│   └── products.js        # Routes pour les produits
├── public/                # Fichiers statiques
│   ├── style.css          # Feuilles de style CSS
│   └── js/                # JavaScript côté client
└── views/                 # Templates HTML
    ├── index.html         # Page d'accueil
    ├── health.html        # Page d'état du service
    ├── login.html         # Page de connexion
    ├── register.html      # Page d'inscription
    └── products.html      # Page de gestion des produits
```

## 🛠️ Installation

### Prérequis
- Node.js (v14 ou supérieur)
- MongoDB (v4 ou supérieur)

### Étapes d'installation

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/AnasAid37/cloud-native-express-app
   cd cloud-native-express-app
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**  
   Créez un fichier `.env` à la racine du projet :
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/cloud-native-app
   JWT_SECRET=votre_secret_jwt
   NODE_ENV=development
   ```

4. **Démarrer MongoDB**
   ```bash
   # Si MongoDB n'est pas installé en tant que service
   mongod --dbpath=/data
   ```

5. **Démarrer l'application**
   ```bash
   npm start
   ```

6. **Accéder à l'application**  
   Ouvrez votre navigateur à l'adresse `http://localhost:3000`

## 🧪 API Endpoints

### Authentification
- `POST /api/auth/register` : Inscription d'un nouvel utilisateur
- `POST /api/auth/login` : Connexion utilisateur

### Produits
- `GET /api/products` : Liste tous les produits
- `GET /api/products/:id` : Récupère les détails d'un produit spécifique
- `POST /api/products` : Crée un nouveau produit (authentification requise)
- `PUT /api/products/:id` : Met à jour un produit (authentification requise)
- `DELETE /api/products/:id` : Supprime un produit (authentification requise)

### Informations système
- `GET /api/info` : Récupère les informations système et l'état du service

## 👥 Gestion des utilisateurs

L'application prend en charge deux types d'utilisateurs:

1. **Utilisateurs standard**
   - Peuvent créer, modifier et supprimer leurs propres produits

2. **Administrateurs**
   - Peuvent gérer tous les produits, y compris ceux créés par d'autres utilisateurs
   - Accès à des fonctionnalités administratives supplémentaires

## 📊 Captures d'écran

*À venir*

## 🌐 Déploiement

### Déploiement sur Heroku
```bash
heroku create
git push heroku main
heroku config:set MONGODB_URI=votre_uri_mongodb_atlas JWT_SECRET=votre_secret_jwt NODE_ENV=production
```

### Déploiement avec Docker
```bash
# Construire l'image
docker build -t cloud-native-app .

# Exécuter le conteneur
docker run -p 3000:3000 -e MONGODB_URI=mongodb://mongo:27017/cloud-native-app -e JWT_SECRET=votre_secret_jwt cloud-native-app
```

## 🔜 Roadmap

- [ ] Ajout de tests automatisés (Jest, Supertest)
- [ ] Implémentation de la pagination pour les listes de produits
- [ ] Ajout de fonctionnalités de recherche et filtrage
- [ ] Support pour les catégories de produits
- [ ] Tableau de bord administrateur
- [ ] Documentation API avec Swagger
- [ ] Intégration continue avec GitHub Actions

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou soumettre une pull request.

1. Forkez le projet
2. Créez votre branche de fonctionnalité (`git checkout -b feature/amazing-feature`)
3. Committez vos changements (`git commit -m 'Add some amazing feature'`)
4. Poussez vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🙏 Remerciements

- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [JWT](https://jwt.io/)