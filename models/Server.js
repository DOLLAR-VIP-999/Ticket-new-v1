const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema({
  guildId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  guildName: String,
  
  // إعدادات التذاكر
  ticketSettings: {
    categoryId: String,
    supportRole: String,
    complaintRole: String,
    rankupRole: String,
    adminRole: String,
    lineRole: String,
    customRoles: [{
      name: String,
      roleId: String,
      permissions: [String],
      ticketTypes: [String]
    }]
  },
  
  // قنوات اللوجات
  logChannels: {
    support: String,
    complaint: String,
    rankup: String,
    welcome: String,
    boost: String,
    voice: String,
    errors: String
  },
  
  // إعدادات الرسائل
  messages: {
    welcomeMessage: String,
    ticketTitle: String,
    ticketDescription: String,
    supportDescription: String,
    complaintDescription: String,
    timeoutMessage: String,
    welcomeEmbed: {
      title: String,
      description: String,
      color: String,
      image: String,
      thumbnail: Boolean
    }
  },
  
  // إعدادات الصور
  images: {
    ticketBanner: String,
    complaintBanner: String,
    lineImage: String,
    welcomeBackground: String
  },
  
  // الإحصائيات
  statistics: {
    totalTickets: { type: Number, default: 0 },
    openedTickets: { type: Number, default: 0 },
    closedTickets: { type: Number, default: 0 },
    totalMembers: { type: Number, default: 0 },
    totalBoosts: { type: Number, default: 0 }
  },
  
  // إعدادات الحماية
  security: {
    autoCloseTimeout: { type: Number, default: 10 },
    maxTicketsPerUser: { type: Number, default: 1 },
    rateLimit: {
      enabled: { type: Boolean, default: true },
      maxCommands: { type: Number, default: 5 },
      timeWindow: { type: Number, default: 60000 }
    },
    spamProtection: {
      enabled: { type: Boolean, default: true },
      maxMessages: { type: Number, default: 10 },
      timeFrame: { type: Number, default: 5000 }
    }
  },
  
  // نظام التقيم
  ratingSystem: {
    enabled: { type: Boolean, default: false },
    ratingChannel: String,
    autoRequest: { type: Boolean, default: true },
    ratingQuestions: [String]
  },
  
  // التواريخ
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// تحديث updatedAt قبل الحفظ
serverSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// إضافة indexes للبحث السريع
serverSchema.index({ guildId: 1 });
serverSchema.index({ 'ticketSettings.categoryId': 1 });
serverSchema.index({ 'logChannels.welcome': 1 });

module.exports = mongoose.model('Server', serverSchema);