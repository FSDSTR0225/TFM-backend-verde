const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
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
      // select: false  //Do not return the field in queries
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
    timestamps: true, 
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
