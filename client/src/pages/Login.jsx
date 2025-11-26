import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/auth.jsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const nav = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const r = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.message || 'Login failed');
      login(data.token);
      nav('/');
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '40px auto' }}>
      <h2>Log in</h2>
      <form onSubmit={onSubmit}>
        <label>Email<br/>
          <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required />
        </label><br/><br/>
        <label>Password<br/>
          <input value={password} onChange={e=>setPassword(e.target.value)} type="password" required />
        </label><br/><br/>
        <button>Sign in</button>
      </form>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      <p>New here? <Link to="/register">Create an account</Link></p>
    </div>
  );
}
