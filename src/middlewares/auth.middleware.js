const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AccessToken = require('../models/AccessToken');

// Obtener JWT_SECRET con valor por defecto
const JWT_SECRET = process.env.JWT_SECRET || 'temporary_secret_key_123456';
console.log('JWT_SECRET:', JWT_SECRET);

const authMiddleware = async (req, res, next) => {
  try {
    // 1. Obtener el token del header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token de acceso no proporcionado' 
      });
    }

    const token = authHeader.split(' ')[1];

    // 2. Verificar si el token existe y es válido en la base de datos
    const accessToken = await AccessToken.findOne({ 
      token, 
      isValid: true,
      expiresAt: { $gt: new Date() }
    });

    if (!accessToken) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token inválido o expirado' 
      });
    }

    // 3. Verificar y decodificar el token
    const decoded = jwt.verify(token, JWT_SECRET);

    // 4. Buscar el usuario
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Usuario no encontrado' 
      });
    }

    // 5. Agregar el usuario al objeto request
    req.user = user;
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token inválido' 
      });
    }
    next(error);
  }
};

module.exports = authMiddleware; 