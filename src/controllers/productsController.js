const Product = require('../models/Product');

const productsController = {
  // Obtener todos los productos
  getAllProducts: async (req, res, next) => {
    try {
      const products = await Product.find()
        .populate('createdBy', 'email')
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        data: products
      });
    } catch (error) {
      next(error);
    }
  },

  // Obtener un producto por ID
  getProductById: async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id)
        .populate('createdBy', 'email');

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Producto no encontrado'
        });
      }

      res.json({
        success: true,
        data: product
      });
    } catch (error) {
      next(error);
    }
  },

  // Crear un nuevo producto
  createProduct: async (req, res, next) => {
    try {
      const product = new Product({
        ...req.body,
        createdBy: req.user._id
      });

      await product.save();

      res.status(201).json({
        success: true,
        message: 'Producto creado exitosamente',
        data: product
      });
    } catch (error) {
      next(error);
    }
  },

  // Actualizar un producto
  updateProduct: async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Producto no encontrado'
        });
      }

      // Verificar si el usuario es el creador del producto
      if (product.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permiso para actualizar este producto'
        });
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      res.json({
        success: true,
        message: 'Producto actualizado exitosamente',
        data: updatedProduct
      });
    } catch (error) {
      next(error);
    }
  },

  // Eliminar un producto
  deleteProduct: async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Producto no encontrado'
        });
      }

      // Verificar si el usuario es el creador del producto
      if (product.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permiso para eliminar este producto'
        });
      }

      await Product.findByIdAndDelete(req.params.id);

      res.json({
        success: true,
        message: 'Producto eliminado exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = productsController; 