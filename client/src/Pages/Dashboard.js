import React, { useState, useEffect } from 'react';
import { FaUsers } from "react-icons/fa6";
import { RiPresentationFill } from "react-icons/ri";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [attendanceData, setAttendanceData] = useState([]);
  const [leaves, setLeaves] = useState(0); // Ensure leaves state is declared
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [leaveEmployees, setLeaveEmployees] = useState([]);
  const [presentEmployees, setPresentEmployees] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const atteendanceList = async () => {
      try {
        const response = await axios.get('http://172.16.0.5:5000/attendance/summary');
        const attendance = response.data.loggedInEmployees;

        // Fetch user data from localStorage when the component mounts
        const employeeName = localStorage.getItem("employeeName");

        if (employeeName) {
          setUser({ employeeName }); // Set the user state if data exists
        }


        // Assuming leaveEmployees is part of the response from /attendance/summary
        const leaveEmployees = response.data.leaveEmployees || [];
        const presentEmployees = response.data.loggedInEmployees;

        const totalEmployees = attendance[0]?.totalEmployees || 0;
        const attendanceDataLength = attendance.length;
        const leaves = totalEmployees - attendanceDataLength;

        setAttendanceData(attendance);
        setTotalEmployees(totalEmployees);
        setLeaves(leaves);
        setLeaveEmployees(leaveEmployees);
        setPresentEmployees(presentEmployees);
        setUser(employeeName);


      } catch (err) {
        setError(err.response?.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    

    atteendanceList();
  }, []);

  const capitalize = (str) => {
    if (!str) return ''; // Handle empty or undefined strings
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const formatTime = (time) => {
    if (time === "Not Logged Out Yet") return "-";
    const [hour, minute] = time.split(":").map(Number); // Split and convert hour/minute to numbers
    const period = hour >= 12 ? "PM" : "AM"; // Determine AM or PM
    const formattedHour = hour % 12 || 12; // Convert to 12-hour format, with 12 for midnight/noon
    return `${formattedHour}:${minute.toString().padStart(2, "0")} ${period}`;
  };


  if (loading) return <p className='text-white text-xl'>Loading...</p>;
  if (error) return <p className='text-white text-xl'>Something went wrong.Try again later..</p>;

  return (
    <div className="max-w-full mx-auto px-6 rounded shadow-md">
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-gray-100 text-3xl font-bold'>Dashboard</h2>
          <p className='text-gray-500 mt-2 mb-4'>See all details at once place.</p>
        </div>
        <div>
          {user ? (
            <div>
              <span className="text-lg text-gray-400 border border-green-600 p-2 rounded-full">
                Welcome, <i className='text-green-600'>{user}</i>
              </span>
            </div>
          ) : (
            <Link to={"/login"}>
              <button className="text-lg text-black font-semibold shadow-lg bg-[#36BCBA] rounded-full border-none py-2 px-8 mb-8">
                LOGIN
              </button>
            </Link>
          )}
        </div>
      </div>

      <div className="border border-2 border-gray-700 bg-gray-900 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="max-w-full p-6 bg-gray-800 rounded-lg shadow-lg">
            <div className="flex justify-center items-center mb-4">
              <div className="bg-teal-600 p-3 rounded-full">
                <FaUsers />
              </div>
            </div>

            <h3 className="text-center text-xl font-semibold text-teal-400 mb-4">Total Employees</h3>

            <div className="text-center text-6xl font-bold text-white mb-6">{totalEmployees}</div>

            <div className="text-center">
              <Link to={"/all-employees"}>
                <button
                  className="px-6 py-2 text-sm font-medium text-gray-800 bg-teal-400 hover:bg-teal-300 rounded-full shadow-lg transition duration-300"
                >
                  See All
                </button>
              </Link>
            </div>
          </div>
          <div className="max-w-full p-6 bg-gray-800 rounded-lg shadow-lg">
            <div className="flex justify-center items-center mb-4">
              <div className="bg-teal-600 p-3 rounded-full">
                <RiPresentationFill />
              </div>
            </div>

            <h3 className="text-center text-xl font-semibold text-teal-400 mb-4">Leaves</h3>

            <div className="text-center text-6xl font-bold text-white mb-6">{leaves}</div>

            <div className="text-center">
              <Link
                to={{
                  pathname: "/all-today-leaves",
                  state: { leaveEmployees },
                }}
              >
                <button
                  className="px-6 py-2 text-sm font-medium text-gray-800 bg-teal-400 hover:bg-teal-300 rounded-full shadow-lg transition duration-300"
                >
                  See All
                </button>
              </Link>
            </div>
          </div>
          <div className="max-w-full p-6 bg-gray-800 rounded-lg shadow-lg">
            <div className="flex justify-center items-center mb-4">
              <div className="bg-teal-600 p-3 rounded-full">
                <FaUsers />
              </div>
            </div>

            <h3 className="text-center text-xl font-semibold text-teal-400 mb-4">Today Present</h3>

            <div className="text-center text-6xl font-bold text-white mb-6">{attendanceData.length}</div>

            <div className="text-center">
              <Link
                to={{
                  pathname: "/all-today-present",
                  state: { presentEmployees },
                }}
              >
                <button
                  className="px-6 py-2 text-sm font-medium text-gray-800 bg-teal-400 hover:bg-teal-300 rounded-full shadow-lg transition duration-300"
                >
                  See All
                </button>
              </Link>
            </div>
          </div>
        </div>

      </div>
      <div className='mt-6'>
        <h2 className='text-white text-2xl'>Attendance Record of the Day</h2>
        <div>
          <div className="overflow-x-auto mt-6">
            <table className="min-w-full table-auto border-collapse bg-gray-900 text-gray-300">
              <thead>
                <tr className="bg-gray-800 text-sm text-center">
                  <th className="px-4 py-2 border border-gray-700">#</th>
                  <th className="px-4 py-2 border border-gray-700">Name</th>
                  <th className="px-4 py-2 border border-gray-700">Login Time</th>
                  <th className="px-4 py-2 border border-gray-700">Logout Time</th>
                  <th className="px-4 py-2 border border-gray-700">Designation</th>
                  <th className="px-4 py-2 border border-gray-700">Date</th>
                  <th className="px-4 py-2 border border-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((item, index) => (
                  <tr key={item.employeeId} className="hover:bg-gray-800 text-sm">
                    <td className="px-4 py-2 border border-gray-700 text-center">{index + 1}</td>
                    <td className="px-4 py-2 border border-gray-700 text-center">
                      {item.employeeName ? capitalize(item.employeeName) : "N/A"}
                    </td>

                    {/* Format Login Time */}
                    <td
                      className={`px-4 py-2 border border-gray-700 text-center ${item.isOnTime ? 'text-green-500' : 'text-green-500'}`}
                    >
                      {formatTime(item.loginTime)}
                    </td>

                    {/* Format Logout Time */}
                    <td className="px-4 py-2 border border-gray-700 text-center">
                      {formatTime(item.logoutTime)}
                    </td>
                    <td className="px-4 py-2 border border-gray-700 text-center">{item.designation}</td>
                    <td className="px-4 py-2 border border-gray-700 text-center">{item.date}</td>
                    <td className="px-4 py-2 border border-gray-700 text-center">
                      <Link to={`/attendance/employee/${item.employeeId}`}>
                        <button className="text-green-500 hover:text-teal-500">
                          Monthly Details
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>


            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;




