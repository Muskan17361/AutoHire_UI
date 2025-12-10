import React from 'react';
import { Link } from 'react-router-dom';

export default function JobCard({ job }) {
  return (
    <div style={{ border: '1px solid #ddd', padding: 12, borderRadius:6 }}>
      <h3>{job.title}</h3>
      <p>{job.description?.slice(0, 140)}{job.description?.length > 140 ? '...' : ''}</p>
      <div>Budget: {job.budget ? `₹${job.budget}` : 'Not specified'}</div>
      <div style={{ marginTop: 8 }}>
        <Link to={`/jobs/${job._id}`}>View</Link>
      </div>
    </div>
  );
}

