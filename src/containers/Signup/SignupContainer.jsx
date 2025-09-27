import React from 'react'
import { Link } from 'react-router-dom'

const SignupContainer = ({ formData, handleChange, handleSubmit }) => {
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input 
          placeholder='Fullname'
          name='fullName'
          value={formData.fullName}
          onChange={handleChange}
        />
        <input 
          placeholder='Role'
          name='role'
          value={formData.role}
          onChange={handleChange}
        />
        <input 
          placeholder='Email'
          name='email'
          type="email"
          value={formData.email}
          onChange={handleChange}
        />

        <input 
          placeholder='Password'
          name='password'
          type="password"
          value={formData.password}
          onChange={handleChange}
        />

        <button type='submit'>
          Submit
        </button>
      </form>

      Already have an account? <Link to='/'>Login</Link> 
    </div>
  )
}

export default SignupContainer
