import React, { useState, useEffect } from 'react';
import PatientService from '../../services/patient.service';

function Clock() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(intervalId); // Cleanup the interval
  }, []);

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfWeek = daysOfWeek[currentDateTime.getDay()];
  
  const formattedDateTime = currentDateTime.toLocaleString(); // Format the date and time as per requirement

  return (
    <div className="text-center text-lg font-bold mb-8"> {/* Added margin-bottom */}
      <div>{dayOfWeek}</div>
      <div>{formattedDateTime}</div>
    </div>
  );
}

function AddService() {
  const [patients, setPatients] = useState([]);
  const [dayOfWeek, setDayOfWeek] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientsData = await PatientService.getAllPatients();
        const patientsWithReminders = await Promise.all(
          patientsData.map(async (patient) => {
            const reminders = await PatientService.getAllRemindersOfPatient(patient._id);
            return { ...patient, reminders };
          })
        );
        setPatients(patientsWithReminders);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDateTime = new Date();
    const currentDayOfWeek = daysOfWeek[currentDateTime.getDay()];
    setDayOfWeek(currentDayOfWeek);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-300">
      <div className="container mx-auto mt-16 flex justify-center">
        <div className="container mx-auto mt-8 ">
          <Clock /> {/* Clock component is now positioned below the navbar */}
          <h1 className="text-2xl font-bold mb-4">Patients</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {patients.map((patient) => (
              <div key={patient._id}>
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="text-lg font-bold mb-2">{patient.Name}</h3>
                  <div className="mb-2">
                    <strong>ID:</strong> {patient._id}
                  </div>
                  <div className="mb-2">
                    <strong>Phone Number:</strong> {patient.Phone}
                  </div>
                  <div className="border-t-2 border-gray-200 pt-4">
                    <h4 className="text-xl font-bold mb-2">Reminders</h4>
                    {patient.reminders && patient.reminders.length > 0 ? (
                      patient.reminders
                        .filter((reminder) => reminder.days.includes(dayOfWeek))
                        .map((reminder, index) => (
                          <div key={index} className="bg-gray-100 p-2 rounded-md mb-2">
                            <p className="text-gray-800">{reminder.title}</p>
                            {/* Add more reminder details here */}
                          </div>
                        ))
                    ) : (
                      <p className="text-gray-800">No reminders set for this patient.</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

export default AddService;
