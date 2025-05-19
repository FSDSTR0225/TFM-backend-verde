const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const userRoutes = require("./routes/userRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const contractCategoryRoutes = require("./routes/contractCategoryRoutes");
const typeCategoryRoutes = require("./routes/typeCategoryRoutes");
const cityRoutes = require("./routes/cityRoutes");
const newsRoutes = require("./routes/newsRoutes");
const testRoutes = require("./routes/testRoutes");

const upload = multer({ dest: "uploads/" });

const app = express();
const port = process.env.PORT || 3000;

// Middleware for proccesing JSON y datas of form
app.use(cors()); // Enable CORS for all requests
app.use(express.json());
app.use(express.urlencoded({ extended: false })); //true : when you wanna go deep in nested object
app.use(cookieParser());

// Conexión a MongoDB Atlas
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
  })
  .catch((error) => {
    console.error("<❌ Error in connecting Mongo DB :>", error);
  });

// Rutas de la API//
app.use("/users", userRoutes);
app.use("/properties", propertyRoutes);
app.use("/categories", categoryRoutes);
app.use("/contractCategory", contractCategoryRoutes);
app.use("/typeCategory", typeCategoryRoutes);
app.use("/cities", cityRoutes);
app.use("/news", newsRoutes);
app.use("/test", testRoutes);

// Ruta de bienvenida
app.get("/", (req, res) => {
  res.json({
    mensaje: "Users and properties API",
    endpoints: {
      users: "/users",
      properties: "/properties",
      categories: "/categories",
      contractCategory: "/contractCategory",
      typeCategory: "/typeCategory",
      cities: "/cities",
      news: "/news",
      test: "/test",
    },
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
