const ContractCategory = require("../models/contractCategoryModel");

/**
 * Get all of contractCategories
 * GET /categories
 */
const getContractCategorys = async (req, res) => {
  try {
    const contractCategories = await ContractCategory.find({});
    res.json(contractCategories);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

/**
 * Find a category by Id
 * GET /categories/:id
 */
const getContractCategoryById = async (req, res) => {
  try {
    const contractCategory = await ContractCategory.findById(req.params.id);

    if (!contractCategory) {
      return res.status(404).json({ msg: "contractCategory not found" });
    }

    res.json(contractCategory);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

/**
 * Create a new category
 * POST /categories
 */
const createContractCategory = async (req, res) => {
  try {
    const { name, desc } = req.body;

    if (!name || !desc) {
      return res.status(400).json({ msg: "error on name or desc" });
    }

    const newCategory = await ContractCategory.create({ name, desc });

    res.status(201).json({
      msg: "ContractCategory crteated successfully",
      id: newCategory._id,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

/**
 * Edit a contractCategory
 * PUT /categories/:id
 */
const updateContractCategory = async (req, res) => {
  try {
    const { name, desc } = req.body;

    if (!name || !desc) {
      return res.status(400).json({ msg: "error on name or desc" });
    }

    const contractCategory = await ContractCategory.findByIdAndUpdate(
      req.params.id,
      { name, desc },
      { new: true }
    );

    if (!contractCategory) {
      return res.status(404).json({ msg: "contractCategory not found" });
    }

    res.json({ msg: "contractCategory edited", contractCategory });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

/**
 * Delete a contractCategory
 * DELETE /categories/:id
 */
const deleteContractCategory = async (req, res) => {
  try {
    const contractCategory = await ContractCategory.findByIdAndDelete(req.params.id);

    if (!contractCategory) {
      return res.status(404).json({ msg: "contractCategory no encontrado" });
    }

    res.json({ msg: "contractCategory eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

/**
 * Search a contractCategory by name (solución del ejercicio anterior)
 * GET /categories/buscar/:name
 */
// const searchContractCategoriesByName = async (req, res) => {
//   try {
//     const name = req.params.name;
//       // Buscar categories cuyo name contenga el texto buscado (insensible a mayúsculas/minúsculas)
//     const contractCategories = await ContractCategory.find({
//       name: { $regex: name, $options: 'i' }   //regex muy importante aqui
//     });
//     res.status(200).json({ contractCategories });
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };



module.exports = {
  getContractCategorys,
  getContractCategoryById,
  createContractCategory,
  updateContractCategory,
  deleteContractCategory,
  // searchContractCategoriesByName,
};
