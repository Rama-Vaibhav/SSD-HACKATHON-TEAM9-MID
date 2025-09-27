
import React, { useState } from 'react';
import {db} from "../db/db.js";
import { Link, useNavigate } from 'react-router-dom';
import '../containers/Signup/signup.css';

const SignUp = () => {
  let navigate = useNavigate()

  const [formData,setFormData] = useState({
    fullName:'',email:'',password:'', role: 'Student'
  })

 

  function handleChange(event){
    setFormData((prevFormData)=>{
      return{
        ...prevFormData,
        [event.target.name]:event.target.value
      }

    })

  }

  async function handleSubmit(e){
    e.preventDefault()

    try {
      const { data, error } = await db.auth.signUp(
        {
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
              role: formData.role,
            }
          }
        }
      )
      if (error) throw error
      alert('Check your email for verification link')
      navigate('/')

      
    } catch (error) {
      alert(error)
    }
  }




  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <h2>Sign Up</h2>
        <input 
          placeholder='Fullname'
          name='fullName'
          onChange={handleChange}
        />

        <input 
          placeholder='Email'
          name='email'
          onChange={handleChange}
        />

        <input 
          placeholder='Password'
          name='password'
          type="password"
          onChange={handleChange}
        />

        <select
          name='role'
          onChange={handleChange}
        >
          <option value="Student">Student</option>
          <option value="Teacher">Teacher</option>
          <option value="Teaching Assistant">Teaching Assistant</option>
        </select>

        <button type='submit'>
          Submit
        </button>


      </form>
      <p className="login-link">
        Already have an account? <Link to='/'>Login</Link> 
      </p>
    </div>
  )
}

export default SignUp;