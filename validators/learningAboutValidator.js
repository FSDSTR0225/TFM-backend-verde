const mongoose = require("mongoose");

// Connect to your MongoDB database
mongoose.connect("mongodb://localhost:27017/testdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the User schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [3, "Name must be at least 3 characters long."],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        // Simple email regex for validation
        return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        // Check if password is strong (at least 6 characters, 1 number, 1 uppercase)
        return /^(?=.*[0-9])(?=.*[A-Z]).{6,}$/.test(v);
      },
      message:
        "Password must be at least 6 characters long and contain at least one number and one uppercase letter.",
    },
  },
});

// Create a User model
const User = mongoose.model("User", userSchema);

// Example Usage: Creating a new user
async function createUser() {
  try {
    const user = new User({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "Password1",
    });
    await user.save();
    console.log("User created successfully!");
  } catch (error) {
    // Handle validation errors
    console.error("Error creating user:", error.message);
  }
}

// Call the createUser function
createUser();
// --------------------------------------------------------------------
const emailValidator = (v) => {
  return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v);
};

const passwordValidator = (v) => {
  return /^(?=.*[0-9])(?=.*[A-Z]).{6,}$/.test(v);
};

module.exports = {
  emailValidator,
  passwordValidator,
};
// --------------------------------------------------------------------
// Steps to Handle Validation Errors
// Use Try-Catch for Error Handling: When saving documents, wrap your database operations in a try-catch block.
//  This allows you to catch validation errors that Mongoose throws when the data fails to meet schema requirements.

// Access Error Messages: Mongoose validation errors provide a wealth of information, including specific messages about what failed.
//  You can extract these messages and return them in your API responses.

// Send Meaningful Responses: When handling errors, it’s essential to respond with clear and concise information.
//  Include status codes and error messages in your responses.

// Centralize Error Handling (Optional): For larger applications, you might want to use middleware for centralized error handling to avoid
//  repetitive code in every route.

// Example Code for Handling Validation Errors
// Here's an example of how to implement these steps in a Node.js application using Express and Mongoose:

// 2. Create a Route with Error Handling:
app.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    if (error.name === "ValidationError") {
      // Handle validation errors
      const errorMessages = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({ errors: errorMessages });
    }
    // Handle other types of errors
    res.status(500).json({ message: "Internal Server Error" });
  }
});
// Explanation of the Code above :
// try-catch Block: This is used around the user creation logic. 
// If user.save() fails due to validation issues, the catch block handles it.

// Check for ValidationError: By checking the error's name, you can differentiate between validation errors and other potential errors,
//  allowing for more specific handling.

// Extracting Error Messages: Use Object.values(error.errors) to gather all validation error messages in a succinct format.
//  This makes it easier to send back to the client.

// Returning a Meaningful Response: Send a 400 status code with a list of error messages.
//  This clearly informs the client of what went wrong in their request.



// --------------------------------------------------------------------

// Centralized error handling middleware for very big programs
app.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    const errorMessages = Object.values(err.errors).map(
      (error) => error.message
    );
    return res.status(400).json({ errors: errorMessages });
  }
  res.status(500).json({ message: "Internal Server Error" });
});

// Use the middleware in the route
app.post("/users", async (req, res, next) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    next(error); // Pass error to the error handling middleware
  }
});
