import { useEffect, useState } from 'react';
import axios from 'axios';

const AllTodayPresent = () => {
  const [presentEmployees, setPresentEmployees] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axios.get('http://147.93.119.175:5000/attendance/summary');
        const presentEmployeesData = response.data.loggedInEmployees || [];

        console.log("Present employees: ", presentEmployeesData);

        setPresentEmployees(presentEmployeesData); // Store data in state
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.response?.data?.message || 'Failed to fetch data');
      }
    };

    fetchAttendance(); // Call the async function inside useEffect
  }, []);

  const getInitials = (name) => {
    if (!name) return "N/A";
    const nameParts = name.split(" ");
    return nameParts.length > 1
      ? nameParts[0][0] + nameParts[1][0]
      : nameParts[0][0];
  };

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200 p-6 rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">All Today Present</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {presentEmployees.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-start">
        {presentEmployees.map((employee, index) => (
          <div
            key={index}
            className="w-full max-w-sm bg-transparent border border-gray-500 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 overflow-hidden"
          >
            {/* Profile Section */}
            <div className="flex flex-col items-center py-6 px-4">
              {/* Display initials inside a circle */}
              <div className="w-24 h-24 mb-4 rounded-full bg-gray-800 text-gray-300 text-2xl flex items-center justify-center font-bold shadow-lg border-4 border-teal-400">
                {getInitials(employee.employeeName)}
              </div>
              <h5 className="mb-1 text-xl font-semibold text-gray-200 dark:text-white">
                {employee.employeeName || "Unknown"}
              </h5>
              <span className="text-sm text-gray-400 dark:text-gray-500">
                {employee.employeeEmail || "Employee"}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      ) : (
        <p className="text-center text-gray-400">No leave employees data available.</p>
      )}
    </div>
  );
};

export default AllTodayPresent;
