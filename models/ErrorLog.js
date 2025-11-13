const mongoose = require('mongoose');

const errorLogSchema = new mongoose.Schema({
  errorId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  message: String,
  stack: String,
  context: mongoose.Schema.Types.Mixed,
  timestamp: { type: Date, default: Date.now },
  resolved: { type: Boolean, default: false },
  resolvedAt: Date,
  resolvedBy: String
});

// إضافة index للبحث السريع
errorLogSchema.index({ errorId: 1 });
errorLogSchema.index({ timestamp: 1 });
errorLogSchema.index({ resolved: 1 });

module.exports = mongoose.model('ErrorLog', errorLogSchema);