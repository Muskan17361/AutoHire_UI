import React, { useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function PostJob(){
  const nav = useNavigate();
  const [form, setForm] = useState({ title:'', description:'', budget:'', skills:'' });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const skills = form.skills.split(',').map(s => s.trim()).filter(Boolean);
      await api.post('/jobs', { title: form.title, description: form.description, skills, budget: Number(form.budget) });
      nav('/dashboard');
    } catch (err) {
      alert(err.response?.data?.msg || 'Error posting job');
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>Post Job</h2>
      <input placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required/>
      <textarea placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} required/>
      <input placeholder="Budget" value={form.budget} onChange={e=>setForm({...form,budget:e.target.value})} />
      <input placeholder="Skills (comma separated)" value={form.skills} onChange={e=>setForm({...form,skills:e.target.value})} />
      <button type="submit">Post</button>
    </form>
  );
}

