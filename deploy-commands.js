const { REST, Routes } = require('discord.js');
const config = require('./config');
const fs = require('fs');
const path = require('path');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandsPath);

// جمع جميع الأوامر
for (const folder of commandFolders) {
  const folderPath = path.join(commandsPath, folder);
  
  if (fs.statSync(folderPath).isDirectory()) {
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
    
    for (const file of commandFiles) {
      const filePath = path.join(folderPath, file);
      const command = require(filePath);
      
      if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
        console.log(`✅ تم تحميل أمر: ${command.data.name}`);
      } else {
        console.log(`❌ أمر ناقص في: ${filePath}`);
      }
    }
  }
}

// إنشاء REST instance
const rest = new REST().setToken(config.TOKEN);

// نشر الأوامر
(async () => {
  try {
    console.log(`🔄 يتم نشر ${commands.length} أمر (/)`);

    const data = await rest.put(
      Routes.applicationCommands(config.CLIENT_ID),
      { body: commands }
    );

    console.log(`✅ تم نشر ${data.length} أمر (/) بنجاح`);
  } catch (error) {
    console.error('❌ خطأ في نشر الأوامر:', error);
  }
})();