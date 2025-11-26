import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const nav = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const r = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.message || 'Registration failed');
      nav('/login');
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '40px auto' }}>
      <h2>Create account</h2>
      <form onSubmit={onSubmit}>
        <label>Email<br/>
          <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required />
        </label><br/><br/>
        <label>Password (min 6 chars)<br/>
          <input value={password} onChange={e=>setPassword(e.target.value)} type="password" required minLength={6} />
        </label><br/><br/>
        <button>Register</button>
      </form>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      <p>Already have an account? <Link to="/login">Log in</Link></p>
    </div>
  );
}
