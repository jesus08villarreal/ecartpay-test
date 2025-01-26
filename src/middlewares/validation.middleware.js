const validateSchema = (schema) => {
  return (req, res, next) => {
    try {
      const { error } = schema.validate(req.body, { 
        abortEarly: false,
        stripUnknown: true 
      });

      if (error) {
        const errors = error.details.map(err => ({
          field: err.path[0],
          message: err.message
        }));

        return res.status(400).json({
          success: false,
          message: 'Error de validación',
          errors
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  validateSchema
}; 