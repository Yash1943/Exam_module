const express = require("express");
const app = express();
require("dotenv").config();
const bcrypt = require("bcrypt");
const { User } = require("./models");

app.use(express.json());
app.use(require("cors")());

// Sample route
app.get("/users", async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

app.post("/users", async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

// Login route using aadharCardNo and password
app.post("/api/login", async (req, res) => {
  const { aadhar_card, password } = req.body;
  if (!aadhar_card || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Aadhar card and password are required" });
  }
  try {
    const user = await User.findOne({ where: { aadharCardNo: aadhar_card } });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid Aadhar card or password" });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ success: false, message: "Invalid Aadhar card or password" });
    }
    // Optionally, set session or return user info/token here
    return res.json({
      success: true,
      message: "Login successful",
      user: { id: user.id, aadharCardNo: user.aadharCardNo },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

app.listen(3001, () => {
  console.log("Backend server is running on http://localhost:3001");
});
