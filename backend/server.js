require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Doctor Appointment System API"));

app.listen(5000, () => console.log("Server running on port 5000"));


const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }})

const User = mongoose.model("User", userSchema);
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await User.findOne({ email });

    if (!userData) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (userData.password !== password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.json({ user: userData, message: "User logged in successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
