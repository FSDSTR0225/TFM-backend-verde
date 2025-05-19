const TypeCategory = require("../models/typeCategoryModel");

/**
 * Obtener todos los typeCategories
 * GET /categories
 */
const getTypeCategorys = async (req, res) => {
  try {
    const typeCategories = await TypeCategory.find({});
    res.json(typeCategories);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

/**
 * Obtener un typeCategory específico por ID
 * GET /categories/:id
 */
const getTypeCategoryById = async (req, res) => {
  try {
    const typeCategory = await TypeCategory.findById(req.params.id);

    if (!typeCategory) {
      return res.status(404).json({ msg: "typeCategory no encontrado" });
    }

    res.json(typeCategory);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

/**
 * Crear un nuevo typeCategory
 * POST /categories
 */
const createTypeCategory = async (req, res) => {
  try {
    const { name, desc } = req.body;

    // Validación de campos obligatorios
    if (!name || !desc) {
      return res.status(400).json({ msg: "error on name or desc" });
    }

    // Crear nuevo usuario en la base de datos
    const newCategory = await TypeCategory.create({ name, desc });

    res.status(201).json({
      msg: "TypeCategory crteated successfully",
      id: newCategory._id,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

/**
 * Actualizar un typeCategory existente
 * PUT /categories/:id
 */
const updateTypeCategory = async (req, res) => {
  try {
    const { name, desc } = req.body;

    // Validación de campos obligatorios
    if (!name || !desc) {
      return res.status(400).json({ msg: "error on name or desc" });
    }

    // Buscar y actualizar el usuario
    const typeCategory = await TypeCategory.findByIdAndUpdate(
      req.params.id,
      { name, desc },
      { new: true } // Devuelve el documento actualizado
    );

    if (!typeCategory) {
      return res.status(404).json({ msg: "typeCategory not found" });
    }

    res.json({ msg: "typeCategory edited", typeCategory });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

/**
 * Eliminar un typeCategory
 * DELETE /categories/:id
 */
const deleteTypeCategory = async (req, res) => {
  try {
    const typeCategory = await TypeCategory.findByIdAndDelete(req.params.id);

    if (!typeCategory) {
      return res.status(404).json({ msg: "typeCategory no encontrado" });
    }

    res.json({ msg: "typeCategory eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

/**
 * Buscar categories por name (solución del ejercicio anterior)
 * GET /categories/buscar/:name
 */
// const searchTypeCategoriesByName = async (req, res) => {
//   try {
//     const name = req.params.name;
//       // Buscar categories cuyo name contenga el texto buscado (insensible a mayúsculas/minúsculas)
//     const typeCategories = await TypeCategory.find({
//       name: { $regex: name, $options: 'i' }   //regex muy importante aqui
//     });
//     res.status(200).json({ typeCategories });
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };



module.exports = {
  getTypeCategorys,
  getTypeCategoryById,
  createTypeCategory,
  updateTypeCategory,
  deleteTypeCategory,
  // searchTypeCategoriesByName,
};
