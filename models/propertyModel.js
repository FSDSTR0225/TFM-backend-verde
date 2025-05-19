const mongoose = require("mongoose");

// Definimos el esquema de tarea
const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    desc: {
      type: String,
      required: true,
      unique: true,
    },

    location: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    bedrooms: {
      type: String,
      required: true,
    },
    bathrooms: {
      type: String,
      required: true,
    },
    pets: {
      type: String,
      required: true,
    },
    couples: {
      type: String,
      required: true,
    },
    minors: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    contractCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ContractCategory",
      required: true,
    },
    typeCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TypeCategory",
      required: true,
    },
    image: {
      type: Object,
      required: false,
    },
    city: {
      type: String,
      required: true,
    },
    // infos: {
    //   //  metraj / tedade otagh / saale sakht / moble boodan
    //   type: String,
    //   required: false,
    // },
  },
  {
    timestamps: true, // Add fields created at and updated  automatically
  }
);

// Creamos el modelo a partir del esquema
const Property = mongoose.model("Property", propertySchema);

module.exports = Property;
