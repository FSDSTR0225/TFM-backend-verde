const Test = require("../models/testModel");

const getAllTest = async (req, res) => {
  try {
    const cities = await Test.find({});
    res.json(cities);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getTestById = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ msg: "Test did not find !" });
    }
    res.json(test);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getAllTestByProvince = async (req, res) => {
  try {
    const citiesArr = await Test.find({ province: req.params.proName });
    if (!citiesArr.length) {
      return res.status(404).json({ msg: "no Test found in this province !" });
    }
    return res.status(200).json(citiesArr);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const createTest = async (req, res) => {
  try {
    const data = req.body;

    // Validación de campos obligatorios
    if (!data) {
      return res.status(400).json({ msg: "error with  name or province" });
    }

    const newTest = await Test.create({
        image: image,
    });
    res.status(201).json({
      msg: "new Test created successfully",
      test: newTest,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const editTest = async (req, res) => {
  try {
    const { province, name } = req.body;

    // Validación de campos obligatorios
    if (!province || !name) {
      return res.status(400).json({ msg: "error with  name or province" });
    }

    const test = await Test.findByIdAndUpdate(
      req.params.id,
      { province, name },
      { new: true }
    );
    if (!test) {
      return res.status(404).json({ msg: "User did not find ! " });
    }
    res.status(201).json({ msg: " Test updated successfully", test });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const deleteTest = async (req, res) => {
  try {
    const test = await Test.findByIdAndDelete(req.params.id);

    if (!test) {
      return res.status(404).json({ msg: "Test did not find !" });
    }

    res.status(200).json({ msg: "Test deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const searchTestByName = async (req, res) => {
  const test = await Test.findOne({ name: req.params.name });

  if (!test) {
    return res.status(404).json({ msg: "Test did not find !" });
  }
  res.status(200).json({ msg: "Test found successfully", test });
  try {
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  getAllTest,
  getTestById,
  getAllTestByProvince,
  createTest,
  editTest,
  deleteTest,
  searchTestByName,
};
