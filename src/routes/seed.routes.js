const express = require('express');
const router = express.Router();
const { seedDatabase } = require('../controllers/seed.controller');
const { apiKeyMiddleware } = require('../middlewares/apiKey.middleware');

// Ruta protegida por API Key para poblar la base de datos
router.post('/database', apiKeyMiddleware, seedDatabase);

module.exports = router; 