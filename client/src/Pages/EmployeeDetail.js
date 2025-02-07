import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { IoMdArrowBack } from "react-icons/io";

import { toast } from 'react-toastify';

const EmployeeDetail = () => {
  const { id } = useParams(); // Get employee ID from URL params
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to get initials from the name
  const getInitials = (name) => {
    const nameParts = name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts[1] || '';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  };

  // Fetch employee details
  useEffect(() => {
    const fetchEmployeeDetail = async () => {
      try {
        const response = await axios.get(`http://147.93.119.175:5000/employee-detail/${id}`);
        setEmployee(response.data.employee);

      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch employee details');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeDetail();
  }, [id]);

  // Handle delete employee
  const handleDelete = async (e, employeeId) => {
    e.preventDefault();
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this employee?');
      if (!confirmDelete) return;

      await axios.delete(`http://147.93.119.175:5000/delete-employee/${employeeId}`);
      toast.success('Employee deleted successfully');

      // Redirect back to employee list
      window.location.href = '/all-employees';
    } catch (error) {
      toast.error('Failed to delete employee');
    }
  };

  // Toggle menu visibility
  const toggleMenu = () => {
    const menuItems = document.getElementById("menuItems");
    const isVisible = menuItems.style.display === "block";
    menuItems.style.display = isVisible ? "none" : "block";
    menuItems.style.opacity = isVisible ? "0" : "1";
    menuItems.style.transform = isVisible ? "scale(0.95)" : "scale(1)";
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      const menuButton = document.getElementById("menuButton");
      const menuItems = document.getElementById("menuItems");
  
      // Check if elements exist before accessing properties
      if (menuButton && menuItems && !menuButton.contains(event.target) && !menuItems.contains(event.target)) {
        menuItems.style.display = "none";
        menuItems.style.opacity = "0";
        menuItems.style.transform = "scale(0.95)";
      }
    };
  
    document.addEventListener("click", handleOutsideClick);
  
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);
  

  if (loading) return <p className='text-white text-xl'>Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-full mx-auto px-6 py-8 bg-transparent border border-2 border-gray-700 rounded-xl shadow-xl">
      <div className="space-y-4 flex items-center justify-between">
        {/* Go Back Button */}
        <Link to="/all-employees">
          <button className="text-red-700 text-md flex items-center justify-between gap-2 border border-red-700 py-1 px-6 rounded-full">
            <IoMdArrowBack className="mt-1" /> <span>Go Back</span>
          </button>
        </Link>

        {/* Profile Dropdown Menu */}
        {employee && (
          <div className="relative p-4 rounded-lg shadow-sm bg-transparent">
            <button
              id="menuButton"
              className="w-full border border-green-500 rounded-full py-2 px-4 text-sm flex justify-between items-center"
              onClick={toggleMenu}
            >
              <span className='text-green-500 mr-2'>{employee.name}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu Items */}
            <div
              id="menuItems"
              className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-transparent border border-green-500 shadow-lg scale-95 opacity-0 transition-all duration-200 ease-out"
              style={{ display: 'none' }}
            >
              <div className="py-1">
                <Link
                  to={{
                    pathname: `/attendance/employee/${employee._id}`,
                    state: { employee }
                  }}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-700 hover:text-green-500"
                >
                  View Monthly Attendance
                </Link>

                <Link to={"/logout"}>
                  <button
                    type="submit"
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-700 hover:text-green-500"
                  >
                    Sign out
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {employee ? (
        <>
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4 relative">
              <div className="w-40 h-40 flex items-center justify-center rounded-full bg-gray-800 text-gray-300 text-4xl font-bold border-8 border-teal-400 shadow-lg">
                {getInitials(employee.name)}
              </div>
            </div>

            <h2 className="text-4xl font-extrabold text-white tracking-wide">{employee.name}</h2>
            <p className="text-xl text-teal-200 mt-2">{employee.designation?.role || "N/A"}</p>
          </div>

          <div className="space-y-8">
            <div className="bg-transparent p-8 rounded-lg border-2 border-gray-600 shadow-teal-500">
              <h3 className="text-3xl font-semibold text-teal-500 text-center">Basic Information</h3>
              <ul className="mt-4 text-lg text-gray-700 space-y-2 px-20">
                <li className='flex items-center justify-between'><strong className="text-[#B1B1B1] py-4 text-xl font-semibold">Email:</strong> <span className='text-gray-500 text-xl font-semibold'>{employee.email}</span></li>
                <hr className="border-t-2 border-gray-800" />
                <li className='flex items-center justify-between'><strong className="text-[#B1B1B1] py-4">CNIC No:</strong> <span className='text-gray-500 text-xl font-semibold'>{employee.CNIC_No}</span></li>
                <hr className="border-t-2 border-gray-800" />
                <li className='flex items-center justify-between'><strong className="text-[#B1B1B1] py-4">Address:</strong> <span className='text-gray-500 text-xl font-semibold'>{employee.address}</span></li>
                <hr className="border-t-2 border-gray-800" />
                <li className='flex items-center justify-between'><strong className="text-[#B1B1B1] py-4">Joining Date:</strong> <span className='text-gray-500 text-xl font-semibold'>{new Date(employee.joining_date).toLocaleDateString()}</span></li>
                <hr className="border-t-2 border-gray-800" />
                <li className='flex items-center justify-between'><strong className="text-[#B1B1B1] py-4">Role:</strong> <span className='text-gray-500 text-xl font-semibold'>{employee.role_company}</span></li>
                <hr className="border-t-2 border-gray-800" />
                <li className='flex items-center justify-between'><strong className="text-[#B1B1B1] py-4">Time_In:</strong> <span className='text-gray-500 text-xl font-semibold'>{employee.in_time} PM</span></li>
                <hr className="border-t-2 border-gray-800" />
                <li className='flex items-center justify-between'><strong className="text-[#B1B1B1] py-4">Time_Out:</strong> <span className='text-gray-500 text-xl font-semibold'>{employee.out_time} AM</span></li>
              </ul>
            </div>
          </div>

          <div className="mt-10 text-center flex items-center justify-between">
            <div>
              <Link to={`/update-employee/${employee._id}`} state={{ employee }}>
                <button className="inline-block px-8 py-2 text-lg text-black font-semibold bg-[#36BCBA] hover:bg-teal-600 rounded-full shadow-md transition duration-200 ease-in-out transform hover:scale-105">
                  Edit
                </button>
              </Link>
            </div>
            <div>
              <button
                onClick={(e) => handleDelete(e, employee._id)}
                className="inline-block px-8 py-2 text-lg font-semibold text-white bg-red-700 hover:bg-teal-600 rounded-full shadow-md transition duration-200 ease-in-out transform hover:scale-105">
                Delete
              </button>
            </div>
          </div>
        </>
      ) : (
        <p className="text-center text-white">No employee found</p>
      )}
    </div>
  );
};

export default EmployeeDetail;
