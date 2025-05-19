const express = require("express");
const router = express.Router();

const multer = require("multer");

// const storage = multer.diskStorage({  //my sample
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });
// const upload = multer({ storage: storage });

// const upload = multer({      //make limitatioin
//   limits: { fileSize: 1 * 1024 * 1024, files: 5 }
// });

//filter type of file to upload
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//     cb(null, true);
//   } else {
//     cb(new Error('Only JPEG and PNG files are allowed'), false);
//   }
// };
// const upload = multer({ fileFilter: fileFilter });

// const multerS3 = require('multer-s3');
// const s3 = new aws.S3();

// const upload = multer({    //storage engines
//   storage: multerS3({
//     s3: s3,
//     bucket: 'your-bucket-name',
//     key: function (req, file, cb) {
//       cb(null, Date.now().toString() + '-' + file.originalname);
//     }
//   })
// });

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
  // assignOwner,
  // assignCategoryToProperty,
  // getPropertysByCategory,
} = require("../controllers/PropertyController");

// Rutas CRUD básicas para tareas
router.get("/", getProperties);
router.get("/:id", getPropertyById);
router.post("/", upload.single("file"), createProperty);
router.put("/:id", updateProperty);
router.delete("/:id", deleteProperty);
router.get("/owner/:ownerId", getPropertiesByOwner);
router.get("/city/:cityName", getPropertiesByCity);

// Rutas específicas para relaciones
// router.put("/:id/assign", assignOwner);
// router.put("/:id/setcategory", assignCategoryToProperty);
// router.get("/category/:categoryId", getPropertysByCategory);

module.exports = router;
