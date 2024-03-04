const express = require("express");
const router = express.Router();
const { authJwt } = require("../middlewares/demo");
const patientController = require("../controllers/patient.controller");
const checkAdminPermission = require("../middlewares/patientPermission");
const multer = require('multer');


// Create a new patient (POST)


router.post("/api/patients", [authJwt.verifyToken, authJwt.hasAdminOrModeratorRole], patientController.createPatient,);

// Get all patients (GET)
router.get("/api/patients", patientController.getAllPatients);

// Get a specific patient by ID (GET)
router.get("/api/patients/:id", patientController.getPatientById);

// Update a patient by ID (PUT)
router.put("/api/patients/:id", [authJwt.verifyToken, authJwt.hasAdminOrModeratorRole], patientController.updatePatient);

router.delete("/api/reminders/:reminderId", [authJwt.verifyToken, authJwt.hasAdminOrModeratorRole], patientController.deleteReminder);
// Delete a patient by ID (DELETE)
router.delete("/api/patients/:id", [authJwt.verifyToken, authJwt.hasAdminOrModeratorRole,checkAdminPermission], patientController.deletePatient);

router.get('/api/patients/:id/reminders',[authJwt.verifyToken, authJwt.hasAdminOrModeratorRole], patientController.getAllRemindersOfPatient);

router.post('/api/patients/:id/reminders',[authJwt.verifyToken, authJwt.hasAdminOrModeratorRole], patientController.addReminderForPatient);

module.exports = router;