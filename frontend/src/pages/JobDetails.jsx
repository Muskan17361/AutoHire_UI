import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useParams } from 'react-router-dom';

export default function JobDetails(){
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [proposal, setProposal] = useState({ coverLetter:'', amount:'' });
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    api.get(`/jobs/${id}`).then(res => setJob(res.data)).catch(err => console.error(err));
  }, [id]);

  const submitProposal = async (e) => {
    e.preventDefault();
    try {
      await api.post('/proposals', { jobId: id, coverLetter: proposal.coverLetter, amount: Number(proposal.amount) });
      alert('Proposal submitted');
    } catch (err) {
      alert(err.response?.data?.msg || 'Error');
    }
  };

  const fetchProposalsAsClient = async () => {
    try {
      const res = await api.get(`/proposals/job/${id}`);
      alert(`Found ${res.data.length} proposals (open console to inspect).`);
      console.log(res.data);
    } catch (err) {
      alert(err.response?.data?.msg || 'Could not fetch proposals');
    }
  };

  if (!job) return <div>Loading...</div>;

  return (
    <div>
      <h2>{job.title}</h2>
      <div>{job.description}</div>
      <div>Budget: {job.budget}</div>
      <div>Client: {job.client?.name}</div>

      {user.role === 'freelancer' && (
        <>
          <h3>Submit a proposal</h3>
          <form onSubmit={submitProposal}>
            <textarea value={proposal.coverLetter} onChange={e=>setProposal({...proposal, coverLetter:e.target.value})} placeholder="Cover letter" required/>
            <input value={proposal.amount} onChange={e=>setProposal({...proposal, amount:e.target.value})} placeholder="Amount" type="number" />
            <button type="submit">Send Proposal</button>
          </form>
        </>
      )}

      {user.role === 'client' && user.id === job.client?._id && (
        <>
          <h3>Your actions</h3>
          <button onClick={fetchProposalsAsClient}>View proposals for this job</button>
        </>
      )}
    </div>
  );
}

