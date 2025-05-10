/**
 * Fichier de gestion des produits côté client
 */

// Variable pour stocker l'ID du produit en cours d'édition
let currentProductId = null;

// Fonction pour récupérer tous les produits
async function getProducts() {
  try {
    const response = await fetch('/api/products');
    const data = await response.json();
    
    if (response.ok) {
      displayProducts(data.data);
    } else {
      showAlert(data.message || 'Erreur lors de la récupération des produits', 'danger');
    }
  } catch (error) {
    console.error('Erreur:', error);
    showAlert('Erreur de connexion au serveur', 'danger');
  }
}

// Fonction pour afficher les produits
function displayProducts(products) {
  const productsContainer = document.getElementById('products-container');
  productsContainer.innerHTML = '';
  
  if (products.length === 0) {
    productsContainer.innerHTML = '<p class="text-center">Aucun produit disponible</p>';
    return;
  }
  
  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('userRole');
  
  products.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    
    const canEdit = (userId && product.user === userId) || userRole === 'admin';
    
    productCard.innerHTML = `
      <div class="product-content">
        <h3 class="product-title">${product.name}</h3>
        <div class="product-price">${product.price.toFixed(2)} €</div>
        <div class="product-quantity">Quantité: ${product.quantity}</div>
        <div class="product-description">${product.description}</div>
        <div class="product-actions">
          ${canEdit ? `
            <button class="btn btn-sm btn-edit" data-id="${product._id}">Modifier</button>
            <button class="btn btn-sm btn-delete" data-id="${product._id}">Supprimer</button>
          ` : ''}
        </div>
      </div>
    `;
    
    productsContainer.appendChild(productCard);
  });
  
  // Ajouter les gestionnaires d'événements pour les boutons
  const editButtons = document.querySelectorAll('.btn-edit');
  editButtons.forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.getAttribute('data-id');
      openEditModal(productId);
    });
  });
  
  const deleteButtons = document.querySelectorAll('.btn-delete');
  deleteButtons.forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.getAttribute('data-id');
      confirmDeleteProduct(productId);
    });
  });
}

// Fonction pour créer un produit
async function createProduct(event) {
  event.preventDefault();
  
  // Vérifier si l'utilisateur est connecté
  if (!checkAuthStatus()) {
    showAlert('Vous devez être connecté pour créer un produit', 'danger');
    setTimeout(() => {
      window.location.href = '/login';
    }, 2000);
    return;
  }
  
  const name = document.getElementById('productName').value;
  const description = document.getElementById('productDescription').value;
  const price = document.getElementById('productPrice').value;
  const quantity = document.getElementById('productQuantity').value;
  
  // Vérifier que les champs sont remplis
  if (!name || !description || !price || !quantity) {
    showAlert('Veuillez remplir tous les champs', 'danger');
    return;
  }
  
  try {
    // Envoyer la requête de création
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        name,
        description,
        price: parseFloat(price),
        quantity: parseInt(quantity)
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      showAlert('Produit créé avec succès', 'success');
      document.getElementById('addProductForm').reset();
      getProducts(); // Actualiser la liste des produits
    } else {
      showAlert(data.message || 'Erreur lors de la création du produit', 'danger');
    }
  } catch (error) {
    console.error('Erreur:', error);
    showAlert('Erreur de connexion au serveur', 'danger');
  }
}

// Fonction pour ouvrir le modal d'édition
async function openEditModal(productId) {
  try {
    const response = await fetch(`/api/products/${productId}`);
    const data = await response.json();
    
    if (response.ok) {
      const product = data.data;
      currentProductId = product._id;
      
      // Remplir le formulaire
      document.getElementById('editProductName').value = product.name;
      document.getElementById('editProductDescription').value = product.description;
      document.getElementById('editProductPrice').value = product.price;
      document.getElementById('editProductQuantity').value = product.quantity;
      
      // Afficher le modal
      document.getElementById('editModal').style.display = 'block';
    } else {
      showAlert(data.message || 'Erreur lors de la récupération du produit', 'danger');
    }
  } catch (error) {
    console.error('Erreur:', error);
    showAlert('Erreur de connexion au serveur', 'danger');
  }
}

// Fonction pour mettre à jour un produit
async function updateProduct(event) {
  event.preventDefault();
  
  const name = document.getElementById('editProductName').value;
  const description = document.getElementById('editProductDescription').value;
  const price = document.getElementById('editProductPrice').value;
  const quantity = document.getElementById('editProductQuantity').value;
  
  // Vérifier que les champs sont remplis
  if (!name || !description || !price || !quantity) {
    showAlert('Veuillez remplir tous les champs', 'danger', 'editAlert');
    return;
  }
  
  try {
    // Envoyer la requête de mise à jour
    const response = await fetch(`/api/products/${currentProductId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        name,
        description,
        price: parseFloat(price),
        quantity: parseInt(quantity)
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Fermer le modal
      document.getElementById('editModal').style.display = 'none';
      showAlert('Produit mis à jour avec succès', 'success');
      getProducts(); // Actualiser la liste des produits
    } else {
      showAlert(data.message || 'Erreur lors de la mise à jour du produit', 'danger', 'editAlert');
    }
  } catch (error) {
    console.error('Erreur:', error);
    showAlert('Erreur de connexion au serveur', 'danger', 'editAlert');
  }
}

// Fonction pour confirmer la suppression d'un produit
function confirmDeleteProduct(productId) {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) {
    deleteProduct(productId);
  }
}

// Fonction pour supprimer un produit
async function deleteProduct(productId) {
  try {
    // Envoyer la requête de suppression
    const response = await fetch(`/api/products/${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    const data = await response.json();
    
    if (response.ok) {
      showAlert('Produit supprimé avec succès', 'success');
      getProducts(); // Actualiser la liste des produits
    } else {
      showAlert(data.message || 'Erreur lors de la suppression du produit', 'danger');
    }
  } catch (error) {
    console.error('Erreur:', error);
    showAlert('Erreur de connexion au serveur', 'danger');
  }
}

// Fonction pour afficher une alerte
function showAlert(message, type, targetId = 'alert') {
  const alertDiv = document.getElementById(targetId);
  if (!alertDiv) return;
  
  alertDiv.textContent = message;
  alertDiv.className = `alert alert-${type}`;
  alertDiv.style.display = 'block';
  
  // Faire disparaître l'alerte après 5 secondes
  setTimeout(() => {
    alertDiv.style.display = 'none';
  }, 5000);
}

// Fermer le modal quand on clique sur la croix
function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

// Fermer le modal quand on clique en dehors du contenu
window.onclick = function(event) {
  const editModal = document.getElementById('editModal');
  if (event.target === editModal) {
    editModal.style.display = 'none';
  }
};

// Initialisation des événements
document.addEventListener('DOMContentLoaded', function() {
  // Vérifier le statut d'authentification
  checkAuthStatus();
  
  // Récupérer les produits
  getProducts();
  
  // Ajouter les gestionnaires d'événements
  const addProductForm = document.getElementById('addProductForm');
  if (addProductForm) {
    addProductForm.addEventListener('submit', createProduct);
  }
  
  const editProductForm = document.getElementById('editProductForm');
  if (editProductForm) {
    editProductForm.addEventListener('submit', updateProduct);
  }
  
  // Gestionnaires pour les boutons de fermeture des modals
  const closeButtons = document.querySelectorAll('.close');
  closeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const modalId = button.closest('.modal').id;
      closeModal(modalId);
    });
  });
});