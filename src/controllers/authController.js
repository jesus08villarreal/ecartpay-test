const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const AccessToken = require('../models/AccessToken');

// Obtener JWT_SECRET con valor por defecto
const JWT_SECRET = process.env.JWT_SECRET || 'temporary_secret_key_123456';
console.log('JWT_SECRET:', JWT_SECRET);
const authController = {
  // Registro de usuarios
  register: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // Verificar si el usuario ya existe
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'El email ya está registrado'
        });
      }

      // Crear nuevo usuario
      const user = new User({ email, password });
      await user.save();

      // Generar token
      const token = jwt.sign(
        { userId: user._id },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Guardar token en la base de datos
      const accessToken = new AccessToken({
        token,
        userId: user._id,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas
      });
      await accessToken.save();

      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: {
          user: {
            id: user._id,
            email: user.email,
            role: user.role
          },
          token
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // Login de usuarios
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // Buscar usuario
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }

      // Verificar contraseña
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }

      // Generar token
      const token = jwt.sign(
        { userId: user._id },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Guardar token en la base de datos
      const accessToken = new AccessToken({
        token,
        userId: user._id,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas
      });
      await accessToken.save();

      res.json({
        success: true,
        message: 'Login exitoso',
        data: {
          user: {
            id: user._id,
            email: user.email,
            role: user.role
          },
          token
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // Cerrar sesión
  logout: async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      
      // Invalidar token
      await AccessToken.findOneAndUpdate(
        { token },
        { isValid: false }
      );

      res.json({
        success: true,
        message: 'Sesión cerrada exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController; 