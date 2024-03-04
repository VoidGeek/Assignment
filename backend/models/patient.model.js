// patient.model.js

const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Phone: {
    type: String,
    required: true,
  },
  Street: {
    type: String,
    required: true,
  },
  City: {
    type: String,
    required: true,
  },
  State: {
    type: String,
    required: true,
  },
  Zipcode: {
    type: String,
    required: true,
  },
  adminUser: {
    type: String,
    required: true,
  },
  reminders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reminder' }] // Array of Reminder IDs
}, { timestamps: true });

patientSchema.pre("findOneAndUpdate", function () {
  this._update.updatedAt = new Date();
});

module.exports = mongoose.model("Patient", patientSchema);
