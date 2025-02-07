import React from 'react';
import { useNavigate } from 'react-router-dom';

const EmployeeCard = ({ name, role, initials, id }) => {
  const navigate = useNavigate();

  const handleDetailClick = () => {
    navigate(`/employee-detail/${id}`);
  };

  return (
    <div className="w-full max-w-sm bg-transparent border border-gray-500 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
      {/* Profile Section */}
      <div className="flex flex-col items-center py-6 px-4">
        {/* Display initials inside a circle */}
        <div className="w-24 h-24 mb-4 rounded-full bg-gray-800 text-gray-300 text-2xl flex items-center justify-center font-bold shadow-lg border-4 border-teal-400">
          {initials}
        </div>
        <h5 className="mb-1 text-xl font-semibold text-gray-200 dark:text-white">{name}</h5>
        <span className="text-sm text-gray-400 dark:text-gray-500">{role}</span>

        {/* Buttons Section */}
        <div className="flex mt-6">
          <button
            onClick={handleDetailClick}
            className="py-2 px-6 text-md text-white bg-[#36BCBA] font-semibold rounded-lg border border-transparent hover:bg-[#2a9c94] transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#36BCBA]/50"
          >
            See Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;
