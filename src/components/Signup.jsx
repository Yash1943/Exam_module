import React, { useEffect, useState, useCallback, useMemo } from "react";
import { save_signup_data, get_position_preffrence } from "../api/signup_and_signin";
import { useNavigate } from "react-router-dom";

// Mock API functions for demonstration
// const save_signup_data = async (...args) => {
//   await new Promise(resolve => setTimeout(resolve, 1000));
//   return { status: "success" };
// };

// const get_position_preffrence = async () => {
//   await new Promise(resolve => setTimeout(resolve, 500));
//   return {
//     data: {
//       message: [
//         { name: "software_engineer", category: "Software Engineer" },
//         { name: "data_analyst", category: "Data Analyst" },
//         { name: "product_manager", category: "Product Manager" },
//         { name: "ui_ux_designer", category: "UI/UX Designer" }
//       ]
//     }
//   };
// };

// Separate InputField component to prevent recreation
const InputField = React.memo(
  ({
    label,
    name,
    type = "text",
    required = true,
    placeholder = "",
    value,
    onChange,
    onBlur,
    error,
    helperText,
  }) => (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        placeholder={placeholder}
        autoComplete={getAutoComplete(name)}
        className={`w-full px-3 py-2 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
          error ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
        }`}
      />
      {error && (
        <p className="text-sm text-red-600 flex items-center">
          <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
      {helperText && !error && <p className="text-xs text-gray-500">{helperText}</p>}
    </div>
  )
);

// Helper function for autocomplete attributes
const getAutoComplete = (fieldName) => {
  const autoCompleteMap = {
    full_name: "name",
    email_id: "email",
    phone_no: "tel",
    password: "new-password",
    confirm_password: "new-password",
  };
  return autoCompleteMap[fieldName] || "off";
};

// Validation utilities
const validationRules = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^[6-9]\d{9}$/,
  aadhar: /^\d{12}$/,
  password: {
    minLength: 8,
    hasUppercase: /[A-Z]/,
    hasLowercase: /[a-z]/,
    hasNumber: /\d/,
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/,
  },
  name: /^[a-zA-Z\s]{2,50}$/,
  prn: /^[a-zA-Z0-9]{6,20}$/,
  year: /^(19|20)\d{2}$/,
};

// Sanitization function
const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;
  return input.trim().replace(/[<>]/g, "");
};

const Signup = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    college_name: "",
    branch: "",
    aadhar_card_no: "",
    applied_position_preference: "",
    prn_no: "",
    phone_no: "",
    email_id: "",
    semester: "",
    password: "",
    confirm_password: "",
    graduated: false,
    year_of_passing: "",
  });

  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [success, setSuccess] = useState("");
  const [preferences, setPreferences] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch preferences on mount
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const data = await get_position_preffrence();
        console.log("message", data.data.message);
        setPreferences(data.data.message || []);
      } catch (error) {
        console.error("Failed to fetch preferences:", error);
        setPreferences([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPreferences();
  }, []);

  // Validation functions
  const validateField = useCallback(
    (name, value) => {
      const sanitizedValue = sanitizeInput(value);

      switch (name) {
        case "full_name":
          if (!sanitizedValue) return "Full name is required";
          if (!validationRules.name.test(sanitizedValue)) {
            return "Name must be 2-50 characters and contain only letters and spaces";
          }
          break;

        case "college_name":
          if (!sanitizedValue) return "College name is required";
          if (sanitizedValue.length < 2) return "College name must be at least 2 characters";
          break;

        case "branch":
          if (!sanitizedValue) return "Branch is required";
          if (sanitizedValue.length < 2) return "Branch must be at least 2 characters";
          break;

        case "aadhar_card_no":
          if (!sanitizedValue) return "Aadhar card number is required";
          const cleanAadhar = sanitizedValue.replace(/\s+/g, "");
          if (!validationRules.aadhar.test(cleanAadhar)) {
            return "Please enter a valid 12-digit Aadhar number";
          }
          break;

        case "applied_position_preference":
          if (!sanitizedValue) return "Position preference is required";
          break;

        case "prn_no":
          if (sanitizedValue && !validationRules.prn.test(sanitizedValue)) {
            return "PRN must be 6-20 characters containing letters and numbers only";
          }
          break;

        case "phone_no":
          if (!sanitizedValue) return "Phone number is required";
          const cleanPhone = sanitizedValue.replace(/\s+/g, "");
          if (!validationRules.phone.test(cleanPhone)) {
            return "Please enter a valid 10-digit Indian mobile number starting with 6-9";
          }
          break;

        case "email_id":
          if (!sanitizedValue) return "Email is required";
          if (!validationRules.email.test(sanitizedValue)) {
            return "Please enter a valid email address";
          }
          break;

        case "semester":
          if (sanitizedValue) {
            const semNum = parseInt(sanitizedValue);
            if (isNaN(semNum) || semNum < 1 || semNum > 8) {
              return "Please select a valid semester (1-8)";
            }
          }
          break;

        case "password":
          if (!value) return "Password is required";
          const rules = validationRules.password;
          if (value.length < rules.minLength)
            return `Password must be at least ${rules.minLength} characters`;
          if (!rules.hasUppercase.test(value))
            return "Password must contain at least one uppercase letter";
          if (!rules.hasLowercase.test(value))
            return "Password must contain at least one lowercase letter";
          if (!rules.hasNumber.test(value)) return "Password must contain at least one number";
          if (!rules.hasSpecial.test(value))
            return "Password must contain at least one special character";
          break;

        case "confirm_password":
          if (!value) return "Please confirm your password";
          if (value !== formData.password) return "Passwords do not match";
          break;

        case "year_of_passing":
          if (formData.graduated) {
            if (!sanitizedValue) return "Year of passing is required";
            if (!validationRules.year.test(sanitizedValue)) {
              return "Enter a valid year (e.g., 2022)";
            }
            const year = parseInt(sanitizedValue, 10);
            const currentYear = new Date().getFullYear();
            if (year < 1950 || year > currentYear) {
              return `Year must be between 1950 and ${currentYear}`;
            }
          }
          break;

        default:
          return "";
      }
      return "";
    },
    [formData.password, formData.graduated]
  );

  // Memoized validation for all fields
  const formErrors = useMemo(() => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (touchedFields[key]) {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });
    return newErrors;
  }, [formData, touchedFields, validateField]);

  // Update errors when formErrors change
  useEffect(() => {
    setErrors(formErrors);
  }, [formErrors]);

  // Handle input changes
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "graduated" && !checked ? { year_of_passing: "" } : {}),
    }));
    setSuccess(""); // Clear success message on any change
  }, []);

  // Handle field blur
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouchedFields((prev) => ({
      ...prev,
      [name]: true,
    }));
  }, []);

  // Validate entire form
  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      if (key === "year_of_passing" && !formData.graduated) return;
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouchedFields(
      Object.keys(formData).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {})
    );

    return isValid;
  }, [formData, validateField]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      // Sanitize all form data before sending
      const sanitizedData = Object.keys(formData).reduce((acc, key) => {
        acc[key] =
          key === "password" || key === "confirm_password"
            ? formData[key]
            : sanitizeInput(formData[key]);
        return acc;
      }, {});
      console.log("sanitizedData.year_of_passing ", sanitizedData.year_of_passing);

      const response = await save_signup_data(
        sanitizedData.full_name,
        sanitizedData.college_name,
        sanitizedData.branch,
        sanitizedData.aadhar_card_no.replace(/\s+/g, ""), // Remove spaces from Aadhar
        sanitizedData.applied_position_preference,
        sanitizedData.prn_no,
        sanitizedData.phone_no.replace(/\s+/g, ""), // Remove spaces from phone
        sanitizedData.email_id.toLowerCase(), // Normalize email
        sanitizedData.semester,
        sanitizedData.password,
        sanitizedData.year_of_passing ? sanitizedData.year_of_passing : 0
      );

      console.log("response in the signin", response);

      if (response.success && response.data.message.status === "success") {
        // Set success message and redirect to login page
        navigate("/", {
          state: { registrationSuccess: "Registration successful! Welcome aboard!" },
        });
      } else if (response.success && response.data.message.status === "error") {
        // Parse the server message if available
        let errorMessage = "Registration failed. Please try again.";
        let technicalError = "";

        if (response._server_messages) {
          try {
            const serverMessages = JSON.parse(response._server_messages);
            if (serverMessages && serverMessages[0]) {
              const parsedMessage = JSON.parse(serverMessages[0]);
              errorMessage = parsedMessage.message || errorMessage;
            }
          } catch (e) {
            console.error("Error parsing server messages:", e);
          }
        }

        // Get technical error message
        if (response.data.message.message) {
          technicalError = response.data.message.message;
        }

        setErrors({
          submit: `${errorMessage}${technicalError ? ` (${technicalError})` : ""}`,
        });
      } else {
        setErrors({ submit: "Registration failed. Please try again." });
      }
    } catch (err) {
      console.error("Signup error:", err);
      setErrors({ submit: "Registration failed. Please check your connection and try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-[#1c2e4a] hover:bg-[#1c2e4a] text-white px-6 py-8 sm:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">Create Account</h2>
              <p className="mt-2 text-blue-100">Join us and start your journey today</p>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mx-6 mt-6 bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 text-green-400 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
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
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
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
                  value={formData.full_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.full_name}
                />
                <InputField
                  label="Phone Number"
                  name="phone_no"
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={formData.phone_no}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.phone_no}
                />
                <InputField
                  label="Email Address"
                  name="email_id"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email_id}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.email_id}
                />
                <InputField
                  label="Aadhar Card Number"
                  name="aadhar_card_no"
                  placeholder="12-digit Aadhar number"
                  value={formData.aadhar_card_no}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.aadhar_card_no}
                />
              </div>

              {/* Academic Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Academic Information
                </h3>
                <InputField
                  label="College Name"
                  name="college_name"
                  placeholder="Enter your college name"
                  value={formData.college_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.college_name}
                />
                <InputField
                  label="Branch/Department"
                  name="branch"
                  placeholder="e.g., Computer Science"
                  value={formData.branch}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.branch}
                />
                <InputField
                  label="PRN Number"
                  name="prn_no"
                  placeholder="Your PRN number"
                  value={formData.prn_no}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.prn_no}
                  required={false}
                />
                <div className="space-y-1">
                  <label htmlFor="semester" className="block text-sm font-medium text-gray-700">
                    Semester
                  </label>
                  <select
                    id="semester"
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={`w-full px-3 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                      errors.semester
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}>
                    <option value="">Select Semester</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <option key={sem} value={sem}>
                        Semester {sem}
                      </option>
                    ))}
                  </select>
                  {errors.semester && (
                    <p className="text-sm text-red-600 flex items-center">
                      <svg
                        className="w-4 h-4 mr-1 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.semester}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <label htmlFor="graduated" className="block text-sm font-medium text-gray-700">
                    <input
                      type="checkbox"
                      id="graduated"
                      name="graduated"
                      checked={formData.graduated}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    Graduated
                  </label>
                </div>
                {formData.graduated && (
                  <InputField
                    label="Year of Passing"
                    name="year_of_passing"
                    type="number"
                    placeholder="e.g., 2022"
                    value={formData.year_of_passing}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.year_of_passing}
                  />
                )}
              </div>

              {/* Application & Security */}
              <div className="md:col-span-2 space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Application & Security
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label
                      htmlFor="applied_position_preference"
                      className="block text-sm font-medium text-gray-700">
                      Position Preference <span className="text-red-500 ml-1">*</span>
                    </label>
                    <select
                      id="applied_position_preference"
                      name="applied_position_preference"
                      value={formData.applied_position_preference}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className={`w-full px-3 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                        errors.applied_position_preference
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}>
                      <option value="">Select a position</option>
                      {preferences.map((pref, index) => (
                        <option key={index} value={pref.name}>
                          {pref.position_name}
                        </option>
                      ))}
                    </select>
                    {errors.applied_position_preference && (
                      <p className="text-sm text-red-600 flex items-center">
                        <svg
                          className="w-4 h-4 mr-1 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.applied_position_preference}
                      </p>
                    )}
                  </div>
                  <div></div>
                  <InputField
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.password}
                    helperText="Must contain uppercase, lowercase, number, and special character"
                  />
                  <InputField
                    label="Confirm Password"
                    name="confirm_password"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.confirm_password}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting || Object.keys(errors).length > 0}
                className={`w-full md:w-auto md:min-w-[200px] flex justify-center items-center py-3 px-6 border border-transparent text-base font-medium rounded-lg text-white transition-all duration-200 ${
                  isSubmitting || Object.keys(errors).length > 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#1c2e4a] hover:bg-[#1c2e4a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform hover:scale-105"
                }`}>
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
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
