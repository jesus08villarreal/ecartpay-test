const express = require('express');
const router = express.Router();
const { seedDatabase } = require('../controllers/seedController');
const apiKeyMiddleware = require('../middlewares/apiKey.middleware');

// Ruta protegida con API key para poblar la base de datos
router.post('/database', apiKeyMiddleware, seedDatabase);

module.exports = router; 