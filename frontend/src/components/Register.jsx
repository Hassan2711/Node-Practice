import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [successMessage, setSuccessMessage] = useState('');

  const { name, email, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
 
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3001/register', formData);
      console.log('Response:', res);  // Log the whole response object
      console.log('Registration successful', res.data);
      setSuccessMessage('Registration successful!');

      setFormData({
        name: '',
        email: '',
        password: '',
      });

    } catch (err) {
      setSuccessMessage('Error');
      console.error('Error:', err.response ? err.response.data : err.message);
    }
  };
  

  return (
    <div>
      <h1>Register</h1>
      {successMessage && <p>{successMessage}</p>}
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Name"
          name="name"
          value={name}
          onChange={onChange}
          required
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={email}
          onChange={onChange}
          required
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={password}
          onChange={onChange}
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
