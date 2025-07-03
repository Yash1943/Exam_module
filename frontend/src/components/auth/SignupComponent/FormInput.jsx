import React from "react";

function FormInput({ label, id, type = "text", required = false, placeholder, pattern, maxLength, name }) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        name={name || id}
        required={required}
        placeholder={placeholder}
        pattern={pattern}
        maxLength={maxLength}
      />
    </div>
  );
}

export default FormInput;
