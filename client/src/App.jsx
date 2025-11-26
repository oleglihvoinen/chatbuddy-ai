import React from 'react';
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Chat from './pages/Chat.jsx';
import { AuthProvider, useAuth } from './context/auth.jsx';

function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <nav style={{ padding: 10, borderBottom: '1px solid #ddd' }}>
        <Link to="/">ChatBuddy.AI</Link>
      </nav>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/" element={<PrivateRoute><Chat/></PrivateRoute>} />
      </Routes>
    </AuthProvider>
  );
}
