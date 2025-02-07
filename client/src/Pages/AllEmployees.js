import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EmployeeCard from '../Components/EmployeeCard';
import { toast } from 'react-toastify';

const AllEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log(employees);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://147.93.119.175:5000/all-employees');
        setEmployees(response.data.employees);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch employees');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Helper function to get initials from the name
  const getInitials = (name) => {
    const nameParts = name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts[1] || '';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  };

  // Loading and error states
  if (loading) return <p className='text-white text-xl'>Loading...</p>;
  if (error) return <p className='text-white text-xl'>Something went wrong. Try again later!</p>;

  return (
    <div className="max-w-full mx-auto px-6 rounded shadow-md">
      <h2 className="text-gray-100 text-3xl font-bold">All Employees</h2>
      <p className="text-gray-500 mt-2 mb-4">See a list of Employees</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {employees.map((employee) => (
          <EmployeeCard
            key={employee._id}
            id={employee._id} 
            name={employee.name}
            role={employee.role}
            description={employee.description}
            initials={getInitials(employee.name)} 
          />
        ))}
      </div>
    </div>
  );
};

export default AllEmployees;
