const express = require('express');
const Message = require('../models/Message');
const auth = require('../middleware/auth');
const router = express.Router();

// send message
router.post('/', auth, async (req, res) => {
  try {
    const { to, text, job } = req.body;
    if (!to || !text) return res.status(400).json({ msg: 'Missing fields' });
    const message = new Message({ from: req.user._id, to, text, job });
    await message.save();
    res.json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// get conversation between two users
router.get('/conversation/:userId', auth, async (req, res) => {
  try {
    const otherId = req.params.userId;
    const messages = await Message.find({
      $or: [
        { from: req.user._id, to: otherId },
        { from: otherId, to: req.user._id }
      ]
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// list conversation partners (simple)
router.get('/conversations', auth, async (req, res) => {
  try {
    // return list of unique user ids that the current user had messages with
    const sent = await Message.find({ from: req.user._id }).distinct('to');
    const received = await Message.find({ to: req.user._id }).distinct('from');
    const partnerIds = Array.from(new Set([...sent, ...received]));
    res.json({ partners: partnerIds });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;

