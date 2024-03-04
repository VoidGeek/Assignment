import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PatientService from '../../services/patient.service';
import NotFoundPage from '../NotFoundPage';
import { FaClock, FaCalendarAlt, FaPills, FaComment } from 'react-icons/fa';

function PatientProfile() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState({
    title: '',
    days: [],
    hour: '',
    minute: '',
    period: '',
    dosage: '',
    refillDate: '',
    message: ''
  });

  useEffect(() => {
    PatientService.getPatientById(id)
      .then((data) => {
        setPatient(data);
        PatientService.getAllRemindersOfPatient(id)
          .then((remindersData) => {
            setReminders(remindersData);
          })
          .catch((error) => {
            console.error('Error fetching reminders:', error);
          });
      })
      .catch((error) => {
        console.error('Error fetching patient:', error);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewReminder(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    PatientService.addRemindertoPatient(id, newReminder)
      .then((response) => {
        console.log('New reminder added successfully:', response);
        // Reset the newReminder state after successful addition
        setNewReminder({
          title: '',
          days: [],
          hour: '',
          minute: '',
          period: '',
          dosage: '',
          refillDate: '',
          message: ''
        });
        // Fetch updated reminders for the patient
        PatientService.getAllRemindersOfPatient(id)
          .then((remindersData) => {
            setReminders(remindersData);
          })
          .catch((error) => {
            console.error('Error fetching reminders:', error);
          });
      })
      .catch((error) => {
        console.error('Error adding new reminder:', error);
      });
  };
  

  const ReminderCard = ({ reminder }) => {
    const handleDelete = () => {
      // Call the deleteReminder function with the reminder ID
      deleteReminder(reminder._id);
    };
  
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-4 relative">
        <button className="absolute top-2 right-2 text-red-500" onClick={handleDelete}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h3 className="text-lg font-bold mb-2 text-center">{reminder.title}</h3>
        <div className="grid grid-cols-2 gap-4 mb-2">
          <div className="flex items-center justify-center">
            <FaClock className="mr-2 text-gray-600" />
            <p className="text-gray-800">Time: {reminder.hour}:{String(reminder.minute).padStart(2, '0')} {reminder.period}</p>
          </div>
          <div className="flex items-center justify-center">
            <FaPills className="mr-2 text-gray-600" />
            <p className="text-gray-800">Dosage: {reminder.dosage}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-2">
          <div className="flex items-center justify-center">
            <FaCalendarAlt className="mr-2 text-gray-600" />
            <p className="text-gray-800">Refill Date: {new Date(reminder.refillDate).toLocaleDateString()}</p>
          </div>
          <div className="flex items-center justify-center">
            <FaComment className="mr-2 text-gray-600" />
            <p className="text-gray-800">Message: {reminder.message}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-2">
          <div className="flex items-center justify-center">
            <FaCalendarAlt className="mr-2 text-gray-600" />
            <p className="text-gray-800">Days: {reminder.days.join(', ')}</p>
          </div>
        </div>
      </div>
    );
  };
  
  
  const handleDaysChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setNewReminder(prevState => ({
        ...prevState,
        days: [...prevState.days, value]
      }));
    } else {
      setNewReminder(prevState => ({
        ...prevState,
        days: prevState.days.filter(day => day !== value)
      }));
    }
  };
  
  const renderReminders = () => {
    if (!reminders || reminders.length === 0) {
      return <p className="text-gray-800">No reminders set for this patient.</p>;
    }

    return reminders.map((reminder) => (
      <ReminderCard key={reminder._id} reminder={reminder} />
    ));
  };
  const deleteReminder = (reminderId) => {
    PatientService.deleteReminder(reminderId)
      .then(() => {
        // Filter out the deleted reminder from the reminders array
        setReminders(reminders.filter(reminder => reminder._id !== reminderId));
        console.log('Reminder deleted successfully');
      })
      .catch((error) => {
        console.error('Error deleting reminder:', error);
      });
  };
  
  if (!patient) {
    return <NotFoundPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-300">
      <div className="container mx-auto mt-16 p-6 bg-opacity-70 backdrop-blur-100 rounded-lg shadow-md">
        <h1 className="text-2xl text-center font-bold mb-4">Patient Profile</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-600 font-bold mb-2">Name:</label>
            <p className="text-gray-800">{patient.Name}</p>
            {/* Add more patient information here */}
          </div>
          <div>
            <label className="block text-gray-600 font-bold mb-2">Phone:</label>
            <p className="text-gray-800">{patient.Phone}</p>
          </div>
          <div>
            <label className="block text-gray-600 font-bold mb-2">Street:</label>
            <p className="text-gray-800">{patient.Street}</p>
          </div>
          <div>
            <label className="block text-gray-600 font-bold mb-2">City:</label>
            <p className="text-gray-800">{patient.City}</p>
          </div>
          <div>
            <label className="block text-gray-600 font-bold mb-2">State:</label>
            <p className="text-gray-800">{patient.State}</p>
          </div>
          <div>
            <label className="block text-gray-600 font-bold mb-2">Zipcode:</label>
            <p className="text-gray-800">{patient.Zipcode}</p>
          </div>
          <div className="col-span-2 md:col-span-1">
            <h2 className="text-xl font-bold mb-2">Reminders</h2>
            {renderReminders()}
          </div>
          <div className="col-span-2 md:col-span-1">
            <h2 className="text-xl font-bold mb-2">Add Reminder</h2>
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 font-bold mb-2">Title:</label>
                  <input type="text" name="title" value={newReminder.title} onChange={handleChange} className="bg-gray-100 rounded-lg p-2 w-full" />
                </div>
                <div>
                    <label className="block text-gray-600 font-bold mb-2">Days:</label>
                    <div className="flex flex-wrap">
                        {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(day => (
                        <label key={day} className="flex items-center mr-4">
                            <input
                            type="checkbox"
                            name="days"
                            value={day}
                            checked={newReminder.days.includes(day)}
                            onChange={handleDaysChange}
                            className="mr-2"
                            />
                            {day}
                        </label>
                        ))}
                    </div>
                    </div>

                    <div>
                        <label className="block text-gray-600 font-bold mb-2">Hour:</label>
                        <input
                            type="number"
                            name="hour"
                            value={newReminder.hour}
                            onChange={handleChange}
                            min="1"
                            max="12"
                            className="bg-gray-100 rounded-lg p-2 w-full"
                        />
                        </div>
                        <div>
                        <label className="block text-gray-600 font-bold mb-2">Minute:</label>
                        <input
                            type="number"
                            name="minute"
                            value={newReminder.minute}
                            onChange={handleChange}
                            min="0"
                            max="59"
                            className="bg-gray-100 rounded-lg p-2 w-full"
                        />
                        </div>

                <div>
                    <label className="block text-gray-600 font-bold mb-2">Period:</label>
                    <select name="period" value={newReminder.period} onChange={handleChange} className="bg-gray-100 rounded-lg p-2 w-full">
                        <option value="">Select a period</option>
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                    </select>
                    </div>
                <div>
                  <label className="block text-gray-600 font-bold mb-2">Dosage:</label>
                  <input type="text" name="dosage" value={newReminder.dosage} onChange={handleChange} className="bg-gray-100 rounded-lg p-2 w-full" />
                </div>
                <div>
                    <label className="block text-gray-600 font-bold mb-2">Refill Date:</label>
                    <input
                        type="date"
                        name="refillDate"
                        value={newReminder.refillDate}
                        onChange={handleChange}
                        className="bg-gray-100 rounded-lg p-2 w-full"
                    />
                    </div>

                <div>
                  <label className="block text-gray-600 font-bold mb-2">Message:</label>
                  <input type="text" name="message" value={newReminder.message} onChange={handleChange} className="bg-gray-100 rounded-lg p-2 w-full" />
                </div>
              </div>
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Add Reminder</button>
            </form>
          </div>
        </div>
        <div className="flex justify-end items-center mt-6">
          <Link
            to={`/admin/patients/${id}/edit`}
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 ml-4"
          >
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PatientProfile;
