import React from "react";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";

function SignupForm({ positionpreferences, handlesignup }) {
  return (
    <form onSubmit={handlesignup}>
      <FormInput label="Full Name" id="full_name" required placeholder="Enter your full name" />
      <FormInput
        label="College Name"
        id="college_name"
        required
        placeholder="Enter your college name"
      />
      <FormInput label="Branch" id="branch" required placeholder="Enter your branch" />
      <FormSelect
        label="Applied Position Preference"
        id="applied_position_preference"
        required
        options={positionpreferences}
      />
      <FormInput label="PRN Number" id="prn_no" required placeholder="Enter your PRN number" />
      <FormInput
        label="Phone Number"
        id="phone_no"
        type="tel"
        required
        maxLength={10}
        pattern="\\d{10}"
        placeholder="Enter your 10-digit phone number"
      />
      <FormInput
        label="Email ID"
        id="email_id"
        type="email"
        required
        placeholder="Enter your email address"
        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$"
      />
      <FormInput label="Role" id="Role" required placeholder="Enter your Role" />
      <FormInput
        label="Aadhar Card"
        id="aadhar"
        required
        maxLength={12}
        pattern="\\d{12}"
        placeholder="Enter your 12-digit Aadhar number"
      />
      <FormInput
        label="Password"
        id="password"
        type="password"
        required
        placeholder="Enter your password"
      />
      <button type="submit">Sign Up</button>
      <div className="error"></div>
      <div className="success"></div>
    </form>
  );
}

export default SignupForm;
