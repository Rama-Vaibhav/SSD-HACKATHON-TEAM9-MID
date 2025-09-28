import React, { useState } from 'react';
import { db } from "../db/db.js";
import { useNavigate } from 'react-router-dom';
import SignupContainer from '../containers/Signup/SignupContainer.jsx';
const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'Student'
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Sign up via Supabase auth
      const { data, error } = await db.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName.trim(),
            role: formData.role,
          }
        }
      });

      if (error) throw error;

      const userId = data.user?.id;

      if (userId) {
        // Insert into user_details table
        const { error: insertError } = await db.from("user_details").insert([
          {
            id: userId,
            name: formData.fullName.trim(),
            email: formData.email.trim(),
            password: formData.password, // ⚠️ hash in production
            role: formData.role
          }
        ]);

        if (insertError) throw insertError;
      }

      alert('Check your email for verification link');
      navigate('/');

    } catch (err) {
      console.error(err);
      alert(err.message || "Error signing up");
    }
  };

  return (
    <SignupContainer
      formData={formData}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};

export default SignUp;
