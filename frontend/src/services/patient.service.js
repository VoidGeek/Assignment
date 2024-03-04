import axios from "axios";

const API_URL = process.env.NODE_ENV === "production" ? "/api" : "/api"; // Replace with your actual API URL

// Fetch all patients
const getAllPatients = () => {
  return axios
    .get(`${API_URL}/patients`,{
      withCredentials: true, // Include credentials (cookies) with the request
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching patients:", error);
      throw error;
    });
};

// Fetch a patient by ID
const getPatientById = (patientId) => {
  return axios
    .get(`${API_URL}/patients/${patientId}`,{
      withCredentials: true, // Include credentials (cookies) with the request
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching patient by ID:", error);
      throw error;
    });
};

// Create a new patient
const createPatient = (newPatient) => {
  return axios
    .post(`${API_URL}/patients`, newPatient,{
      withCredentials: true, // Include credentials (cookies) with the request
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error creating a patient:", error);
      throw error;
    });
};

// Update an existing patient
const updatePatient = (patientId, updatedPatient) => {
  return axios
    .put(`${API_URL}/patients/${patientId}`, updatedPatient,{
      withCredentials: true, // Include credentials (cookies) with the request
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error updating the patient:", error);
      throw error;
    });
};

// Delete a patient
const deletePatient = (patientId) => {
  return axios
    .delete(`${API_URL}/patients/${patientId}`,{
      withCredentials: true, // Include credentials (cookies) with the request
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error deleting the patient:", error);
      throw error;
    });
};

// Delete a reminder for a patient
const deleteReminder = (reminderId) => {
  return axios
    .delete(`${API_URL}/reminders/${reminderId}`,{
      withCredentials: true, // Include credentials (cookies) with the request
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error deleting the reminder:", error);
      throw error;
    });
};

// Fetch all reminders of a specific patient by ID
const getAllRemindersOfPatient = (patientId) => {
  return axios
    .get(`${API_URL}/patients/${patientId}/reminders`, {
      withCredentials: true, // Include credentials (cookies) with the request
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching reminders of patient:", error);
      throw error;
    });
};


const addRemindertoPatient = (patientId, newReminderData) => {
  return axios
    .post(`${API_URL}/patients/${patientId}/reminders`, newReminderData, {
      withCredentials: true, // Include credentials (cookies) with the request
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error adding reminder to patient:", error);
      throw error;
    });
};

const PatientService = {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  deleteReminder,
  getAllRemindersOfPatient,
  addRemindertoPatient, // Add getAllRemindersOfPatient to the service
};

export default PatientService;
