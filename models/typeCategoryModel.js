const mongoose = require("mongoose");

// Definimos el esquema de tarea
const typeCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: ["Office", "Villa", "Garage", "Apartment"],
      required: true,
      unique: true,
    },
    desc: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const TypeCategory = mongoose.model("TypeCategory", typeCategorySchema);

module.exports = TypeCategory;
