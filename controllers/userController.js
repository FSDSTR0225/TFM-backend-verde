const User = require("../models/userModel");
const Property = require("../models/propertyModel");
const Validator = require("../validators/validators");
// const { hash } = require("bcryptjs");
const jwt = require("jsonwebtoken");
const brevo = require("@getbrevo/brevo");
require("dotenv").config();

const secretKey = process.env.JWT_SECRET;

const getMe = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({ message: "Access token missing" });
    }

    const decoded = jwt.verify(token, secretKey);

    const user = await User.findOne({ username: decoded.username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({ message: "user identified correctly", user: user });
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: "User did not find !" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res
        .status(400)
        .json({ msg: "error with username, password or email" });
    }
    if (!Validator.passwordValidator(password)) {
      return res.status(400).json({ msg: "password is not acceptable" });
    }
    if (!Validator.emailValidator(email)) {
      return res.status(400).json({ msg: "email format is not acceptable" });
    }

    const newUser = await User.create({
      username: username,
      password: password,
      email: email,
    });
    const token = jwt.sign(
      {
        username: newUser.username,
        email: newUser.email,
        password: newUser.password,
      },
      process.env.JWT_SECRET
    );

    res.status(201).json({
      access_token: token,
      token_type: "Bearer",
      msg: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const sendMail = async (req, res) => {
  const { userId, type, subject } = req.body;

  if (!userId || !type || !subject) {
    return res
      .status(404)
      .json({ message: "error in userId or type or subject" });
  }

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const apiInstance = new brevo.TransactionalEmailsApi();
  let apiKey = apiInstance.authentications["apiKey"];
  apiKey.apiKey = process.env.BREVO_API_KEY;

  const sendSmtpEmail = new brevo.SendSmtpEmail();

  sendSmtpEmail.subject = subject;
  {
    type === "Welcome"
      ? (sendSmtpEmail.htmlContent = `<h1>Hello ${user.username} 👋</h1><p>Thanks for signing up!</p>`)
      : (sendSmtpEmail.htmlContent = `<p>Information from Casa verde!</p>`);
  }
  sendSmtpEmail.sender = {
    name: "Casa Verde",
    email: "tbandad@gmail.com",
  };
  sendSmtpEmail.to = [{ email: user.email, name: user.username }];
  sendSmtpEmail.replyTo = {
    name: "Casa Verde",
    email: "tbandad@gmail.com",
  };

  apiInstance.sendTransacEmail(sendSmtpEmail).then(
    function (data) {
      console.log(
        "API called successfully. Returned data: " + JSON.stringify(data)
      );
      res.send("Email sent successfully via Brevo API");
    },
    function (error) {
      console.error(error);
      res.status(500).send("Error sending email");
    }
  );
};

const updateUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validación de campos obligatorios
    if (!username || !password || !email) {
      return res
        .status(400)
        .json({ msg: "error with username, password or email" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username, password, email },
      { new: true } // Devuelve el documento actualizado
    );

    if (!user) {
      return res.status(404).json({ msg: "User did not find ! " });
    }

    res.json({ msg: "User edited successfully", user });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: "User did not find !" });
    }

    res.json({ msg: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validación de campos obligatorios
    if (!username || !password) {
      return res.status(400).json({ msg: "error with username or password" });
    }

    // Buscar user por username y contraseña
    const user = await User.findOne({ username, password });

    if (!user) {
      return res.status(403).json({ msg: "User did not find !" });
    }

    const token = jwt.sign(
      {
        username: user.username,
        email: user.email,
        password: user.password,
      },
      process.env.JWT_SECRET
    );

    res.json({ msg: "Login successfully", token, user });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const searchUsersByName = async (req, res) => {
  try {
    const username = req.params.username;

    // search users with username
    const users = await User.find({
      username: { $regex: username, $options: "i" },
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getUserFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: "User really not found" });
    }

    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const addUserFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const property = await Property.findById(req.body);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!property) {
      return res.status(404).json({ message: "property not found" });
    }
    let isRepetive = false;
    user.favorites.map((item) => {
      if (item.title === property.title) {
        isRepetive = true;
      }
    });
    if (isRepetive) {
      return res.status(404).json({
        msg: "item is repetitive , denied!",
      });
    }
    user.favorites.push(property);
    user.save();
    res.status(201).json({
      msg: "add to favorite successfully",
      favorites: user.favorites,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
const deleteUserFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const property = await Property.findById(req.body);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!property) {
      return res.status(404).json({ message: "property not found" });
    }

    let selectedItemIndex;
    console.log(user.favorites);
    console.log(property.title);

    user.favorites.map((item) => {
      if (item.title == property.title) {
        selectedItemIndex = user.favorites.indexOf(item);
        console.log(selectedItemIndex);
      }
    });
    if (selectedItemIndex === -1) {
      console.log(selectedItemIndex);
      return res.status(404).json({ message: "id not found" });
    }
    user.favorites.splice(selectedItemIndex, 1);
    user.save();

    res.status(201).json({
      msg: "remove  favorite successfully",
      favorites: user.favorites,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const changeAvatar = async (req, res) => {
  try {
    const { username, image } = req.body;

    // Validación de campos obligatorios
    if (!username || !image) {
      return res.status(402).json({ msg: "error with username or image" });
    }

    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(404).json({ msg: "User did not find ! " });
    }

    user.image = image;
    user.save();

    res.json({ msg: "User edited successfully", user });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  getUsers,
  getMe,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  searchUsersByName,
  getUserFavorite,
  addUserFavorite,
  deleteUserFavorite,
  changeAvatar,
  sendMail,
};
