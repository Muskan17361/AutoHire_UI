const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  budget: { type: Number },
  skills: [String],
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['open','in_progress','completed','closed'], default: 'open' },
  createdAt: { type: Date, default: Date.now },
  proposalsCount: { type: Number, default: 0 }
});

module.exports = mongoose.model('Job', JobSchema);
