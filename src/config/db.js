const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Usar MONGODB_URI (proporcionado por Heroku) o MONGO_URI local
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB conectado exitosamente');
  } catch (err) {
    console.error('❌ Error conectando a MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB; 