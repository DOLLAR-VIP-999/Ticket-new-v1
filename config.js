const { config } = require('dotenv');
config();

module.exports = {
  // التوكنات
  TOKEN: process.env.DISCORD_BOT_TOKEN,
  CLIENT_ID: process.env.CLIENT_ID,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/ticketbot',
  
  // إعدادات عامة
  DEFAULT_PREFIX: '$',
  DEVELOPERS: ['YOUR_USER_ID'], // ضع ID الخاص بك هنا
  
  // إعدادات البوت العامة
  BOT_SETTINGS: {
    STATUS: 'online',
    ACTIVITY: {
      name: 'Multi-Server Ticket Bot',
      type: 1 // 0 = Playing, 1 = Streaming, 2 = Listening, 3 = Watching
    }
  },
  
  // الألوان
  COLORS: {
    PRIMARY: '#da2424',
    SUCCESS: '#00ff00',
    WARNING: '#ff9900',
    ERROR: '#ff0000',
    INFO: '#0099ff'
  },
  
  // الروابط الافتراضية
  IMAGES: {
    TICKET_BANNER: 'https://i.thteam.me/0M9azgCUEs.jpg',
    COMPLAINT_BANNER: 'https://i.thteam.me/ZjJBBPJgyl.jpg',
    LINE_IMAGE: 'https://i.thteam.me/XUKGig4Ob7.png',
    BOOST_IMAGE: 'https://i.thteam.me/0M9azgCUEs.jpg'
  },

  // إعدادات الأداء
  PERFORMANCE: {
    RATE_LIMIT: {
      ENABLED: true,
      MAX_COMMANDS: 5,
      TIME_WINDOW: 60000
    },
    SPAM_PROTECTION: {
      ENABLED: true,
      MAX_MESSAGES: 10,
      TIME_FRAME: 5000
    }
  }
};