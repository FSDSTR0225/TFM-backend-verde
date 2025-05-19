const mongoose = require("mongoose");

// Definimos el esquema de tarea
const CategorySchema = new mongoose.Schema(
  {
    contract: {
      type: String,
      enum: ["BUY", "SELL", "SHARE"],
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ["Office", "Villa", "Garage", "Apartment"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;
