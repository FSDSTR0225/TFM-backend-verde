const express = require("express");
const router = express.Router();
const {
  getContractCategorys,
  getContractCategoryById,
  createContractCategory,
  updateContractCategory,
  deleteContractCategory,
  // searchContractCategoriesByName,
  // assignOwner,
  // getCategorysByOwner
} = require("../controllers/contractCategoryController");

router.get("/", getContractCategorys);
router.get("/:id", getContractCategoryById);
router.post("/", createContractCategory);
router.put("/:id", updateContractCategory);
router.delete("/:id", deleteContractCategory);

// Route for find category with its name
// router.get("/buscar/:titulo", searchContractCategoriesByName);

module.exports = router;
