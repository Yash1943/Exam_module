import React, { useState, useEffect } from 'react';
import { User, Lock, BookOpen } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { check_signin_apptitude_exam } from '../api/signup_and_signin';
import { useAuth } from '../context/AuthContext';
import SamarthLogo from '../assets/SD_Technoverse_JPG_copy.jpg';

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({
    studentId: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (location.state && location.state.registrationSuccess) {
      setSuccessMessage(location.state.registrationSuccess);
      // Clear the state so the message doesn't reappear on subsequent visits
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  // console.log("credentials",credentials)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors
    if (credentials.studentId && credentials.password) {
      console.log("inside the handlesubmit")

      try {
        const signin_exam = await check_signin_apptitude_exam(credentials.studentId, credentials.password);
        console.log("signin_exam",signin_exam.data.message.response.length);
        if (signin_exam.data.message.status == "success" && signin_exam.data.message.response.length > 0) {
          console.log("inside the if");
          
          // Store user data in auth context
          login({
            studentId: credentials.studentId,
            ...signin_exam.data.message.response[0]
          });
          navigate('/instructions');
        }else{
          setError('Invalid Aadhar Card No or password');
        }
      }
      catch (error) {
        console.log("getting error", error);
        setError('An error occurred. Please try again.');
      }
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <img src={SamarthLogo} alt="Samarth Technoverse Logo" className="mx-auto w-64 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Apptitude Exam System</h1>
          <p className="text-gray-600">Please login to start your exam</p>
        </div>

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline"> {successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Aadhar card No
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="studentId"
                value={credentials.studentId}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your Aadhar Card No"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm mt-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#1c2e4a] hover:bg-[#1c2e4a] text-white font-semibold py-3 px-4 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Login to Exam
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSignUp}
            className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 px-4 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Create New Account
          </button>
        </form>
        

        {/* <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Demo Credentials:</h3>
          <p className="text-sm text-blue-700">Student ID: <strong>DEMO001</strong></p>
          <p className="text-sm text-blue-700">Password: <strong>password123</strong></p>
        </div> */}
      </div>
    </div>
  );
};

export default LoginForm;