import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import { toast } from 'react-toastify';

const UpdateEmployee = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { employee } = location.state || {};
  console.log(employee._id);
  console.log("Employee Record: ", employee)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    in_time: '',
    out_time: '',
    joining_date: '',
    CNIC_No: '',
    designation: '',
    role_company: ''
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        email: employee.email || '',
        address: employee.address || '',
        in_time: employee.in_time || '',
        out_time: employee.out_time || '',
        joining_date: employee.joining_date
          ? new Date(employee.joining_date).toISOString().split('T')[0]
          : '',
        CNIC_No: employee.CNIC_No || '',
        designation: employee.designation.role || '',
        role_company: employee.role_company || '',
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const localData = JSON.parse(localStorage.getItem(`employeeId`));
      console.log("Local Data: ",localData)
      const updatedData = {
        ...formData,
        role_name: formData.designation || '',
      };
      console.log("Form Data: ", updatedData);

      const response = await axios.put(`http://172.16.0.5:5000/update-employee/${id}`, updatedData);
      console.log('✅ Record updated successfully:', response.data);

      toast.success('✅ Record updated successfully');

      // Navigate to the previous page
      navigate(-1); // Go back to the previous page
    } catch (error) {
      console.error('❌ Error updating record:', error.response?.data || error.message);
      toast.error('❌ Error updating record');
    }
  };


  return (
    <div className="max-w-full mx-auto px-6 rounded shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-gray-200">Update Employee Record</h2>
      <p className='text-gray-500 -mt-4 mb-4'>Update an Employee Record</p>
      <form
        className="space-y-6 border border-2 border-gray-800 p-4 rounded-lg"
        onSubmit={handleUpdate}
      >
        {/* Full-width fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-[#36BCBA] rounded bg-transparent px-4 py-2 outline-none text-[#36BCBA]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-[#36BCBA] rounded bg-transparent px-4 py-2 outline-none text-[#36BCBA]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <input
              type="text"
              name="address"
              placeholder="Enter Address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border border-[#36BCBA] rounded bg-transparent px-4 py-2 outline-none text-[#36BCBA]"
            />
          </div>
        </div>

        {/* Two-column fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">In Time</label>
            <input
              type="time"
              name="in_time"
              value={formData.in_time}
              onChange={handleChange}
              className="w-full border border-[#36BCBA] bg-transparent text-[#36BCBA] rounded px-4 py-2 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Out Time</label>
            <input
              type="time"
              name="out_time"
              value={formData.out_time}
              onChange={handleChange}
              className="w-full border border-[#36BCBA] bg-transparent text-[#36BCBA] rounded px-4 py-2 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Joining Date</label>
            <input
              type="date"
              name="joining_date"
              value={formData.joining_date}
              onChange={handleChange}
              className="w-full border border-[#36BCBA] bg-transparent text-[#36BCBA] rounded px-4 py-2 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">CNIC Last 6 Digits</label>
            <input
              type="text"
              name="CNIC_No"
              placeholder="This is Autocomplete Field"
              value={formData.CNIC_No}
              onChange={handleChange}
              className="w-full border border-[#36BCBA] bg-transparent text-[#36BCBA] rounded px-4 py-2 outline-none"
            />
          </div>
        </div>

        {/* Full-width Designation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
            <select
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className="w-full border border-[#36BCBA] bg-gray-800 text-[#36BCBA] rounded px-4 py-2 outline-none appearance-none"
            >
              <option value="" disabled>
                Select Designation
              </option>
              <option value="Admin">Admin</option>
              <option value="Developer">Developer</option>
              <option value="Sales">Sales</option>
              <option value="IT">IT</option>
              <option value="Designer">Designer</option>
              <option value="Agency">Agency</option>
              <option value="Lead">Lead</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Role</label>
            <select
              name="role_company"
              value={formData.role_company}
              onChange={handleChange}
              className="w-full border border-[#36BCBA] bg-gray-800 text-[#36BCBA] rounded px-4 py-2 outline-none appearance-none"
            >
              <option value="" disabled>
                Select Company Role
              </option>
              <option value="Admin">Admin</option>
              <option value="Employee">Employee</option>
            </select>
          </div>
        </div>


        {/* Buttons */}
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="bg-[#36BCBA] hover:bg-blue-900 font-bold text-black py-2 px-8 rounded-full shadow"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  )
}

export default UpdateEmployee;