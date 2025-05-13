import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { Link } from 'react-router-dom';

export default function Register() {
    const [userDetails, setUserDetails] = useState({
        firstName: '',
        lastName: '',
        email: '',
        age: '',
        contactNumber: '',
        password: '',
        confirmPassword: '',
    });
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [registrationError, setRegistrationError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserDetails({ ...userDetails, [name]: value });
    };

    const isFormValid = () => {
        let errorsInForm = {};
        let isValid = true;

        if (!userDetails.firstName.trim()) {
            errorsInForm.firstName = 'First Name is required';
            isValid = false;
        }

        if (!userDetails.lastName.trim()) {
            errorsInForm.lastName = 'Last Name is required';
            isValid = false;
        }

        if (!userDetails.email.trim()) {
            errorsInForm.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(userDetails.email)) {
            errorsInForm.email = 'Email is invalid';
            isValid = false;
        } else if (!/@iiit\.ac\.in$/.test(userDetails.email)){
           errorsInForm.email = 'Email must be a iiit email';
            isValid = false;
        }

        if(!userDetails.age){
            errorsInForm.age = 'Age is required';
            isValid = false;
        }
        if (userDetails.age <= 0) {
            errorsInForm.age = 'Age must be a valid number';
            isValid = false;
        }

        if (!userDetails.contactNumber.trim()) {
            errorsInForm.contactNumber = 'Contact Number is required';
            isValid = false;
        } else if (!/^[0-9]{10}$/.test(userDetails.contactNumber)) {
            errorsInForm.contactNumber = 'Contact number is invalid';
            isValid = false;
        }

        if (!userDetails.password.trim()) {
            errorsInForm.password = 'Password is required';
            isValid = false;
        } else if (userDetails.password.length < 4) {
            errorsInForm.password = 'Password must be at least 4 characters';
            isValid = false;
        }

        if (userDetails.password !== userDetails.confirmPassword) {
            errorsInForm.confirmPassword = 'Passwords do not match';
             isValid = false;
        }
        
        setErrors(errorsInForm);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setRegistrationError('');
        if (isFormValid()) {
            try {
                const { confirmPassword, ...data } = userDetails;
                const response = await axios.post('/auth/register',data);
                if(response.status === 201){
                    navigate('/login');
                }
            } catch (error) {
                 setRegistrationError(error.response?.data?.message ? error.response.data.message : 'Registration failed, please try again');
            }
        }
    };

    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-center p-6">
        <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-md border border-gray-300 relative">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Register
          </h1>
          {registrationError && (
            <p className="text-red-500 text-sm mb-3">{registrationError}</p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={userDetails.firstName}
                onChange={handleChange}
                className={`w-full px-4 py-2 border border-gray-600 bg-gray-900 text-yellow-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:outline-none
             ${errors.firstName ? 'border-red-500' : ''}`}
              />
              {errors.firstName && (
                <span className="text-red-500 text-sm mt-2 block">
                  {errors.firstName}
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={userDetails.lastName}
                onChange={handleChange}
                className={`w-full px-4 py-2 border border-gray-600 bg-gray-900 text-yellow-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:outline-none
             ${errors.firstName ? 'border-red-500' : ''}`}
              />
              {errors.lastName && (
                <span className="text-red-500 text-sm mt-2 block">
                  {errors.lastName}
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={userDetails.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border border-gray-600 bg-gray-900 text-yellow-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:outline-none
             ${errors.firstName ? 'border-red-500' : ''}`}
              />
              {errors.email && (
                <span className="text-red-500 text-sm mt-2 block">
                  {errors.email}
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={userDetails.age}
                onChange={handleChange}
                className={`w-full px-4 py-2 border border-gray-600 bg-gray-900 text-yellow-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:outline-none
             ${errors.firstName ? 'border-red-500' : ''}`}
              />
              {errors.age && (
                <span className="text-red-500 text-sm mt-2 block">
                  {errors.age}
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                name="contactNumber"
                placeholder="Contact Number"
                value={userDetails.contactNumber}
                onChange={handleChange}
                className={`w-full px-4 py-2 border border-gray-600 bg-gray-900 text-yellow-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:outline-none
             ${errors.firstName ? 'border-red-500' : ''}`}
              />
              {errors.contactNumber && (
                <span className="text-red-500 text-sm mt-2 block">
                  {errors.contactNumber}
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={userDetails.password}
                onChange={handleChange}
                className={`w-full px-4 py-2 border border-gray-600 bg-gray-900 text-yellow-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:outline-none
             ${errors.firstName ? 'border-red-500' : ''}`}
              />
              {errors.password && (
                <span className="text-red-500 text-sm mt-2 block">
                  {errors.password}
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={userDetails.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-2 border border-gray-600 bg-gray-900 text-yellow-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:outline-none
             ${errors.firstName ? 'border-red-500' : ''}`}
              />
              {errors.confirmPassword && (
                <span className="text-red-500 text-sm mt-2 block">
                  {errors.confirmPassword}
                </span>
              )}
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 border border-gray-600 bg-gray-900 text-yellow-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:outline-none"
            >
              Register
            </button>
          </form>
          <div className="mt-4 text-center">
            <p>Already have an account?</p>
            <Link to="/login">
              <button 
                className="w-45 px-4 py-2 border border-gray-600 bg-gray-900 text-yellow-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:outline-none">
                Login
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
}