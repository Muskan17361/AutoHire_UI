import React, { useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Register(){
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'freelancer' });
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      nav('/dashboard');
    } catch (err) {
      alert(err.response?.data?.msg || 'Error');
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>Register</h2>
      <input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required/>
      <input placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} type="email" required/>
      <input placeholder="Password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} type="password" required/>
      <select value={form.role} onChange={e=>setForm({...form, role:e.target.value})}>
        <option value="freelancer">Freelancer</option>
        <option value="client">Client</option>
      </select>
      <button type="submit">Register</button>
    </form>
  );
}

