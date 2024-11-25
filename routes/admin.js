const express = require("express");
const { authenticateToken, authorizeRoles } = require("../auth/auth");
const User = require("../models/User");

const router = express.Router();

// Add a new employee
router.post(
  "/add-employee",
  authenticateToken,
  authorizeRoles(["admin"]),
  async (req, res) => {
    const { name, email, password } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ name, email, password: hashedPassword, role: "employee" });
      await newUser.save();
      res.status(201).json({ message: "Employee added successfully", newUser });
    } catch (err) {
      res.status(500).json({ message: "Error adding employee", error: err.message });
    }
  }
);

// Get all employees
router.get(
  "/employees",
  authenticateToken,
  authorizeRoles(["admin"]),
  async (req, res) => {
    try {
      // Find all users with the role "employee"
      const employees = await User.find({ role: "employee" });

      // Check if there are any employees
      if (!employees || employees.length === 0) {
        return res.status(404).json({ message: "No employees found" });
      }

      res.status(200).json({ message: "Employees fetched successfully", employees });
    } catch (err) {
      res.status(500).json({ message: "Error fetching employees", error: err.message });
    }
  }
);


router.get(
  "/employees/:id", // Using :id in the URL to specify the employee
  authenticateToken,
  authorizeRoles(["admin"]),
  async (req, res) => {
    const { id } = req.params; // Get the employeeId from the URL parameters

    try {
      // Find the employee by their unique ID
      const employee = await User.findById(id);

      // Check if employee exists
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      res.status(200).json({ message: "Employee fetched successfully", employee });
    } catch (err) {
      res.status(500).json({ message: "Error fetching employee", error: err.message });
    }
  }
);


// Edit an employee
router.put(
  "/edit-employee/:id",
  authenticateToken,
  authorizeRoles(["admin"]),
  async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;

    try {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { name, email },
        { new: true } // Return updated document
      );
      if (!updatedUser) return res.status(404).json({ message: "Employee not found" });

      res.status(200).json({ message: "Employee updated successfully", updatedUser });
    } catch (err) {
      res.status(500).json({ message: "Error updating employee", error: err.message });
    }
  }
);

module.exports = router;
