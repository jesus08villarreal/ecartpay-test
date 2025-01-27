const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdminUser = async () => {
  let connection;
  try {
    // Conectar a la base de datos
    connection = await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
    
    // Verificar si ya existe un admin
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    
    if (!adminExists) {
      const admin = new User({
        email: 'admin@example.com',
        password: 'admin123456',
        role: 'admin'
      });
      
      await admin.save();
      console.log('✅ Usuario admin creado exitosamente');
    } else {
      console.log('ℹ️ El usuario admin ya existe');
    }
    
  } catch (error) {
    console.error('❌ Error en script de seed:', error.message);
    // No terminamos el proceso aquí para permitir que la aplicación continúe
  } finally {
    // Solo cerramos la conexión si este script se ejecuta independientemente
    if (process.env.NODE_ENV !== 'production') {
      await connection?.close();
    }
  }
};

// Si el script se ejecuta directamente (no importado como módulo)
if (require.main === module) {
  createAdminUser()
    .then(() => {
      if (process.env.NODE_ENV !== 'production') {
        process.exit(0);
      }
    })
    .catch(() => {
      if (process.env.NODE_ENV !== 'production') {
        process.exit(1);
      }
    });
} else {
  // Exportar para uso como módulo
  module.exports = createAdminUser;
} 