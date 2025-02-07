import React, { useState, useEffect, useRef } from "react";
import loginBg from "../assets/images/login-bg.png";
import logo from "../assets/images/logo.png";

import { toast } from "react-toastify";

function Logout() {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginTime, setLoginTime] = useState(null);
  const [logoutTime, setLogoutTime] = useState(null);
  const [sessionDuration, setSessionDuration] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const inputRefs = useRef([]);

  // Check if the user is logged in on component mount
  useEffect(() => {
    const employeeId = localStorage.getItem("employeeId");
    if (employeeId) {
      setIsLoggedIn(true); // Assume logged in if employeeId exists in localStorage
    }
  }, []);

  // Handle OTP input
  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (value.match(/[0-9]/)) {
      setOtp((prevOtp) => {
        const newOtp = [...prevOtp];
        newOtp[index] = value;
        return newOtp;
      });

      // Move to the next input if available
      if (index < 5 && value) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  // Handle Key Down for navigation between inputs
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Move to the previous input
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle Login or Logout
  const handleLoginLogout = async () => {
    const secretKey = otp.join(""); // Combine the OTP into a single string
  
    if (secretKey.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }
  
    try {
      const attendanceId = localStorage.getItem("attendanceId");
  
      if (!attendanceId) {
        toast.error("Attendance ID is missing. Please log in again.");
        return;
      }
  
      setIsLoggingOut(true);
  
      let data; // Declare 'data' at the top of the try block
      try {
        const response = await fetch("http://172.16.0.5:5000/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Attendance-ID": attendanceId, // Include Attendance ID in the header
            "Secret-Key": secretKey, // Include Secret Key in the header
          },
        });
  
        if (!response.ok) {
          const errorText = await response.text(); // Check for non-JSON responses
          throw new Error(errorText);
        }
  
        data = await response.json(); // Assign response JSON to 'data'
      } catch (error) {
        console.error("Error:", error.message);
        toast.error(`Error: ${error.message}`);
        return; // Exit the function if there's an error
      }
  
      // On successful logout
      setLogoutTime(data.outTime);
      setSessionDuration(data.sessionDuration);
      setIsLoggedIn(false);
      localStorage.removeItem("attendanceId"); // Clear attendanceId from localStorage
  
      toast.success("Logout successful!");
    } catch (error) {
      console.error("Logout Error:", error.message);
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsLoggingOut(false);
    }
  };
  


  return (
    <div className="w-screen h-screen bg-[#060E0E] flex justify-center items-center">
      <div className="flex w-full h-full max-w-7xl bg-white shadow-lg">
        {/* Left side: Image */}
        <div className="w-1/2 h-full relative">
          {/* Image Background */}
          <img
            src={loginBg} // Replace with your image URL
            alt="Sample"
            className="w-full h-full object-cover"
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black opacity-50"></div>

          {/* Logo */}
          <div className="absolute inset-0 -mt-20 flex justify-center items-center">
            <img
              src={logo} // Replace with your logo path
              alt="Logo"
              className="w-96 h-auto z-10" // Adjust the size of the logo as needed
            />
          </div>
        </div>

        {/* Right side: OTP Form */}
        <div className="w-1/2 h-full p-6 flex flex-col justify-center items-center bg-[#060E0E]">
          <h2 className="text-center text-2xl font-semibold text-gray-100 mb-6">
            {isLoggedIn ? "Enter OTP to Logout" : "Enter OTP to Login"}
          </h2>

          {/* OTP input form */}
          <form className="flex justify-between space-x-6 bg-[#1A1F1F] p-4 rounded-lg">
            {otp.map((_, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                className="w-12 h-16 text-3xl text-gray-100 text-center bg-transparent border-2 border-[#36BCBA] rounded-md focus:outline-none"
                placeholder="0"
                value={otp[index]}
                onChange={(e) => handleOtpChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
          </form>

          {/* Button for Login or Logout */}
          <button
            className="mt-6 w-full py-2 text-3xl font-semibold text-white rounded-lg bg-[#36BCBA] hover:bg-pink-500 transition duration-300"
            onClick={handleLoginLogout}
          >
            {isLoggedIn ? "TIME OUT" : "LOG IN"}
          </button>

          {/* Showing Login/Logout Time */}
          {loginTime && (
            <div className="mt-4 text-white">
              <p>Login Time: {loginTime}</p>
            </div>
          )}

          {logoutTime && (
            <div className="mt-4 text-white">
              <p>Logout Time: {logoutTime}</p>
              {sessionDuration && (
                <p>Session Duration: {sessionDuration} hours</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Logout;
