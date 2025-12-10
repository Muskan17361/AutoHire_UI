import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { Link } from 'react-router-dom';

export default function Dashboard(){
  const user = JSON.parse(localStorage.getItem('user'));
  const [myJobs, setMyJobs] = useState([]);
  const [myProposals, setMyProposals] = useState([]);

  useEffect(() => {
    // For clients: list their jobs.
    if(user.role === 'client') {
      api.get('/jobs').then(res => {
        const mine = res.data.filter(j => j.client && j.client._id === user.id);
        setMyJobs(mine);
      }).catch(()=>{});
    } else {
      // For freelancers: list proposals they've made
      api.get('/proposals/job').catch(()=>{}); // placeholder - extend in future
    }
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <div>Welcome, {user.name} ({user.role})</div>
      {user.role === 'client' && (
        <div>
          <h3>Your Jobs</h3>
          {myJobs.length === 0 ? <div>No jobs yet</div> : myJobs.map(j => <div key={j._id}><Link to={`/jobs/${j._id}`}>{j.title}</Link></div>)}
        </div>
      )}
      <div style={{ marginTop: 20 }}>
        <Link to="/post-job">Post a Job</Link>
      </div>
    </div>
  );
}

