import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/auth.jsx';

export default function Chat() {
  const { token, logout } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [current, setCurrent] = useState(null);
  const [input, setInput] = useState('');
  const [model, setModel] = useState('llama3');
  const API = 'http://localhost:5001/api';

  // Helper: authenticated fetch wrapper
  async function authFetch(url, opts = {}) {
    const r = await fetch(url, {
      ...opts,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...(opts.headers || {})
      }
    });
    if (r.status === 401) {
      logout();
      return Promise.reject(new Error('Unauthorized'));
    }
    return r;
  }

  // Load user sessions
  async function loadSessions() {
    try {
      const r = await authFetch(`${API}/chat/sessions`);
      const data = await r.json();
      setSessions(data);
    } catch (e) {
      console.error('Failed to load sessions', e);
    }
  }

  // Create new chat session
  async function createSession() {
    try {
      const r = await authFetch(`${API}/chat/sessions`, {
        method: 'POST',
        body: JSON.stringify({ title: '', model })
      });
      const s = await r.json();
      setSessions([s, ...sessions]);
      setCurrent(s);
    } catch (e) {
      console.error('Failed to create session', e);
    }
  }

  // Send message to AI (Ollama)
  async function sendMessage() {
    if (!input.trim()) return;
    if (!current) await createSession();
    const id = (current || sessions[0])._id;
    try {
      const r = await authFetch(`${API}/chat/sessions/${id}/message`, {
        method: 'POST',
        body: JSON.stringify({ content: input, model })
      });
      const data = await r.json();
      await openSession(id);
      setInput('');
    } catch (e) {
      console.error('Failed to send message', e);
    }
  }

  // Open an existing chat session
  async function openSession(id) {
    try {
      const r = await authFetch(`${API}/chat/sessions/${id}`);
      const s = await r.json();
      setCurrent(s);
    } catch (e) {
      console.error('Failed to open session', e);
    }
  }

  // Delete session
  async function removeSession(id) {
    try {
      await authFetch(`${API}/chat/sessions/${id}`, { method: 'DELETE' });
      setCurrent(null);
      loadSessions();
    } catch (e) {
      console.error('Failed to delete session', e);
    }
  }

  useEffect(() => {
    loadSessions();
  }, []);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', height: 'calc(100vh - 60px)' }}>
      {/* Sidebar */}
      <aside style={{ borderRight: '1px solid #eee', padding: 12, overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Sessions</h3>
          <button
            onClick={logout}
            style={{
              background: '#f55',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              padding: '4px 8px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>

        <button onClick={createSession} style={{ marginTop: 8 }}>New session</button>

        <div style={{ marginTop: 12 }}>
          <label>Model:&nbsp;
            <select value={model} onChange={e => setModel(e.target.value)}>
              <option value="llama3">llama3</option>
              <option value="mistral">mistral</option>
              <option value="phi3">phi3</option>
            </select>
          </label>
        </div>

        <ul style={{ listStyle: 'none', padding: 0, marginTop: 12 }}>
          {sessions.map(s => (
            <li key={s._id} style={{ marginBottom: 8 }}>
              <button
                onClick={() => openSession(s._id)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  background: current && current._id === s._id ? '#eef' : 'white',
                  border: '1px solid #ccc',
                  padding: 4,
                  borderRadius: 4
                }}
              >
                {s.title || 'Untitled session'}
              </button>
              <button
                onClick={() => removeSession(s._id)}
                style={{
                  fontSize: 12,
                  marginLeft: 6,
                  color: '#f55',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Chat Area */}
      <main style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, padding: 16, overflow: 'auto' }}>
          {!current && <p>Select a session or start a new one.</p>}
          {current && current.messages.map((m, idx) => (
            <div
              key={idx}
              style={{
                marginBottom: 12,
                background: m.role === 'assistant' ? '#f8f8f8' : '#e0f7fa',
                padding: 8,
                borderRadius: 6
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{m.role}</div>
              <div style={{ whiteSpace: 'pre-wrap' }}>{m.content}</div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div style={{ padding: 12, borderTop: '1px solid #eee' }}>
          <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              rows={3}
              style={{ width: '80%' }}
              placeholder="Ask your study question..."
            />
            <button style={{ marginLeft: 8 }}>Send</button>
          </form>
        </div>
      </main>
    </div>
  );
}
