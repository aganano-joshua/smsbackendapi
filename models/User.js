const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  salary: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  role: { type: String, enum: ["admin", "employee"], default: "employee" },
});

module.exports = mongoose.model("User_Enny", userSchema);
