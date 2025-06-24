const Room = require("../models/roomModel");

const getAllRoom = async (req, res) => {
  try {
    const rooms = await Room.find({}).populate("property");
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ msg: error.room });
  }
};

const getRoomsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const roomsArr = await Room.find({ users: { $in: [userId] } })
      .populate("users")
      .populate("property");
    if (!roomsArr.length) {
      return res.status(404).json({ msg: "This owner do not have any room" });
    }
    return res.status(200).json(roomsArr);
  } catch (error) {
    res.status(500).json({ msg: error.room });
  }
};

const createRoom = async (req, res) => {
  try {
    const { users, property } = req.body;
    if (!users || !property) {
      return res.status(400).json({ msg: "error with users or property" });
    }
    let propoomsArr = await Room.find({ property: property })
      .populate("property")
      .populate("users");
    let duplicate = propoomsArr.find((item) => (item.users = users.sort()));

    if (duplicate) {
      return res
        .status(400)
        .json({ msg: "Duplicate , Room is existed !", createdRoom: duplicate });
    }
    const newRoom = await Room.create({
      users: users.sort(),
      property,
    });

    res.status(201).json({
      msg: "new Room created successfully",
      createdRoom: newRoom,
    });
  } catch (error) {
    res.status(500).json({ msg: error.room });
  }
};

const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) {
      return res.status(404).json({ msg: "Room did not find !" });
    }
    res.status(200).json({ msg: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.room });
  }
};

module.exports = {
  getAllRoom,
  getRoomsByUserId,
  createRoom,
  deleteRoom,
};
