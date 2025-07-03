import React from "react";

function FormSelect({ label, id, required = false, options }) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <select id={id} required={required}>
        <option value="">Select a position</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.category}
          </option>
        ))}
      </select>
    </div>
  );
}

export default FormSelect;
