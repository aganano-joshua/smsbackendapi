const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// Register a user
// router.post("/register", async (req, res) => {
//   console.log("new request")
//   // if (!name || !email || !password || !role) {
//   //   return res.status(400).json({ message: "Please provide all required fields" });
//   // }
//   const { name, email, password, salary, gender, address, role } = req.body;

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({ name, email, password: hashedPassword, role, salary, gender, address });
//     await newUser.save();

//     res.status(201).json({ message: "User registered successfully" });
//   } catch (err) {
//     res.status(500).json({ message: "Error registering user", error: err.message });
//   }
// });


router.post("/register", async (req, res) => {
  console.log("Received request body:", req.body); // Log the request body

  const { name, email, password, salary, gender, address, role } = req.body;

  if (!name || !email || !password || !role || !salary || !gender || !address) {
    return res.status(400).json({ message: "Please provide all required fields" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, address, role, gender, salary });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error:", err); // Log the error for debugging
    res.status(500).json({ message: "Error registering user", error: err.message });
  }
});


// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "2h" });
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
});

module.exports = router;
