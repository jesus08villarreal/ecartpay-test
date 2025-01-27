const express = require('express');
const { configSecurity } = require('./middlewares/security.middleware');
const swaggerDocs = require('./docs/swagger/swagger');
const swaggerUi = require('swagger-ui-express');

const app = express();

// Aplicar configuraciones de seguridad
configSecurity(app);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  swaggerOptions: {
    persistAuthorization: true
  }
}));

// Rutas
app.use('/api/v1/auth', require('./routes/auth.routes'));
app.use('/api/v1/products', require('./routes/products.routes'));
app.use('/api/v1/seed', require('./routes/seed.routes'));

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = app; 