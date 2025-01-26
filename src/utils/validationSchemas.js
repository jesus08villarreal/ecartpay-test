const Joi = require('joi');

// Esquema para registro de usuarios
const registerSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'El email debe tener un formato válido',
      'any.required': 'El email es requerido'
    }),
  
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'La contraseña debe tener al menos 6 caracteres',
      'any.required': 'La contraseña es requerida'
    })
});

// Esquema para login
const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'El email debe tener un formato válido',
      'any.required': 'El email es requerido'
    }),
  
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'La contraseña es requerida'
    })
});

// Esquema para productos
const productSchema = Joi.object({
  name: Joi.string()
    .required()
    .min(3)
    .messages({
      'string.min': 'El nombre debe tener al menos 3 caracteres',
      'any.required': 'El nombre es requerido'
    }),

  description: Joi.string()
    .required()
    .min(10)
    .messages({
      'string.min': 'La descripción debe tener al menos 10 caracteres',
      'any.required': 'La descripción es requerida'
    }),

  price: Joi.number()
    .required()
    .min(0)
    .messages({
      'number.min': 'El precio no puede ser negativo',
      'any.required': 'El precio es requerido'
    }),

  stock: Joi.number()
    .required()
    .min(0)
    .messages({
      'number.min': 'El stock no puede ser negativo',
      'any.required': 'El stock es requerido'
    }),

  category: Joi.string()
    .required()
    .messages({
      'any.required': 'La categoría es requerida'
    })
});

module.exports = {
  registerSchema,
  loginSchema,
  productSchema
}; 