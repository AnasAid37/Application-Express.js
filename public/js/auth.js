/**
 * Fichier de gestion de l'authentification côté client
 */

// Fonction pour vérifier si l'utilisateur est connecté
function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    
    if (token && username) {
      document.getElementById('loginLink').textContent = username;
      document.getElementById('loginLink').href = '#';
      document.getElementById('logoutLink').style.display = 'inline-block';
      
      // Si on est sur une page qui contient userGreeting
      const userGreeting = document.getElementById('userGreeting');
      if (userGreeting) {
        userGreeting.classList.remove('hidden');
        document.getElementById('username').textContent = username;
      }
      
      return true;
    } else {
      document.getElementById('loginLink').textContent = 'Connexion';
      document.getElementById('loginLink').href = '/login';
      document.getElementById('logoutLink').style.display = 'none';
      
      // Si on est sur une page qui contient userGreeting
      const userGreeting = document.getElementById('userGreeting');
      if (userGreeting) {
        userGreeting.classList.add('hidden');
      }
      
      return false;
    }
  }
  
  // Enregistrement d'un nouvel utilisateur
  async function registerUser(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Vérifier que les mots de passe correspondent
    if (password !== confirmPassword) {
      showAlert('Les mots de passe ne correspondent pas', 'danger');
      return;
    }
    
    // Vérifier que les champs sont remplis
    if (!username || !email || !password) {
      showAlert('Veuillez remplir tous les champs', 'danger');
      return;
    }
    
    try {
      // Envoyer la requête d'inscription
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          email,
          password
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Enregistrer le token et le nom d'utilisateur
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.user.username);
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('userRole', data.user.role);
        
        showAlert('Inscription réussie! Redirection...', 'success');
        
        // Rediriger vers la page d'accueil après 2 secondes
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        showAlert(data.message || 'Erreur lors de l\'inscription', 'danger');
      }
    } catch (error) {
      console.error('Erreur:', error);
      showAlert('Erreur de connexion au serveur', 'danger');
    }
  }
  
  // Connexion d'un utilisateur
  async function loginUser(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Vérifier que les champs sont remplis
    if (!email || !password) {
      showAlert('Veuillez remplir tous les champs', 'danger');
      return;
    }
    
    try {
      // Envoyer la requête de connexion
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Enregistrer le token et le nom d'utilisateur
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.user.username);
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('userRole', data.user.role);
        
        showAlert('Connexion réussie! Redirection...', 'success');
        
        // Rediriger vers la page d'accueil après 2 secondes
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        showAlert(data.message || 'Identifiants invalides', 'danger');
      }
    } catch (error) {
      console.error('Erreur:', error);
      showAlert('Erreur de connexion au serveur', 'danger');
    }
  }
  
  // Fonction pour afficher une alerte
  function showAlert(message, type) {
    const alertDiv = document.getElementById('alert');
    alertDiv.textContent = message;
    alertDiv.className = `alert alert-${type}`;
    alertDiv.style.display = 'block';
    
    // Faire disparaître l'alerte après 5 secondes
    setTimeout(() => {
      alertDiv.style.display = 'none';
    }, 5000);
  }
  
  // Déconnexion
  function logoutUser(event) {
    if (event) event.preventDefault();
    
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    
    // Vérifier si on est sur la page d'accueil
    if (window.location.pathname === '/') {
      checkAuthStatus();
      alert('Vous êtes déconnecté');
    } else {
      window.location.href = '/';
    }
  }
  
  // Initialisation des événements
  document.addEventListener('DOMContentLoaded', function() {
    // Vérifier le statut d'authentification sur toutes les pages
    checkAuthStatus();
    
    // Mettre un événement de déconnexion sur toutes les pages
    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
      logoutLink.addEventListener('click', logoutUser);
    }
    
    // Ajouter les gestionnaires d'événements spécifiques aux pages
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', loginUser);
    }
    
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
      registerForm.addEventListener('submit', registerUser);
    }
  });