const mongoose = require("mongoose");

const typeCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: ["Apartment", "Villa", "Office", "Garage", "Land", "Warehouse"],
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
