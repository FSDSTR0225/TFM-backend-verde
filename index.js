const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const User = require("./models/userModel");
const Property = require("./models/propertyModel");

const userRoutes = require("./routes/userRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const contractCategoryRoutes = require("./routes/contractCategoryRoutes");
const typeCategoryRoutes = require("./routes/typeCategoryRoutes");
const cityRoutes = require("./routes/cityRoutes");
const newsRoutes = require("./routes/newsRoutes");
const testRoutes = require("./routes/testRoutes");

const upload = multer({ dest: "uploads/" });

const app = express();
const port = process.env.PORT || 3000;

// Middleware for proccesing JSON y datas of form
app.use(cors()); // Enable CORS for all requests
app.use(express.json());
app.use(express.urlencoded({ extended: false })); //true : when you wanna go deep in nested object
app.use(cookieParser());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
  })
  .catch((error) => {
    console.error("<❌ Error in connecting Mongo DB :>", error);
  });

//API Routes//
app.use("/users", userRoutes);
app.use("/properties", propertyRoutes);
app.use("/contractCategory", contractCategoryRoutes);
app.use("/typeCategory", typeCategoryRoutes);
app.use("/cities", cityRoutes);
app.use("/news", newsRoutes);
app.use("/test", testRoutes);

//welcome route
app.get("/", (req, res) => {
  res.json({
    mensaje: "Users and properties API",
    endpoints: {
      users: "/users",
      properties: "/properties",
      contractCategory: "/contractCategory",
      typeCategory: "/typeCategory",
      cities: "/cities",
      news: "/news",
      test: "/test",
    },
  });
});

const server = app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("chat message", async (msg) => {
    try {
      const user = await User.findOne({ _id: msg.senderId });
      const property = await Property.findOne({ _id: msg.propertyId });
      const owner = await User.findOne({ _id: msg.receiverId });
      if (!user) {
        console.log("can not find user");
      }
      if (!property) {
        console.log("can not find property");
      }
      const propSubject = user.messages.find((item) => {
        return item[0][0].propId === msg.propertyId;
      });

      if (!propSubject) {
        console.log("could not find , I create a new for you");
        let infos = [];
        infos.push(msg);
        let createdMsg = [
          [
            { propId: msg.propertyId },
            { owner: owner.username },
            { img: msg.propertyImg },
            { propName: msg.propertyName },
          ],
          infos,
        ];
        user.messages = [...user.messages, createdMsg];
      } else {
        console.log("Founded , Adding to prev", propSubject[1]);
        propSubject[1].push(msg);
        await User.findByIdAndUpdate(msg.senderId, { messages: user.messages });
      }
      await user.save();
    } catch (err) {
      console.log(err);
    }

    console.log(msg);
    const messageWithTime = {
      ...msg,
      time: new Date().toLocaleTimeString(),
    };
    io.emit("chat message", messageWithTime);

    // socket.broadcast.emit('chat message', messageWithTime); to send All exept owner of msg
    // const roomName = msg.propertyId + msg.senderId;
    // socket.join(roomName);
    // console.log(msg.propertyId + msg.senderId);
    // io.to(roomName).emit(`${msg.sender} has been joined`);
    // io.to(roomName).emit(msg.text);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// io.on('connection', (socket) => {
//   // join the room named 'some room'
//   socket.join('newRoom');

//   // broadcast to all connected clients in the room
//   io.to('newRoom').emit('hello', 'world');

//   // broadcast to all connected clients except those in the room
//   io.except('newRoom').emit('hello', 'world');

//   // leave the room
//   socket.leave('newRoom');
// });
