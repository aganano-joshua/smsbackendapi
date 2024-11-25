// const express = require("express");
// const { authenticateToken, authorizeRoles } = require("../auth/auth");

// const router = express.Router();

// // Employee route
// router.get("/profile", authenticateToken, authorizeRoles(["admin", "employee"]), (req, res) => {
//   res.json({ message: "Welcome, employee!", user: req.user });
// });

// module.exports = router;


const express = require("express");
const User = require("../models/User"); // Assuming you have a User model defined
const { authenticateToken, authorizeRoles } = require("../auth/auth");

const router = express.Router();

// Assuming authenticateToken and authorizeRoles are middleware functions
router.get("/profile", authenticateToken, authorizeRoles(["admin", "employee"]), async (req, res) => {
  try {
    // Fetch the full user details from the database using the user ID from the token
    const user = await User.findById(req.user.id).select('-password'); // Exclude password from response

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user details along with a welcome message
    res.json({
      message: `Welcome, ${user.name}!`,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        salary: user.salary,
        gender: user.gender,
        address: user.address,
      },
    });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Error fetching profile", error: err.message });
  }
});

module.exports = router;
