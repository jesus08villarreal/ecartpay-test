const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
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
    
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('❌ Error creando usuario admin:', error);
    process.exit(1);
  }
};

createAdminUser(); 