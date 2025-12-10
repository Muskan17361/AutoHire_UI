import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <header style={{ padding: 12, borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between' }}>
      <div><Link to="/">AutoHire</Link></div>
      <nav>
        <Link style={{ marginRight: 12 }} to="/">Jobs</Link>
        {user ? (
          <>
            <Link style={{ marginRight: 12 }} to="/dashboard">Dashboard</Link>
            <Link style={{ marginRight: 12 }} to="/messages">Messages</Link>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link style={{ marginRight: 12 }} to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}

