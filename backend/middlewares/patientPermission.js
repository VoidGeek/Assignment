const Patient = require("../models/patient.model");

const patientPermission = async (req, res, next) => {
  const patientId = req.params.id; // Assuming patient ID is in the request parameters

  try {
    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({ message: "patient not found" });
    }

    // Check if the requesting user is the admin of the patient
    if (patient.adminUser !== req.userId) {
      return res.status(403).json({ message: "You are not authorized to perform this operation" });
    }

    // If the user is the admin, proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error checking admin permission:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = patientPermission;
