import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PatientService from '../../services/patient.service';

function EditPatient() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState({
    Name: '',
    Phone: '',
    Street: '',
    City: '',
    State: '',
    Zipcode: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    PatientService.getPatientById(id)
      .then((fetchedPatient) => {
        setPatient(fetchedPatient);
      })
      .catch((error) => {
        console.error('Error fetching patient:', error);
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatient({ ...patient, [name]: value });
  };

  const handlePatientUpdate = async (e) => {
    e.preventDefault();

    try {
      setLoading(true); // Set loading to true during the update

      const updatedPatient = await PatientService.updatePatient(id, patient);

      if (updatedPatient) {
        alert('Patient updated successfully!');
        navigate('/admin/patients');
      } else {
        alert('Error updating the patient.');
      }
    } catch (error) {
      alert('Error updating the patient: ' + error.message);
    } finally {
      setLoading(false); // Reset loading when the operation is complete
    }
  };

  return (
    <div className="flex items-center bg-gradient-to-r from-purple-300 to-purple-100  justify-center h-screen">
      <div className="w-full max-w-md">
        <div className="w-50 shadow-md mx-auto p-6 rounded-lg  bg-opacity-70 backdrop-blur-100 mt-8 flex">
          <h1 className="text-2xl text-center font-bold mb-4">Edit Patient</h1>
          <form>
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
            <button
              onClick={handlePatientUpdate}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Patient'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditPatient;
