const API_KEY = process.env.API_KEY;

const apiKeyMiddleware = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    
    if (!API_KEY) {
        console.error('API_KEY no está configurada en las variables de entorno');
        return res.status(500).json({
            success: false,
            message: 'Error de configuración del servidor'
        });
    }

    if (!apiKey || apiKey !== API_KEY) {
        return res.status(401).json({
            success: false,
            message: 'API Key inválida o no proporcionada'
        });
    }
    
    next();
};

module.exports = apiKeyMiddleware; 