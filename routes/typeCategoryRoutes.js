const express = require("express");
const router = express.Router();
const {
  getTypeCategorys,
  getTypeCategoryById,
  createTypeCategory,
  updateTypeCategory,
  deleteTypeCategory,
  // searchTypeCategoriesByName,
  // assignOwner,
  // getCategorysByOwner
} = require("../controllers/typeCategoryController");

router.get("/", getTypeCategorys);
router.get("/:id", getTypeCategoryById);
router.post("/", createTypeCategory);
router.put("/:id", updateTypeCategory);
router.delete("/:id", deleteTypeCategory);

// Route for find category with its name
// router.get("/buscar/:titulo", searchTypeCategoriesByName);

module.exports = router;
