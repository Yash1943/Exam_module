import React, { useState } from 'react';
import {save_signup_data} from '../api/signup_and_signin'


const Signup = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    collage_name: '',
    branch: '',
    addhar_card_no: '',
    applied_position_preference: '',
    prn_no: '',
    phone_no: '',
    email_id: '',
    semester: '',
    password: '',
    confirm_password: ''
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/; // Indian mobile number format
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  };

  const validateAadhar = (aadhar) => {
    const aadharRegex = /^\d{12}$/;
    return aadharRegex.test(aadhar.replace(/\s+/g, ''));
  };

  const validatePassword = (password) => {
    return password.length >= 8 && 
           /[A-Z]/.test(password) && 
           /[a-z]/.test(password) && 
           /\d/.test(password) && 
           /[!@#$%^&*(),.?":{}|<>]/.test(password);
  };

  const validateForm = () => {
    const newErrors = {};

    // Full name validation
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    } else if (formData.full_name.length < 2) {
      newErrors.full_name = 'Full name must be at least 2 characters';
    }

    // College name validation
    if (!formData.collage_name.trim()) {
      newErrors.collage_name = 'College name is required';
    }

    // Branch validation
    if (!formData.branch.trim()) {
      newErrors.branch = 'Branch is required';
    }

    // Aadhar validation
    if (!formData.addhar_card_no.trim()) {
      newErrors.addhar_card_no = 'Aadhar card number is required';
    } else if (!validateAadhar(formData.addhar_card_no)) {
      newErrors.addhar_card_no = 'Please enter a valid 12-digit Aadhar number';
    }

    // Position preference validation
    if (!formData.applied_position_preference.trim()) {
      newErrors.applied_position_preference = 'Position preference is required';
    }

    // PRN validation
    if (!formData.prn_no.trim()) {
      newErrors.prn_no = 'PRN number is required';
    }

    // Phone validation
    if (!formData.phone_no.trim()) {
      newErrors.phone_no = 'Phone number is required';
    } else if (!validatePhone(formData.phone_no)) {
      newErrors.phone_no = 'Please enter a valid 10-digit Indian mobile number';
    }

    // Email validation
    if (!formData.email_id.trim()) {
      newErrors.email_id = 'Email is required';
    } else if (!validateEmail(formData.email_id)) {
      newErrors.email_id = 'Please enter a valid email address';
    }

    // Semester validation
    if (!formData.semester.trim()) {
      newErrors.semester = 'Semester is required';
    } else if (isNaN(formData.semester) || formData.semester < 1 || formData.semester > 8) {
      newErrors.semester = 'Please enter a valid semester (1-8)';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be 8+ characters with uppercase, lowercase, number, and special character';
    }

    // Confirm password validation
    if (!formData.confirm_password) {
      newErrors.confirm_password = 'Please confirm your password';
    } else if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');

    if (!validateForm()) {
      return;
    }



    setIsSubmitting(true);

    try {

      const save_data = await save_signup_data(
        
      )
      // Simulated API call - replace with your actual API
      // await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful response
      // const response = { status: "success" };

      if (response.status === "success") {
        setSuccess('Registration successful! Welcome aboard!');
        setFormData({
          full_name: '',
          collage_name: '',
          branch: '',
          addhar_card_no: '',
          applied_position_preference: '',
          prn_no: '',
          phone_no: '',
          email_id: '',
          semester: '',
          password: '',
          confirm_password: ''
        });
        setErrors({});
      }
    } catch (err) {
      setErrors({ submit: 'Registration failed. Please try again.' });
      console.error('Signup error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const InputField = ({ label, name, type = "text", required = true, placeholder = "" }) => (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        required={required}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200 ${
          errors[name] ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
        }`}
      />
      {errors[name] && (
        <p className="text-sm text-red-600 flex items-center">
          <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-8 sm:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Create Account
              </h2>
              <p className="mt-2 text-indigo-100">
                Join us and start your journey today
              </p>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mx-6 mt-6 bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-medium text-green-800">{success}</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errors.submit && (
            <div className="mx-6 mt-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-medium text-red-800">{errors.submit}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <div className="px-6 py-8 sm:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Personal Information
                </h3>
                <InputField 
                  label="Full Name" 
                  name="full_name" 
                  placeholder="Enter your full name"
                />
                <InputField 
                  label="Phone Number" 
                  name="phone_no" 
                  type="tel" 
                  placeholder="10-digit mobile number"
                />
                <InputField 
                  label="Email Address" 
                  name="email_id" 
                  type="email" 
                  placeholder="your.email@example.com"
                />
                <InputField 
                  label="Aadhar Card Number" 
                  name="addhar_card_no" 
                  placeholder="12-digit Aadhar number"
                />
              </div>

              {/* Academic Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Academic Information
                </h3>
                <InputField 
                  label="College Name" 
                  name="collage_name" 
                  placeholder="Enter your college name"
                />
                <InputField 
                  label="Branch/Department" 
                  name="branch" 
                  placeholder="e.g., Computer Science"
                />
                <InputField 
                  label="PRN Number" 
                  name="prn_no" 
                  placeholder="Your PRN number"
                />
                <div className="space-y-1">
                  <label htmlFor="semester" className="block text-sm font-medium text-gray-700">
                    Semester <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    id="semester"
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    required
                    className={`w-full px-3 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200 ${
                      errors.semester ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <option value="">Select Semester</option>
                    {[1,2,3,4,5,6,7,8].map(sem => (
                      <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                  </select>
                  {errors.semester && (
                    <p className="text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.semester}
                    </p>
                  )}
                </div>
              </div>

              {/* Application & Security */}
              <div className="md:col-span-2 space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Application & Security
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField 
                    label="Position Preference" 
                    name="applied_position_preference" 
                    placeholder="e.g., Software Developer, Analyst"
                  />
                  <div></div>
                  <div className="space-y-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Create a strong password"
                      className={`w-full px-3 py-2 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200 ${
                        errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                    />
                    {errors.password && (
                      <p className="text-sm text-red-600 flex items-start">
                        <svg className="w-4 h-4 mr-1 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.password}
                      </p>
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                      Password must contain uppercase, lowercase, number, and special character
                    </div>
                  </div>
                  <InputField 
                    label="Confirm Password" 
                    name="confirm_password" 
                    type="password"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full md:w-auto md:min-w-[200px] flex justify-center items-center py-3 px-6 border border-transparent text-base font-medium rounded-lg text-white transition-all duration-200 ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white hover:bg-blue-500 hover:bg-blue-600 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:scale-105'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;


import React, { useEffect, useState, useCallback } from 'react';
import {save_signup_data , get_position_preffrence} from '../api/signup_and_signin'

const Signup = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    collage_name: '',
    branch: '',
    addhar_card_no: '',
    applied_position_preference: '',
    prn_no: '',
    phone_no: '',
    email_id: '',
    semester: '',
    password: '',
    confirm_password: ''
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [prefferances, setprefferances] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(()=>{
    const fetch_job_preferances = async () =>{
      try {
        const data = await get_position_preffrence()
        console.log("data",data.data.message)
        setprefferances(data.data.message || [])
      } catch (error) {
        console.error(error)
        setprefferances([])
      }
    }
    fetch_job_preferances()
  },[])

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/; // Indian mobile number format
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  };

  const validateAadhar = (aadhar) => {
    const aadharRegex = /^\d{12}$/;
    return aadharRegex.test(aadhar.replace(/\s+/g, ''));
  };

  const validatePassword = (password) => {
    return password.length >= 8 && 
           /[A-Z]/.test(password) && 
           /[a-z]/.test(password) && 
           /\d/.test(password) && 
           /[!@#$%^&*(),.?":{}|<>]/.test(password);
  };

  const validateForm = () => {
    const newErrors = {};

    // Full name validation
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    } else if (formData.full_name.length < 2) {
      newErrors.full_name = 'Full name must be at least 2 characters';
    }

    // College name validation
    if (!formData.collage_name.trim()) {
      newErrors.collage_name = 'College name is required';
    }

    // Branch validation
    if (!formData.branch.trim()) {
      newErrors.branch = 'Branch is required';
    }

    // Aadhar validation
    if (!formData.addhar_card_no.trim()) {
      newErrors.addhar_card_no = 'Aadhar card number is required';
    } else if (!validateAadhar(formData.addhar_card_no)) {
      newErrors.addhar_card_no = 'Please enter a valid 12-digit Aadhar number';
    }

    // Position preference validation
    if (!formData.applied_position_preference.trim()) {
      newErrors.applied_position_preference = 'Position preference is required';
    }

    // PRN validation
    if (!formData.prn_no.trim()) {
      newErrors.prn_no = 'PRN number is required';
    }

    // Phone validation
    if (!formData.phone_no.trim()) {
      newErrors.phone_no = 'Phone number is required';
    } else if (!validatePhone(formData.phone_no)) {
      newErrors.phone_no = 'Please enter a valid 10-digit Indian mobile number';
    }

    // Email validation
    if (!formData.email_id.trim()) {
      newErrors.email_id = 'Email is required';
    } else if (!validateEmail(formData.email_id)) {
      newErrors.email_id = 'Please enter a valid email address';
    }

    // Semester validation
    if (!formData.semester.trim()) {
      newErrors.semester = 'Semester is required';
    } else if (isNaN(formData.semester) || formData.semester < 1 || formData.semester > 8) {
      newErrors.semester = 'Please enter a valid semester (1-8)';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be 8+ characters with uppercase, lowercase, number, and special character';
    }

    // Confirm password validation
    if (!formData.confirm_password) {
      newErrors.confirm_password = 'Please confirm your password';
    } else if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fixed handleChange with useCallback to prevent unnecessary re-renders
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  // Validation function for individual fields
  const validateField = (name, value) => {
    switch (name) {
      case 'full_name':
        if (!value.trim()) return 'Full name is required';
        if (value.length < 2) return 'Full name must be at least 2 characters';
        break;
      case 'email_id':
        if (!value.trim()) return 'Email is required';
        if (!validateEmail(value)) return 'Please enter a valid email address';
        break;
      case 'phone_no':
        if (!value.trim()) return 'Phone number is required';
        if (!validatePhone(value)) return 'Please enter a valid 10-digit Indian mobile number';
        break;
      case 'addhar_card_no':
        if (!value.trim()) return 'Aadhar card number is required';
        if (!validateAadhar(value)) return 'Please enter a valid 12-digit Aadhar number';
        break;
      case 'password':
        if (!value) return 'Password is required';
        if (!validatePassword(value)) return 'Password must be 8+ characters with uppercase, lowercase, number, and special character';
        break;
      case 'confirm_password':
        if (!value) return 'Please confirm your password';
        if (value !== formData.password) return 'Passwords do not match';
        break;
      default:
        return '';
    }
    return '';
  };

  // Fixed onBlur handler with useCallback
  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  }, [formData.password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      const save_data = await save_signup_data(
        formData.full_name,
        formData.collage_name,
        formData.branch,
        formData.addhar_card_no,
        formData.applied_position_preference,
        formData.prn_no,
        formData.phone_no,
        formData.email_id,
        formData.semester,
        formData.password
      );

      if (save_data.status === "success") {
        setSuccess('Registration successful!');
        setFormData({
          full_name: '',
          collage_name: '',
          branch: '',
          addhar_card_no: '',
          applied_position_preference: '',
          prn_no: '',
          phone_no: '',
          email_id: '',
          semester: '',
          password: '',
          confirm_password: ''
        });
      } else if(save_data.status === "error") {
        setErrors({ submit: 'Registration failed. Please try again.' });
      }
    } catch (err) {
      setErrors({ submit: 'Registration failed. Please try again.' });
      console.error('Signup error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Removed React.memo and made InputField a regular component
  const InputField = ({ label, name, type = "text", required = true, placeholder = "" }) => (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        onBlur={handleBlur}
        required={required}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200 ${
          errors[name] ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
        }`}
      />
      {errors[name] && (
        <p className="text-sm text-red-600 flex items-center">
          <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-8 sm:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Create Account
              </h2>
              <p className="mt-2 text-indigo-100">
                Join us and start your journey today
              </p>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mx-6 mt-6 bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-medium text-green-800">{success}</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errors.submit && (
            <div className="mx-6 mt-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-medium text-red-800">{errors.submit}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <div className="px-6 py-8 sm:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Personal Information
                </h3>
                <InputField 
                  label="Full Name" 
                  name="full_name" 
                  placeholder="Enter your full name"
                />
                <InputField 
                  label="Phone Number" 
                  name="phone_no" 
                  type="tel" 
                  placeholder="10-digit mobile number"
                />
                <InputField 
                  label="Email Address" 
                  name="email_id" 
                  type="email" 
                  placeholder="your.email@example.com"
                />
                <InputField 
                  label="Aadhar Card Number" 
                  name="addhar_card_no" 
                  placeholder="12-digit Aadhar number"
                />
              </div>

              {/* Academic Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Academic Information
                </h3>
                <InputField 
                  label="College Name" 
                  name="collage_name" 
                  placeholder="Enter your college name"
                />
                <InputField 
                  label="Branch/Department" 
                  name="branch" 
                  placeholder="e.g., Computer Science"
                />
                <InputField 
                  label="PRN Number" 
                  name="prn_no" 
                  placeholder="Your PRN number"
                />
                <div className="space-y-1">
                  <label htmlFor="semester" className="block text-sm font-medium text-gray-700">
                    Semester <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    id="semester"
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={`w-full px-3 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200 ${
                      errors.semester ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <option value="">Select Semester</option>
                    {[1,2,3,4,5,6,7,8].map(sem => (
                      <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                  </select>
                  {errors.semester && (
                    <p className="text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.semester}
                    </p>
                  )}
                </div>
              </div>

              {/* Application & Security */}
              <div className="md:col-span-2 space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Application & Security
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="applied_position_preference" className="block text-sm font-medium text-gray-700">
                      Position Preference <span className="text-red-500 ml-1">*</span>
                    </label>
                    <select
                      id="applied_position_preference"
                      name="applied_position_preference"
                      value={formData.applied_position_preference}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className={`mt-1 block w-full pl-3 pr-10 py-2 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md ${
                        errors.applied_position_preference ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select a position</option>
                      {prefferances.map((pref, index) => (
                        <option key={index} value={pref.name}>
                          {pref.category}
                        </option>
                      ))}
                    </select>
                    {errors.applied_position_preference && (
                      <p className="mt-2 text-sm text-red-600">{errors.applied_position_preference}</p>
                    )}
                  </div>
                  <div></div>
                  <div className="space-y-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      placeholder="Create a strong password"
                      className={`w-full px-3 py-2 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200 ${
                        errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                    />
                    {errors.password && (
                      <p className="text-sm text-red-600 flex items-start">
                        <svg className="w-4 h-4 mr-1 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.password}
                      </p>
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                      Password must contain uppercase, lowercase, number, and special character
                    </div>
                  </div>
                  <InputField 
                    label="Confirm Password" 
                    name="confirm_password" 
                    type="password"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full md:w-auto md:min-w-[200px] flex justify-center items-center py-3 px-6 border border-transparent text-base font-medium rounded-lg text-white transition-all duration-200 ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:scale-105'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;