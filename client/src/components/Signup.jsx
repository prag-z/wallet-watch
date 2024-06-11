import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlusIcon } from '@heroicons/react/24/solid';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const { username } = data;
        localStorage.setItem('username', username); 
        console.log('Signup successful');
        navigate('/dashboard');
      } else {
        const data = await response.json();
        setErrorMessage(data.message); 
      }
    } catch (error) {
      console.error('Error signing up:', error);
      setErrorMessage('Error signing up. Please try again.');
    }
  };

  return (
    <div className="signup">
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
            placeholder="Create Username"
            aria-label="Your Name"
            style={{ marginTop: '1rem' }}
          />
          <input
            type="text"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Create Password"
            aria-label="Your Password"
            style={{ marginBottom: '1rem' }}
          />
          <a href="/login" className="muted" style={{ textDecoration: 'underline' }}>Already Have An Account? Log-in Here</a>
          <button type="submit" className="btn btn--dark" style={{ marginTop: '1rem' }}>
            <span>Create Account</span>
            <UserPlusIcon width={20} />
          </button>
        </form>
        {errorMessage && <p>{errorMessage}</p>}
      </div>
    </div>
  );
}

export default Signup;
