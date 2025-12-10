import React, { useEffect, useState } from 'react';
import api from '../api/api';
import JobCard from '../components/JobCard';
import { Link } from 'react-router-dom';

export default function Home(){
  const [jobs, setJobs] = useState([]);
  useEffect(() => {
    api.get('/jobs').then(res => setJobs(res.data)).catch(err => console.error(err));
  }, []);
  return (
    <div>
      <h1>Open Jobs</h1>
      <div style={{ display:'grid', gap:12 }}>
        {jobs.map(j => <JobCard key={j._id} job={j} />)}
      </div>
      <div style={{ marginTop: 20 }}>
        <Link to="/post-job">Post a Job</Link>
      </div>
    </div>
  );
}

