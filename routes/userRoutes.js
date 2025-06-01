const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/userController");

router.get("/all", getUsers);
router.get("/me", getMe);
router.get("/:id", getUserById);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/login", loginUser);
router.post("/fotoEdit", changeAvatar);
router.get("/search/:userName", searchUsersByName);
router.get("/favorite/:userId", getUserFavorite);
router.post("/favorite/:userId", addUserFavorite);
router.delete("/favorite/:userId", deleteUserFavorite);

module.exports = router;
