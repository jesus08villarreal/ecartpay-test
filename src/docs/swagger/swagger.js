const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Backend Catalog API',
      version: '1.0.0',
      description: 'API REST para catálogo de productos'
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://ecartpay-api.onrender.com'  // URL fija de producción
          : 'http://localhost:5000',
        description: process.env.NODE_ENV === 'production' ? 'Servidor de producción' : 'Servidor de desarrollo'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./src/routes/*.js']
};

module.exports = swaggerJsdoc(options); 