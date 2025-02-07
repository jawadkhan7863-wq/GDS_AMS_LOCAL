import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AiOutlineHome, AiOutlineUser  } from 'react-icons/ai';
import { FaUsers } from "react-icons/fa";
import logo from '../assets/images/logo.png'
import logoutIcon from '../assets/images/logout-icon.png'

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <AiOutlineHome /> },
    { name: 'Employee Registration', path: '/employee-registration', icon: <AiOutlineUser /> },
    { name: 'All Employees', path: '/all-employees', icon: <FaUsers  /> },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-gray-100 flex flex-col shadow-lg">
      <div className="px-6 py-4 text-2xl font-bold">
        <img src={logo} />
      </div>
      <nav className="flex-1">
        <ul>
          {menuItems.map((item) => (
            <li key={item.name} className="mb-2">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 space-x-3 hover:bg-gray-700 ${
                    isActive ? 'bg-gray-700' : ''
                  }`
                }
              >
                <span className="text-2xl">{item.icon}</span>
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <footer className="px-6 py-4 text-sm text-gray-400">
        <div className='flex flex-col items-center justify mb-12'>
          
      
        <Link to={"/break"}>
        <button className='text-lg text-black font-semibold shadow-lg bg-[#36BCBA] rounded-full border-none py-2 px-8 mb-8'>
            Take a Break
          </button>
        </Link>
          <Link to={"/logout"}>
          <button className='flex items-center justify-between text-lg text-red-700 shadow-lg bg-[#060E0E] rounded-full border-none py-2 px-8'>
            <img className='mt-2 mr-2' src={logoutIcon} width={24} height={24} /> <span className='font-normal'>Logout</span>
          </button>
          </Link>
        </div>
        <span>&copy; 2025 Globaldigitalsolutions.</span>
      </footer>
    </aside>
  );
};

export default Sidebar;
