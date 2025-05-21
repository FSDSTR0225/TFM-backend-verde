const express = require("express");
const router = express.Router();

const multer = require("multer");

const storage = multer.diskStorage({
  destination: "images/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only JPEG and PNG files are allowed"), false);
  },
});

const {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getPropertiesByOwner,
  getPropertiesByCity,
  getPropertiesSearch,
} = require("../controllers/PropertyController");

router.get("/", getProperties);
router.get("/:id", getPropertyById);
router.post("/", upload.single("file"), createProperty);
router.put("/:id", updateProperty);
router.delete("/:id", deleteProperty);
router.get("/owner/:ownerId", getPropertiesByOwner);
router.get("/city/:cityName", getPropertiesByCity);
router.get("/search/:cityName/:contract/:type", getPropertiesSearch);

module.exports = router;
