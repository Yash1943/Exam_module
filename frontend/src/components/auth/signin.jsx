import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LOGIN_URL } from "../../api";

function Signin() {
  const [aadharCard, setAadharCard] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ aadhar_card: aadharCard, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess("Login successful!");
        localStorage.setItem("isLoggedIn", "true");
        setTimeout(() => navigate("/home"), 1000); // Redirect after 1s
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Network error");
    }
  };
  return (
    <div className="signin-container">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="aadhar">Aadhar Card</label>
          <input
            type="text"
            id="aadhar"
            value={aadharCard}
            onChange={(e) => setAadharCard(e.target.value)}
            required
            maxLength={12}
            pattern="\d{12}"
            placeholder="Enter your 12-digit Aadhar number"
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </div>
        <button type="submit">Sign In</button>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
      </form>
    </div>
  );
}

export default Signin;
