const express = require("express");
const router = express.Router();
const {
  getAllTest,
  getTestById,
  getAllTestByProvince,
  createTest,
  editTest,
  deleteTest,
  searchTestByName,
} = require("../controllers/testController");

router.get("/all", getAllTest);
router.get("/all/:id", getTestById);
router.get("/province/:proName", getAllTestByProvince);
router.post("/", createTest);
router.put("/:id", editTest);
router.delete("/:id", deleteTest);
router.get("/search/:name", searchTestByName);

module.exports = router;
