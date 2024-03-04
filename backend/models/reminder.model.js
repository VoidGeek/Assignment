const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  days: {
    type: [String], // Array of strings representing selected days (e.g., ["mon", "wed"])
    required: true,
  },
  hour: {
    type: Number,
    required: true,
  },
  minute: {
    type: Number,
    required: true,
  },
  period: {
    type: String, // AM or PM
    enum: ["AM", "PM"],
    required: true,
  },
  dosage: {
    type: String,
    required: true,
  },
  refillDate: {
    type: Date,
    required: true,
  },
  message: {
    type: String,
    required: true,
  }
});

  
module.exports = mongoose.model("Reminder", reminderSchema);
