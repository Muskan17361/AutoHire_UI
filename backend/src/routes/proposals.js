const express = require('express');
const Proposal = require('../models/Proposal');
const Job = require('../models/Job');
const auth = require('../middleware/auth');
const router = express.Router();

// submit proposal (freelancer)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'freelancer') return res.status(403).json({ msg: 'Only freelancers can submit proposals' });

    const { jobId, coverLetter, amount } = req.body;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ msg: 'Job not found' });

    const exists = await Proposal.findOne({ job: jobId, freelancer: req.user._id });
    if (exists) return res.status(400).json({ msg: 'You already submitted a proposal to this job' });

    const proposal = new Proposal({ job: jobId, freelancer: req.user._id, coverLetter, amount });
    await proposal.save();

    job.proposalsCount = (job.proposalsCount || 0) + 1;
    await job.save();

    res.json(proposal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// get proposals for a job (client)
router.get('/job/:jobId', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ msg: 'Job not found' });
    if (job.client.toString() !== req.user._id.toString()) return res.status(403).json({ msg: 'Only job owner can view proposals' });

    const proposals = await Proposal.find({ job: job._id }).populate('freelancer', 'name email skills');
    res.json(proposals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// accept/reject proposal (client)
router.post('/:id/decision', auth, async (req, res) => {
  try {
    const { decision } = req.body; // 'accepted' or 'rejected'
    const proposal = await Proposal.findById(req.params.id).populate('job');
    if (!proposal) return res.status(404).json({ msg: 'Proposal not found' });

    if (proposal.job.client.toString() !== req.user._id.toString()) return res.status(403).json({ msg: 'Only job owner can accept/reject proposals' });

    proposal.status = (decision === 'accepted') ? 'accepted' : 'rejected';
    await proposal.save();

    if (decision === 'accepted') {
      const job = await Job.findById(proposal.job._id);
      job.status = 'in_progress';
      await job.save();
    }
    res.json(proposal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
