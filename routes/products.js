const express = require('express');
const { check, validationResult } = require('express-validator');
const Product = require('../models/product');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Récupérer tous les produits
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({
      status: 'success',
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      status: 'error',
      message: 'Erreur serveur'
    });
  }
});

// Récupérer un produit par ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Produit non trouvé'
      });
    }
    
    res.json({
      status: 'success',
      data: product
    });
  } catch (error) {
    console.error(error.message);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        status: 'error',
        message: 'Produit non trouvé'
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Erreur serveur'
    });
  }
});

// Créer un produit
router.post('/', [
  authMiddleware,
  [
    check('name', 'Le nom est requis').not().isEmpty(),
    check('description', 'La description est requise').not().isEmpty(),
    check('price', 'Le prix doit être un nombre positif').isFloat({ min: 0 }),
    check('quantity', 'La quantité doit être un nombre entier positif').isInt({ min: 0 })
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.array()
    });
  }
  
  try {
    const { name, description, price, quantity } = req.body;
    
    // CORRECTION: Vérifier si req.user.id existe, sinon utiliser req.user.user.id
    const userId = req.user.id || (req.user.user && req.user.user.id);
    
    // Ajouter des logs pour le débogage
    console.log("Auth middleware user:", req.user);
    console.log("User ID pour le nouveau produit:", userId);
    
    if (!userId) {
      return res.status(400).json({
        status: 'error',
        message: 'ID utilisateur non disponible'
      });
    }
    
    const newProduct = new Product({
      name,
      description,
      price,
      quantity,
      user: userId
    });
    
    const product = await newProduct.save();
    
    res.status(201).json({
      status: 'success',
      data: product
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      status: 'error',
      message: 'Erreur serveur'
    });
  }
});

// Mettre à jour un produit
router.put('/:id', [
  authMiddleware,
  [
    check('name', 'Le nom est requis').optional().not().isEmpty(),
    check('description', 'La description est requise').optional().not().isEmpty(),
    check('price', 'Le prix doit être un nombre positif').optional().isFloat({ min: 0 }),
    check('quantity', 'La quantité doit être un nombre entier positif').optional().isInt({ min: 0 })
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.array()
    });
  }
  
  try {
    let product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Produit non trouvé'
      });
    }
    
    // CORRECTION: Vérifier si req.user.id existe, sinon utiliser req.user.user.id
    const userId = req.user.id || (req.user.user && req.user.user.id);
    const userRole = req.user.role || (req.user.user && req.user.user.role);
    
    console.log("Auth middleware user:", req.user);
    console.log("User ID pour la mise à jour:", userId);
    console.log("Rôle utilisateur:", userRole);
    console.log("ID propriétaire du produit:", product.user.toString());
    
    // Si vous voulez permettre à tous les utilisateurs connectés de modifier n'importe quel produit,
    // commentez cette condition ou modifiez-la selon vos besoins
    /*
    if (product.user.toString() !== userId && userRole !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Non autorisé à modifier ce produit'
      });
    }
    */
    
    const { name, description, price, quantity } = req.body;
    
    // Mettre à jour les champs si fournis
    if (name) product.name = name;
    if (description) product.description = description;
    if (price !== undefined) product.price = price;
    if (quantity !== undefined) product.quantity = quantity;
    
    await product.save();
    
    res.json({
      status: 'success',
      data: product
    });
  } catch (error) {
    console.error(error.message);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        status: 'error',
        message: 'Produit non trouvé'
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Erreur serveur'
    });
  }
});

// Supprimer un produit
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Produit non trouvé'
      });
    }
    
    // CORRECTION: Vérifier si req.user.id existe, sinon utiliser req.user.user.id
    const userId = req.user.id || (req.user.user && req.user.user.id);
    const userRole = req.user.role || (req.user.user && req.user.user.role);
    
    console.log("Auth middleware user:", req.user);
    console.log("User ID pour la suppression:", userId);
    console.log("Rôle utilisateur:", userRole);
    console.log("ID propriétaire du produit:", product.user.toString());
    
    // Si vous voulez permettre à tous les utilisateurs connectés de supprimer n'importe quel produit,
    // commentez cette condition ou modifiez-la selon vos besoins
    /*
    if (product.user.toString() !== userId && userRole !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Non autorisé à supprimer ce produit'
      });
    }
    */
    
    // CORRECTION: Utiliser deleteOne() au lieu de remove() qui est déprécié
    await Product.deleteOne({ _id: product._id });
    
    res.json({
      status: 'success',
      message: 'Produit supprimé'
    });
  } catch (error) {
    console.error(error.message);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        status: 'error',
        message: 'Produit non trouvé'
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Erreur serveur'
    });
  }
});

module.exports = router;