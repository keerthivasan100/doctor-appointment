const express = require("express");
const Appointment = require("../models/Appointment");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create Appointment
router.post("/", authMiddleware, async (req, res) => {
  const { doctor, date } = req.body;

  try {
    const appointment = new Appointment({ patient: req.user.id, doctor, date });
    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get Appointments for a User
router.get("/", authMiddleware, async (req, res) => {
  const appointments = await Appointment.find({
    patient: req.user.id,
  }).populate("doctor", "name email");
  res.json(appointments);
});

// Cancel Appointment
router.delete("/:id", authMiddleware, async (req, res) => {
  await Appointment.findByIdAndDelete(req.params.id);
  res.json({ message: "Appointment cancelled" });
});

module.exports = router;
