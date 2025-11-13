const { Client, GatewayIntentBits, Collection } = require('discord.js');
const config = require('./config');
const database = require('./systems/database');
const path = require('path');
const fs = require('fs');

class TicketBot extends Client {
  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildPresences
      ]
    });

    this.config = config;
    this.database = database;
    
    // collections للتخزين
    this.commands = new Collection();
    this.slashCommands = new Collection();
    this.cooldowns = new Collection();
    
    // أنظمة البوت الجديدة
    this.rateLimiter = new (require('./systems/rateLimiter'))();
    this.errorHandler = new (require('./systems/errorHandler'))(this);

    // أنظمة البوت الأساسية
    this.ticketSystem = new (require('./systems/tickets'))(this);
    this.ticketCloser = new (require('./systems/ticketCloser'))(this);
    this.timeoutSystem = new (require('./systems/timeoutSystem'))(this);
    this.adminHelper = new (require('./systems/adminHelper'))(this);

    // ربط الأنظمة
    this.ticketSystem.timeoutSystem = this.timeoutSystem;

    // التحميل التلقائي
    this.loadEvents();
    this.loadCommands();
  }

  // تحميل الأحداث
  loadEvents() {
    const eventsPath = path.join(__dirname, 'events');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
      const filePath = path.join(eventsPath, file);
      const event = require(filePath);
      
      if (event.once) {
        this.once(event.name, (...args) => event.execute(...args, this));
      } else {
        this.on(event.name, (...args) => event.execute(...args, this));
      }
      
      console.log(`✅ تم تحميل event: ${event.name}`);
    }
  }

  // تحميل الأوامر
  loadCommands() {
    const commandsPath = path.join(__dirname, 'commands');
    const commandFolders = fs.readdirSync(commandsPath);

    for (const folder of commandFolders) {
      const folderPath = path.join(commandsPath, folder);
      
      // إذا كان مجلد، تحميل الملفات داخله
      if (fs.statSync(folderPath).isDirectory()) {
        const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
        
        for (const file of commandFiles) {
          const filePath = path.join(folderPath, file);
          const command = require(filePath);
          
          if ('data' in command && 'execute' in command) {
            this.slashCommands.set(command.data.name, command);
            console.log(`✅ تم تحميل command: ${command.data.name}`);
          } else {
            console.log(`❌ أمر ناقص في: ${filePath}`);
          }
        }
      }
    }
  }

  // بدء البوت
  async start() {
    try {
      // إعداد معالجة الأخطاء
      this.errorHandler.setupProcessHandlers();
      
      // الاتصال بقاعدة البيانات
      await this.database.connect();
      
      // تسجيل الدخول
      await this.login(this.config.TOKEN);
      
      console.log(`✅ ${this.user.tag} يعمل الآن!`);
      
      // بدء خدمات الخلفية
      this.startBackgroundServices();
      
    } catch (error) {
      console.error('❌ خطأ في بدء البوت:', error);
      await this.errorHandler.logError(error, { context: 'Bot Startup' });
      process.exit(1);
    }
  }

  // خدمات الخلفية
  startBackgroundServices() {
    // تنظيف ال rate limits كل 5 دقائق
    setInterval(() => {
      this.rateLimiter.cleanup();
    }, 300000);

    // تنظيف المهلات المنتهية كل دقيقة
    setInterval(() => {
      this.timeoutSystem.cleanupExpiredTimeouts();
    }, 60000);

    // تحديث الإحصائيات كل 30 دقيقة
    setInterval(async () => {
      try {
        const serverCount = this.guilds.cache.size;
        const totalMembers = this.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
        
        console.log(`📊 إحصائيات البوت: ${serverCount} سيرفر, ${totalMembers} عضو`);
        
        // تحديث النشاط
        this.user.setActivity({
          name: `${serverCount} سيرفر | /ticket`,
          type: this.config.BOT_SETTINGS.ACTIVITY.type
        });
      } catch (error) {
        console.error('❌ خطأ في تحديث الإحصائيات:', error);
      }
    }, 1800000);

    console.log('✅ تم بدء خدمات الخلفية');
  }
}

// إنشاء وتشغيل البوت
const bot = new TicketBot();
bot.start();

// معالجة الأخطاء غير المتوقعة
process.on('unhandledRejection', (error) => {
  console.error('❌ خطأ غير معالج:', error);
  bot.errorHandler.logError(error, { type: 'unhandledRejection' });
});

process.on('uncaughtException', (error) => {
  console.error('❌ استثناء غير معالج:', error);
  bot.errorHandler.logError(error, { type: 'uncaughtException' });
  process.exit(1);
});