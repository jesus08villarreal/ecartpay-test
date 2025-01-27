require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const products = require('../data/products.json');

async function createAdminUser() {
  try {
    // Conectar a MongoDB si aún no está conectado
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
    }

    // Verificar si existe la colección de usuarios
    const collections = await mongoose.connection.db.listCollections().toArray();
    const userCollection = collections.find(c => c.name === 'users');
    
    if (!userCollection) {
      console.error('No existe la colección de usuarios. Por favor, crea un usuario primero.');
      process.exit(1);
    }

    // Buscar el primer usuario admin
    const adminUser = await mongoose.connection.db.collection('users').findOne({ role: 'admin' });
    
    if (!adminUser) {
      console.error('No se encontró ningún usuario admin. Por favor, crea un usuario admin primero.');
      process.exit(1);
    }

    return adminUser._id;
  } catch (error) {
    console.error('Error al buscar usuario admin:', error);
    process.exit(1);
  }
}

async function seedProducts() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Conectado a MongoDB');

    // Obtener el ID del usuario admin
    const adminId = await createAdminUser();
    console.log('Usuario admin encontrado');

    // Transformar productos al formato correcto
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
    console.log('Productos existentes eliminados');

    // Insertar nuevos productos
    const result = await Product.insertMany(transformedProducts);
    console.log(`${result.length} productos insertados correctamente`);

    // Cerrar conexión
    await mongoose.connection.close();
    console.log('Conexión cerrada');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

seedProducts(); 