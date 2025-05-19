const mongoose = require("mongoose");

// Definimos el esquema de usuario
const userSchema = new mongoose.Schema(
  {
    username: {
      // Strings have enum, match, minLength, and maxLength validators.
      type: String,
      required: true,
      unique: true,
      minLength: 6,
      maxLength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /.+\@.+\..+/, // Simple email regex pattern
    },
    password: {
      type: String,
      required: true,
      // select: false  Do not return the field in queries
    },
    recentSearches: {
      type: Object,
      required: false,
    },
    messages: {
      type: Object,
      required: false,
    },
    favorites: {
      type: Array,
      required: false,
    },
  },
  {
    timestamps: true, // add  createdAt and updatedAt field automaticaly
  }
);

// Creamos el modelo a partir del esquema
const User = mongoose.model("User", userSchema);

module.exports = User;
