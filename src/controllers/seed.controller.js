const bcrypt = require('bcrypt');
const Product = require('../models/Product');
const User = require('../models/User');
const products = require('../data/products.json');

async function createAdminIfNotExists() {
  try {
    // Verificar si ya existe un admin
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      return adminExists._id;
    }

    // Crear admin por defecto
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await User.create({
      name: 'Admin',
      email: 'admin@ecartpay.com',
      password: hashedPassword,
      role: 'admin'
    });

    return adminUser._id;
  } catch (error) {
    throw new Error('Error al crear usuario admin: ' + error.message);
  }
}

async function seedProducts(adminId) {
  try {
    // Transformar productos
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

    return transformedProducts.length;
  } catch (error) {
    throw new Error('Error al crear productos: ' + error.message);
  }
}

const seedDatabase = async (req, res) => {
  try {
    // Verificar API Key
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== process.env.API_KEY) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado'
      });
    }

    // Crear admin y obtener su ID
    const adminId = await createAdminIfNotExists();

    // Crear productos
    const productsCount = await seedProducts(adminId);

    res.status(200).json({
      success: true,
      message: `Base de datos poblada exitosamente. ${productsCount} productos creados.`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al poblar la base de datos',
      error: error.message
    });
  }
};

module.exports = {
  seedDatabase
}; 