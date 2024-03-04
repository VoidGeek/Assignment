const Patient = require("../models/patient.model");
const Reminder = require("../models/reminder.model");

// Create a new patient
exports.createPatient = async (req, res) => {
  try {
    const { Name, Phone, Street, City, State, Zipcode, reminders } = req.body;

    // Ensure that req.user is defined and contains the user's ID
    if (!req.userId) {
      return res.status(401).json({ message: "User is not authenticated." });
    }

    // Validate that all required fields are provided
    if (!Name || !Phone || !Street || !City || !State || !Zipcode) {
      return res.status(400).json({ message: "All fields are required for patient creation." });
    }

    const adminUserId = req.userId; // Use req.userId to get the user's ID

    // Check if reminders are provided
    let reminderIds = [];
    if (reminders && reminders.length > 0) {
      // Create reminders if not already existing
      const createdReminders = await Reminder.create(reminders);
      reminderIds = createdReminders.map(reminder => reminder._id);
    }

    const patient = new Patient({
      Name,
      Phone,
      Street,
      City,
      State,
      Zipcode,
      adminUser: adminUserId,
      reminders: reminderIds, // Store only reminder IDs in the patient document
    });

    await patient.save();

    // Send the patient details in the response
    res.status(201).json({ message: "Patient created successfully", patient });
  } catch (error) {
    console.error("Error creating patient:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update a patient by ID
// Update a patient by ID
// Update a patient by ID
exports.updatePatient = async (req, res) => {
  try {
    const { reminders: newReminders, ...patientData } = req.body; // Separate new reminders from patient data

    // Find the existing patient
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Get the existing reminders
    const existingReminders = patient.reminders || [];

    // Create an array to hold the IDs of all reminders (existing and new)
    const allReminderIds = [];

    // Add existing reminder IDs to the array
    allReminderIds.push(...existingReminders);

    // Check if new reminders are provided
    if (newReminders && newReminders.length > 0) {
      // Update or create new reminders
      for (const reminder of newReminders) {
        if (reminder.id) {
          // If reminder ID is provided, update the existing reminder
          await Reminder.findByIdAndUpdate(reminder.id, reminder);
          allReminderIds.push(reminder.id); // Append existing reminder ID
        } else {
          // If no ID is provided, create a new reminder
          const createdReminder = await Reminder.create(reminder);
          allReminderIds.push(createdReminder._id); // Append newly created reminder ID
        }
      }
    }

    // Update the patient with the new array of reminder IDs
    patient.reminders = allReminderIds;
    await patient.save();

    // Send the updated Patient details in the response
    res.status(200).json({ message: "Patient updated successfully", patient });
  } catch (error) {
    console.error("Error updating patient:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all patients
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get a specific patient by ID
exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json(patient);
  } catch (error) {
    console.error("Error fetching patient:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a patient by ID
// Delete a patient by ID
exports.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Delete associated reminders
    await Reminder.deleteMany({ _id: { $in: patient.reminders } });

    // Now delete the patient
    await patient.remove();

    res.status(200).json({ message: "Patient and associated reminders deleted successfully" });
  } catch (error) {
    console.error("Error deleting Patient:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.deleteReminder = async (req, res) => {
  try {
    const reminderId = req.params.reminderId;

    // Find the patient that contains the reminder
    const patient = await Patient.findOne({ reminders: reminderId });
    if (!patient) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    // Remove the reminder from the patient's reminders array
    patient.reminders.pull(reminderId);

    // Save the updated patient
    await patient.save();

    // Delete the reminder from the reminder collection
    await Reminder.findByIdAndDelete(reminderId);

    // Return success message
    res.status(200).json({ message: "Reminder deleted successfully" });
  } catch (error) {
    console.error("Error deleting reminder:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// Get all reminders of a specific patient by ID
exports.getAllRemindersOfPatient = async (req, res) => {
  try {
    const patientId = req.params.id;

    // Find the patient by ID
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Get all reminders associated with the patient
    const reminders = await Reminder.find({ _id: { $in: patient.reminders } });

    // Return reminders
    res.status(200).json(reminders);
  } catch (error) {
    console.error("Error fetching reminders of patient:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Add a new reminder for a specific patient by ID
exports.addReminderForPatient = async (req, res) => {
  try {
    const patientId = req.params.id;
    const reminderData = req.body;

    // Find the patient by ID
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Create the reminder
    const reminder = new Reminder(reminderData);
    await reminder.save();

    // Add the reminder to the patient's reminders array
    patient.reminders.push(reminder._id);
    await patient.save();

    // Return success message with the created reminder
    res.status(201).json({ message: "Reminder added successfully", reminder });
  } catch (error) {
    console.error("Error adding reminder for patient:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
