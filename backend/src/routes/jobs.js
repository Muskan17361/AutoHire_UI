const express = require('express');
const Job = require('../models/Job');
const auth = require('../middleware/auth');
const router = express.Router();

// create a job (client)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'client') return res.status(403).json({ msg: 'Only clients can post jobs' });
    const { title, description, budget, skills } = req.body;
    const job = new Job({ title, description, budget, skills, client: req.user._id });
    await job.save();
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// list open jobs with simple filters
router.get('/', async (req, res) => {
  try {
    const q = {};
    if (req.query.status) q.status = req.query.status;
    if (req.query.skill) q.skills = req.query.skill;
    const jobs = await Job.find(q).populate('client', 'name email').sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// get single job
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('client', 'name email');
    if (!job) return res.status(404).json({ msg: 'Job not found' });
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;

