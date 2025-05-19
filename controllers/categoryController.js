const Category = require("../models/CategoryModel");

/**
 * Get all of categories
 * GET /categories
 */
const getCategorys = async (req, res) => {
  try {
    const categorys = await Category.find({});
    res.json(categorys);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

/**
 * Get a category by ID
 * GET /categories/:id
 */
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ msg: "category no encontrado" });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

/**
 * Create a new category
 * POST /categories
 */
const createCategory = async (req, res) => {
  try {
    const { titulo, descripcion } = req.body;

    // Validación de campos obligatorios
    if (!titulo || !descripcion) {
      return res.status(400).json({ msg: "Falta titulo o descripcion" });
    }

    // Crear nuevo usuario en la base de datos
    const newCategory = await Category.create({ titulo, descripcion });

    res.status(201).json({
      msg: "Category creado con éxito",
      id: newCategory._id,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

/**
 * Edit a category
 * PUT /categories/:id
 */
const updateCategory = async (req, res) => {
  try {
    const { titulo, descripcion } = req.body;

    if (!titulo || !descripcion) {
      return res.status(400).json({ msg: "Falta titulo o descripcion" });
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { titulo, descripcion },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ msg: "category no encontrado" });
    }

    res.json({ msg: "category actualizado", category });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

/**
 * Delete a category by Id
 * DELETE /categories/:id
 */
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ msg: "category no encontrado" });
    }

    res.json({ msg: "category eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

/**
 * Search a category by title
 * GET /categories/search/:title
 */
const searchCategoriesByName = async (req, res) => {
  try {
    const titulo = req.params.titulo;

    const categorys = await Category.find({
      titulo: { $regex: titulo, $options: "i" },
    });
    res.status(200).json({ categorys });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  getCategorys,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  searchCategoriesByName,
};
