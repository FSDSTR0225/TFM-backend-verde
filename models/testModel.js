const mongoose = require("mongoose");

const TestSchema = new mongoose.Schema(
  {
    image: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

const Test = mongoose.model("Test", TestSchema);

module.exports = Test;
