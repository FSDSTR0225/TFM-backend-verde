const mongoose = require("mongoose");

// Definimos el esquema de tarea
const contractCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: ["BUY", "RENT", "SHARE"],
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

const ContractCategory = mongoose.model("ContractCategory", contractCategorySchema);

module.exports = ContractCategory;
