import React, { useState } from "react";
import axios from "axios";
import Login from "../pages/login";

const LoginContainer = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("/api/login", {
        email,
        password,
      });

      // Supabase-style token structure
      const tokenData = {
        user: {
          email: data.user.email,
          user_metadata: {
            full_name: data.user.full_name,
          },
        },
        session: {
          access_token: data.token,
        },
      };

      console.log("Login successful:", tokenData);

      setEmail("");
      setPassword("");
    } catch (err) {
      console.error("Error logging in:", err);
    }
  };

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
