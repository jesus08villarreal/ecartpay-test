const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

// Rate limiting
const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000,
  max: process.env.RATE_LIMIT_MAX || 100,
  message: {
    success: false,
    message: 'Demasiadas peticiones, por favor intente más tarde'
  }
});

// Configuración de CORS más segura
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  maxAge: 3600,
  optionsSuccessStatus: 200
};

const configSecurity = (app) => {
  // Aplicar CORS antes que cualquier otro middleware
  app.use(cors(corsOptions));
  // Aplicar helmet con configuración segura
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "same-origin" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", process.env.CORS_ORIGIN],
        frameSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "blob:"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  }));
  app.use(mongoSanitize());
  app.use(limiter);
};

// Exportar middlewares de seguridad
module.exports = {
  limiter,
  helmet,
  mongoSanitize,
  corsOptions,
  configSecurity
}; 