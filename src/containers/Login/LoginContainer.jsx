import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Login from "../../pages/Login";
import { db } from "../../db/db";

const LoginContainer = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Step 1: login via backend (just auth check)
      const { data } = await axios.post("http://localhost:5000/auth/login", {
        email,
        password,
      });

      console.log("Login response:", data);
      // Step 2: fetch role directly from Supabase user_details
      const { data: userDetails, error } = await db
        .from("user_details")
        .select("*")
        .eq("email", email)
        .single();

      if (error || !userDetails) {
        throw new Error("Role not found in DB");
      }

      // Step 3: store role & navigate
      setUserRole(userDetails.role);
      localStorage.setItem("user_role", userDetails.role);

      setEmail("");
      setPassword("");
    } catch (err) {
      console.error("Error logging in:", err.response?.data || err.message);
    }
  };

  // Navigate after login
  useEffect(() => {
    if (userRole) {
      switch (userRole) {
        case "Professor":
          navigate("/dashboard");
          break;
        case "TA":
          navigate("/ta-dashboard");
          break;
        default:
          navigate("/studentdashboard");
      }
    }
  }, [userRole, navigate]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Login Page</h2>
      <Login
        email={email}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default LoginContainer;
