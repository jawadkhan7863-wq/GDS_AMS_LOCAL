import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const EmployeeRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    in_time: '',
    out_time: '',
    joining_date: '',
    CNIC_No: '',
    designation: '',
    role_company: '',
  });

  console.log("Form Data--------->",formData)

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'CNIC_No') {
      // Allow only numeric values and validate length dynamically
      if (/^\d{0,13}$/.test(value)) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));

        // Show error if length is between 1 and 12, hide if 13 digits
        setErrors((prev) => ({
          ...prev,
          CNIC_No:
            value.length > 0 && value.length < 13
              ? 'Please enter a valid 13-digit CNIC number without dashes.(-)'
              : '',
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required.';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'A valid email is required.';
    if (!formData.address) newErrors.address = 'Address is required.';
    if (!formData.in_time) newErrors.in_time = 'In time is required.';
    if (!formData.out_time) newErrors.out_time = 'Out time is required.';
    if (!formData.joining_date) newErrors.joining_date = 'Joining date is required.';
    if (formData.CNIC_No.length > 0 && formData.CNIC_No.length < 13) {
      newErrors.CNIC_No = 'Please enter a valid 13-digit CNIC number.';
    }
    if (!formData.designation) newErrors.designation = 'Designation is required.';
    if (!formData.role_company) newErrors.role_company = 'Company role is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors in the form.');
      return;
    }

    try {
      const response = await axios.post('http://147.93.119.175:5000/register-employee', formData);
      console.log('Form submitted successfully:', response.data);
      toast.success('Form submitted successfully');
      setFormData({
        name: '',
        email: '',
        address: '',
        in_time: '',
        out_time: '',
        joining_date: '',
        CNIC_No: '',
        designation: '',
        role_company: '',
      });
      setErrors({});
      navigate('/all-employees')
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Error submitting form');
    }
  };

  return (
    <div className="max-w-full mx-auto px-6 rounded shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-gray-200">Employee Registration</h2>
      <p className="text-gray-500 -mt-4 mb-4">Create an Employee</p>
      <form
        className="space-y-6 border border-2 border-gray-800 p-4 rounded-lg"
        onSubmit={handleSubmit}
      >
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
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
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
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
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
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>
        </div>

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
            {errors.in_time && <p className="text-red-500 text-sm mt-1">{errors.in_time}</p>}
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
            {errors.out_time && <p className="text-red-500 text-sm mt-1">{errors.out_time}</p>}
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
            {errors.joining_date && (
              <p className="text-red-500 text-sm mt-1">{errors.joining_date}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Enter 13-digit CNIC</label>
            <input
              type="text"
              name="CNIC_No"
              placeholder="Enter 13-digit CNIC"
              value={formData.CNIC_No}
              onChange={handleChange}
              className="w-full border border-[#36BCBA] bg-transparent text-[#36BCBA] rounded px-4 py-2 outline-none"
            />
            {errors.CNIC_No && <p className="text-red-500 text-sm mt-1">{errors.CNIC_No}</p>}
          </div>
        </div>

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
              <option value="Developer">Developer</option>
              <option value="Sales">Sales</option>
              <option value="IT">IT</option>
              <option value="Designer">Designer</option>
              <option value="GDS Agency">GDS Agency</option>
              <option value="Lead">Lead</option>
              <option value="Data Mining">Data Mining</option>
              <option value="MindHive">MindHive</option>
              <option value="GDS">GDS</option>

            </select>
            {errors.designation && <p className="text-red-500 text-sm mt-1">{errors.designation}</p>}
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
            {errors.role_company && (
              <p className="text-red-500 text-sm mt-1">{errors.role_company}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="bg-[#36BCBA] hover:bg-blue-900 font-bold text-black py-2 px-8 rounded-full shadow"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeRegistration;
