const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { limiter, helmet, mongoSanitize, corsOptions } = require('./middlewares/security.middleware');
const sanitizeMiddleware = require('./middlewares/sanitize.middleware');
const errorHandler = require('./middlewares/errorHandler');
const swagger = require('./config/swagger');

const app = express();

// Middlewares
app.use(helmet());
app.use(mongoSanitize());
app.use(limiter);
app.use(cors(corsOptions));
app.use(sanitizeMiddleware);
app.use(bodyParser.json({
  limit: '10kb'
}));
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '10kb'
}));

// Swagger UI
app.use('/api-docs', swagger.serve, swagger.setup);

// Rutas
app.use('/api/v1/auth', require('./routes/auth.routes'));
app.use('/api/v1/products', require('./routes/products.routes'));

// Manejador de errores global
app.use(errorHandler);

module.exports = app; 