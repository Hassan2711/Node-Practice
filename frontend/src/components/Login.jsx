import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [userData, setUserData] = useState(null); // State to store user data

  const { email, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3001/login', formData);
      console.log('Login successful', res.data);

      setSuccessMessage('Login successful!');
      
      const token = res.data.authtoken;

      const userRes = await axios.post('http://localhost:3001/getuser', {}, {
        headers: {
          'auth-token': token, 
        }
      });

      setUserData(userRes.data);

      setFormData({
        email: '',
        password: '',
      });

    } catch (err) {
      setSuccessMessage('Login failed');
      console.error('Error:', err.response ? err.response.data : err.message);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {successMessage && <p>{successMessage}</p>}
      <form onSubmit={onSubmit}>
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
        <button type="submit">Login</button>
      </form>

      {userData && (
        <div>
          <h2>User Info</h2>
          <p>Name: {userData.name}</p>
          <p>Email: {userData.email}</p>
        </div>
      )}
    </div>
  );
};

export default Login;
