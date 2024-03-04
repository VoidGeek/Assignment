import React, { useState, useEffect } from 'react';
import PatientService from '../../services/patient.service';
import AuthService from '../../services/auth.service';
import NotFoundPage from '../NotFoundPage';
import { Link } from 'react-router-dom';

const currentUser = AuthService.getCurrentUser();

function AddPatient() {
  const [patient, setPatient] = useState({
    Name: '',
    Phone: '',
    Street: '',
    City: '',
    State: '',
    Zipcode: '',
  });

  const [allPatients, setAllPatients] = useState([]);

  useEffect(() => {
    PatientService.getAllPatients()
      .then((patients) => {
        setAllPatients(patients);
      })
      .catch((error) => {
        console.error('Error fetching patients:', error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatient({ ...patient, [name]: value });
  };

  const handlePatientSubmit = async (e) => {
    e.preventDefault();

    try {
      const createdPatient = await PatientService.createPatient(patient);

      if (createdPatient) {
        alert('Patient submitted successfully!');
        // Reset the form or perform any other actions
      } else {
        alert('Error creating the patient.');
      }
    } catch (error) {
      alert('Error creating the patient: ' + error.message);
    }
  };

  const handlePatientDelete = async (patientId) => {
    try {
      await PatientService.deletePatient(patientId);

      setAllPatients((prevPatients) =>
        prevPatients.filter((patient) => patient._id !== patientId)
      );

      alert('Patient deleted successfully!');
    } catch (error) {
      alert('Error deleting the patient: ' + error.message);
    }
  };

  if (!currentUser || (!currentUser.roles.includes('ROLE_ADMIN') && !currentUser.roles.includes('ROLE_MODERATOR'))) {
    return <NotFoundPage />;
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-white to-blue-300'>
      <div className="container mx-auto mt-16 flex justify-center">
        <div className="w-full p-6 bg-opacity-70 backdrop-blur-100 rounded-lg shadow-md">
          <h1 className="text-2xl text-center font-bold mb-4">
            Enter Patient Details
          </h1>
          <form className="max-w-md mx-auto" onSubmit={handlePatientSubmit}>
            <div className="mb-4">
              <label htmlFor="Name" className="block text-sm font-medium text-gray-700">Name:</label>
              <input
                type="text"
                id="Name"
                name="Name"
                value={patient.Name}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent bg-opacity-70 backdrop-blur-100"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="Phone" className="block text-sm font-medium text-gray-700">Phone:</label>
              <input
                type="text"
                id="Phone"
                name="Phone"
                value={patient.Phone}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent bg-opacity-70 backdrop-blur-100"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="Street" className="block text-sm font-medium text-gray-700">Street:</label>
              <input
                type="text"
                id="Street"
                name="Street"
                value={patient.Street}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent bg-opacity-70 backdrop-blur-100"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="City" className="block text-sm font-medium text-gray-700">City:</label>
              <input
                type="text"
                id="City"
                name="City"
                value={patient.City}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent bg-opacity-70 backdrop-blur-100"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="State" className="block text-sm font-medium text-gray-700">State:</label>
              <input
                type="text"
                id="State"
                name="State"
                value={patient.State}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent bg-opacity-70 backdrop-blur-100"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="Zipcode" className="block text-sm font-medium text-gray-700">Zipcode:</label>
              <input
                type="text"
                id="Zipcode"
                name="Zipcode"
                value={patient.Zipcode}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent bg-opacity-70 backdrop-blur-100"
                required
              />
            </div>
            <div className="mb-4">
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded hover-bg-blue-600"
              >
                Submit Patient
              </button>
            </div>
          </form>

          <div className="mt-8">
            {allPatients.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">All Patients</h2>
                {allPatients.map((patient) => (
                  <div key={patient._id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-md mb-4">
                    <h3 className="font-bold text-lg mb-2">{patient.Name}</h3>
                    <p className="text-gray-700">{`Phone: ${patient.Phone}`}</p>
                    <p className="text-gray-700">{`Address: ${patient.Street}, ${patient.City}, ${patient.State} ${patient.Zipcode}`}</p>
                    <div className="flex justify-end items-center mt-4">
                      <Link
                        to={`/admin/patients/${patient._id}`}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 ml-4"
                      >
                        View
                      </Link>
                      <Link
                        to={`/admin/patients/${patient._id}/edit`}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 ml-4"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handlePatientDelete(patient._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 ml-4"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddPatient;
