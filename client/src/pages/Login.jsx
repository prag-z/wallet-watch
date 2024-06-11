import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlusIcon } from '@heroicons/react/24/solid';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        localStorage.setItem('username', username);
        navigate('/dashboard'); 
      } else if (response.status === 401) {
        setErrorMessage('Invalid Credentials, Please Re-Enter.');
      } else {
        throw new Error('Error Logging In');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setErrorMessage('Error Logging In. Please Try Again.');
    }
  };

  return (
    <div className="login">
      <div>
        <h1>
          Wallet<span className="accent">Watch</span>
        </h1>
        <p>
          Take Control of <span className="accent">Your Money</span>
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter Username"
            aria-label="Your Name"
            style={{ marginTop: '1rem' }}
          />
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter Password"
            aria-label="Your Password"
            style={{ marginBottom: '1rem' }}
          />
          {errorMessage && <p>{errorMessage}</p>}
          <a href="/" className="muted" style={{ textDecoration: 'underline' }}>Don't Have An Account? Sign-up Here</a>
          <button type="submit" className="btn btn--dark" style={{ marginTop: '1rem' }}>
            <span>Login</span>
            <UserPlusIcon width={20} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
