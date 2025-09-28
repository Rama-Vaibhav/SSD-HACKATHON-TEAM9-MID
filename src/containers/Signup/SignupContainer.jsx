import React from 'react';
import { Link } from 'react-router-dom';
import './Signup.css';

const SignupContainer = ({ formData, handleChange, handleSubmit }) => {
  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <h2>Sign Up</h2>

        <input
          placeholder='Full Name'
          name='fullName'
          value={formData.fullName}
          onChange={handleChange}
          required
        />

        <input
          placeholder='Email'
          type="email"
          name='email'
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          placeholder='Password'
          type="password"
          name='password'
          value={formData.password}
          onChange={handleChange}
          required
        />

        <select
          name='role'
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="Professor">Professor</option>
          <option value="TA">TA</option>
          <option value="Student">Student</option>
        </select>

        <button type='submit'>Submit</button>
      </form>

      <p className="login-link">
        Already have an account? <Link to='/'>Login</Link>
      </p>
    </div>
  );
};

export default SignupContainer;
