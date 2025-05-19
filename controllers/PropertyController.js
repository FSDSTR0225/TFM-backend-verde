const Property = require("../models/propertyModel");
const ContractCategory = require("../models/contractCategoryModel");
const TypeCategory = require("../models/typeCategoryModel");

/**
 * Get all of properties
 * GET /tareas
 */

const getProperties = async (req, res) => {
  try {
    // Utilizamos populate para incluir información del propietario
    const properties = await Property.find({})
      .populate("contractCategory")
      .populate("typeCategory");

    res.json(properties);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

/**
 * Get a property by id
 * GET /tareas/:id
 */
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate("contractCategory")
      .populate("typeCategory");

    if (!property) {
      return res.status(404).json({ msg: "Property did not find" });
    }

    res.json(property);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

/**
 * Create a new property
 * POST /tareas
 */
const createProperty = async (req, res) => {
  try {
    const {
      title,
      desc,
      location,
      price,
      duration,
      bedrooms,
      bathrooms,
      pets,
      couples,
      minors,
      owner,
      contractCategory,
      typeCategory,
      city,
    } = req.body;

    // Validating the input datas
    if (
      !title ||
      !desc ||
      !location ||
      !price ||
      !duration ||
      !bedrooms ||
      !bathrooms ||
      !pets ||
      !couples ||
      !minors ||
      !owner ||
      !contractCategory ||
      !typeCategory ||
      !city
    ) {
      return res.status(400).json({ msg: "one or more data did not send" });
    }

    const thiscontractCategory = await ContractCategory.findOne({
      name: contractCategory,
    });
    if (!thiscontractCategory) {
      return res.status(400).json({ msg: "contract category did not match" });
    }

    const thistypeCategory = await TypeCategory.findOne({
      name: typeCategory,
    });
    if (!thistypeCategory) {
      return res.status(400).json({ msg: "type Category did not match" });
    }

    // if (Property.findOne({ title: title })) {
    //   return res
    //     .status(409)
    //     .json({ msg: "this property existed try another one" });
    // }

    // create a new property
    const newProperty = await Property.create({
      title: title,
      desc: desc,
      location: location,
      price: price,
      duration: duration,
      bedrooms: bedrooms,
      bathrooms: bathrooms,
      pets: pets,
      couples: couples,
      minors: minors,
      owner: owner || null, // Si no se proporciona owner, será null,
      contractCategory: thiscontractCategory,
      typeCategory: thistypeCategory,
      city: city,
    });

    res.status(201).json({
      msg: "Property successfully created",
      id: newProperty._id,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

/**
 * Edit a property by Id
 * PUT /properties/:id
 */
const updateProperty = async (req, res) => {
  try {
    const {
      title,
      desc,
      location,
      price,
      duration,
      bedrooms,
      bathrooms,
      pets,
      couples,
      minors,
    } = req.body;

    // Validating the input datas
    if (
      !title ||
      !desc ||
      !location ||
      !price ||
      !duration ||
      !bedrooms ||
      !bathrooms ||
      !pets ||
      !couples ||
      !minors
    ) {
      return res.status(400).json({ msg: "one or more data did not send" });
    }

    updateData = {
      title: title,
      desc: desc,
      location: location,
      price: price,
      duration: duration,
      bedrooms: bedrooms,
      bathrooms: bathrooms,
      pets: pets,
      couples: couples,
      minors: minors,
    };
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate("owner", "nombre");

    if (!property) {
      return res.status(404).json({ msg: "Property no encontrada" });
    }
    res.status(201).json({ msg: "Property edited successfully", property });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

/**
 * Delete a property
 * DELETE /properties/:id
 */
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);

    if (!property) {
      return res.status(404).json({ msg: "Property did not find" });
    }

    res.json({ msg: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

/**
 * Asignar un property to a property
 * PUT /properties/:id/assign
 */
const assignOwner = async (req, res) => {
  try {
    const { ownerId } = req.body;

    if (!ownerId) {
      return res.status(400).json({ msg: "Falta el ID del propietario" });
    }

    // Edit the property with id
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { owner: ownerId },
      { new: true }
    ).populate("owner", "nombre");

    if (!property) {
      return res.status(404).json({ msg: "Property no encontrada" });
    }

    res.json({ msg: "Propietario asignado correctamente", property });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

/**
 * find property with owner Id
 * GET /properties/owner/:ownerId
 */
const getPropertiesByOwner = async (req, res) => {
  try {
    const ownerId = req.params.ownerId;
    const properties = await Property.find({ owner: ownerId }).populate(
      "owner",
      "nombre"
    );
    res.json(properties);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
const getPropertiesByCity = async (req, res) => {
  try {
    const city = req.params.cityName;
    const properties = await Property.find({ city: city })
      .populate("contractCategory")
      .populate("typeCategory");
    res.status(200).json({ msg: "success", properties });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

/**
/**
 * Sign a typeCategory to a property
 * PUT /tareas/:id/settypeCategory
 */
const assignCategoryToProperty = async (req, res) => {
  try {
    const { typeCategoryId } = req.body;

    if (!typeCategoryId) {
      return res.status(400).json({ msg: "Falta el ID del typeCategory" });
    }

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { typeCategory: typeCategoryId },
      { new: true }
    ).populate("typeCategory", "title");

    if (!property) {
      return res.status(404).json({ msg: "Property no encontrada" });
    }

    res.json({ msg: "typeCategory asignado correctamente", property });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

/**
    // Get a Category by Id
 * GET /tareas/typeCategory/:typeCategoryId
 */
const getPropertiesByCategory = async (req, res) => {
  try {
    const typeCategoryId = req.params.typeCategoryId;

    const properties = await Property.find({
      typeCategory: typeCategoryId,
    }).populate("typeCategory", "title");

    res.status(200).json({ msg: "tareas find successfully", properties });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  assignOwner,
  getPropertiesByOwner,
  getPropertiesByCity,
  assignCategoryToProperty,
  getPropertiesByCategory,
};
