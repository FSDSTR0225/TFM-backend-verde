const Message = require("../models/messageModel");

const getAllMessage = async (req, res) => {
  try {
    const messages = await Message.find({});
    res.json(messages);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getMessagesByUSerId = async (req, res) => {
  try {
    const messagesArr = await Message.find({ sender: req.params.userId });
    if (!messagesArr.length) {
      return res.status(404).json({ msg: "Message did not find !" });
    }
    res.json(messagesArr);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
const getMessagesByRoomId = async (req, res) => {
  try {
    const messagesArr = await Message.find({ roomId: req.params.roomId });
    if (!messagesArr.length) {
      return res.status(404).json({ msg: "Messages not found !" });
    }
    res.json(messagesArr);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const createMessage = async (req, res) => {
  try {
    const { sender, receiver, property, roomId, message } = req.body;

    if (!sender || !receiver || !property || !roomId || !message) {
      return res.status(400).json({ msg: "error with  datas" });
    }

    const newMessage = await Message.create({
      sender,
      receiver,
      property,
      roomId,
      message,
    });
    res.status(201).json({
      msg: "new Message created successfully",
      createdMessage: newMessage,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({ msg: "Message did not find !" });
    }

    res.status(200).json({ msg: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  getAllMessage,
  getMessagesByUSerId,
  getMessagesByRoomId,
  createMessage,
  deleteMessage,
};
