import React, { useEffect } from "react";
import { SIGNUP_URL } from "../../api";
import SignupForm from "./SignupComponent/SignupForm";

function Signup() {
  const [positionpreferences, setpositionpreferences] = React.useState([]);
  useEffect(() => {
    const fetchpostionPreferences = async () => {
      try {
        const response = await fetch(SIGNUP_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          setpositionpreferences(data.data);
        } else {
          throw new Error("Network response was not ok");
        }
      } catch (error) {
        console.error("Error fetching position preferences:", error);
      }
    };
    fetchpostionPreferences();
  }, []);

  const handlesignup = async (e) => {
    e.preventDefault();
    const full_name = document.getElementById("full_name").value;
    const college_name = document.getElementById("college_name").value;
    const branch = document.getElementById("branch").value;
    const applied_position_preference = document.getElementById(
      "applied_position_preference"
    ).value;
    const prn_no = document.getElementById("prn_no").value;
    const phone_no = document.getElementById("phone_no").value;
    const email_id = document.getElementById("email_id").value;
    const Role = document.getElementById("Role").value;
    const aadhar = document.getElementById("aadhar").value;
    const password = document.getElementById("password").value;
    const data = {
      full_name,
      college_name,
      branch,
      applied_position_preference,
      prn_no,
      phone_no,
      email_id,
      Role,
      aadhar_card_no: aadhar,
      password,
    };
    try {
      const response = await fetch(SIGNUP_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      } else {
        const result = await response.json();
        if (result.success) {
          console.log("Signup successful:", result.message);
          // Optionally, redirect or show a success message
          document.querySelector(".success").textContent = "Signup successful!";
        } else {
          console.error("Signup failed:", result.message);
          document.querySelector(".error").textContent = result.message;
        }
      }
    } catch (error) {
      console.error("Error submitting signup data:", error);
      // Handle error appropriately, e.g., show an error message to the user
      return;
    }
    console.log("Submitting signup data:", data);
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <SignupForm positionpreferences={positionpreferences} handlesignup={handlesignup} />
    </div>
  );
}

export default Signup;
