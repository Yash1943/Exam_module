const express = require("express");
const app = express();
require("dotenv").config();
const bcrypt = require("bcrypt");
const { User, PositionPreference } = require("./models"); // <-- FIXED: import PositionPreference from models/index.js
// const PositionPreference = require("./models/PositionPreference"); // <-- REMOVED

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

app.get("/api/signup", async (req, res) => {
  try {
    const get_applied_possition = await PositionPreference.findAll();
    // req.json(get_applied_possition);
    console.log("get_applied_possition", get_applied_possition);
    return res.json({
      success: true,
      message: "Position preferences fetched successfully",
      data: get_applied_possition,
    });
  } catch (error) {
    console.log(error);
    // req.flash("error", `Error:${error}`);
  }
});

app.post("/api/signup", async (req, res) => {
  // Extract fields from req.body.data for compatibility with frontend
  const {
    full_name,
    college_name,
    branch,
    applied_position_preference,
    prn_no,
    phone_no,
    email_id,
    aadhar_card_no,
    password,
  } = req.body.data || {};
  // Check for required fields
  if (!full_name || !aadhar_card_no || !password) {
    return res.status(400).json({ success: false, message: "Required fields are missing" });
  }
  console.log("Received signup data req.body:", req.body);
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName: full_name,
      collegeName: college_name,
      branch,
      appliedPositionPreference: applied_position_preference,
      prnNo: prn_no,
      phoneNo: phone_no,
      emailId: email_id,
      aadharCardNo: aadhar_card_no,
      password: hashedPassword,
    });
    return res.json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message, req: req.body });
  }
});

app.listen(3001, () => {
  console.log("Backend server is running on http://localhost:3001");
});
