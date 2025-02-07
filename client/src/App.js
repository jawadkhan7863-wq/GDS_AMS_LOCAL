import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard, Login, Logout } from './Pages';
import EmployeeRegistration from './Pages/EmployeeRegistration';
import Layout from './Components/Layout';
import AllEmployees from './Pages/AllEmployees';
import EmployeeDetail from './Pages/EmployeeDetail';
import UpdateEmployee from './Pages/UpdateEmployee';
import Break from './Pages/Break';
import EmployeeAttendance from './Pages/MonthlyAttendeOfEmployee';
import AllTodayLeaves from './Pages/AllTodayLeaves';
import AllTodayPresent from './Pages/AllTodayPresent';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// NotAllowed component to show the "not allowed" message
const NotAllowed = ({ message }) => {
  return (
    <div className='text-xl text-red-500 text-center mt-10 border border-red-500 py-6 px-12 rounded-lg'>
      <h1>Op's Access Denied</h1>
      <p className='text-md text-gray-500'>{message}</p>
    </div>
  );
};

const App = () => {
  const getUserData = () => {
    return {
      employeeId: localStorage.getItem('employeeId'),
      attendanceId: localStorage.getItem('attendanceId'),
      employeeName: localStorage.getItem('employeeName'),
      loginTime: localStorage.getItem('loginTime'),
      roleCompany: localStorage.getItem('roleCompany'),
    };
  };

  const ProtectedRoute = ({ children, allowedRoles }) => {
    const user = getUserData();

    if (!user.employeeId) {
      // Redirect to login if employeeId is not present (user is not logged in)
      return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.roleCompany)) {
      // Render "NotAllowed" message instead of redirecting
      return <NotAllowed message="You are not allowed to access this page. Only admins can access it." />;
    }

    return children;
  };

  useEffect(() => {
    const user = getUserData();
    if (user.employeeId) {
      console.log('Logged-in User:', user);
    } else {
      console.log('No user found in localStorage');
    }
  }, []);

  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />

        {/* Protected Routes */}
        <Route
          path="*"
          element={
            <Layout>
              <Routes>
                {/* Admin and Employee Access */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['Admin', 'Employee']}>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/all-employees"
                  element={
                    <ProtectedRoute allowedRoles={['Admin', 'Employee']}>
                      <AllEmployees />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/employee-registration"
                  element={
                    <ProtectedRoute allowedRoles={['Admin', 'Employee']}>
                      <EmployeeRegistration />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/update-employee/:id"
                  element={
                    <ProtectedRoute allowedRoles={['Admin', 'Employee']}>
                      <UpdateEmployee />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/employee-detail/:id"
                  element={
                    <ProtectedRoute allowedRoles={['Admin', 'Employee']}>
                      <EmployeeDetail />
                    </ProtectedRoute>
                  }
                />
                {/* Employee-Specific Pages */}
                <Route
                  path="/attendance/employee/:id"
                  element={
                    <ProtectedRoute allowedRoles={['Admin', 'Employee']}>
                      <EmployeeAttendance />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/break"
                  element={
                    <ProtectedRoute allowedRoles={['Employee', 'Admin']}>
                      <Break />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/all-today-leaves"
                  element={
                    <ProtectedRoute allowedRoles={['Admin']}>
                      <AllTodayLeaves />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/all-today-present"
                  element={
                    <ProtectedRoute allowedRoles={['Admin']}>
                      <AllTodayPresent />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
