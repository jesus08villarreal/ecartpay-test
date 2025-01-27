const bcrypt = require('bcrypt');
const User = require('../models/User');
const Product = require('../models/Product');
const products = require('../data/products.json');

const seedDatabase = async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({
        success: false,
        message: 'Esta ruta no está disponible en producción'
      });
    }

    // Crear usuario admin si no existe
    const adminExists = await User.findOne({ email: 'admin@ecartpay.com' });
    let adminId;

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('Admin123!', 10);
      const admin = await User.create({
        name: 'Admin',
        email: 'admin@ecartpay.com',
        password: hashedPassword,
        role: 'admin'
      });
      adminId = admin._id;
      console.log('Usuario admin creado');
    } else {
      adminId = adminExists._id;
      console.log('Usuario admin ya existe');
    }

    // Transformar y crear productos
    const transformedProducts = products.map(product => ({
      name: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.rating.count,
      imageUrl: product.image,
      createdBy: adminId
    }));

    // Eliminar productos existentes
    await Product.deleteMany({});
    
    // Insertar nuevos productos
    await Product.insertMany(transformedProducts);

    res.status(200).json({
      success: true,
      message: 'Base de datos poblada exitosamente',
      details: {
        adminEmail: 'admin@ecartpay.com',
        adminPassword: 'Admin123!',
        productsCount: transformedProducts.length
      }
    });
  } catch (error) {
    console.error('Error en el seeding:', error);
    res.status(500).json({
      success: false,
      message: 'Error al poblar la base de datos',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  seedDatabase
}; 