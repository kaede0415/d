const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const client = new Client({
  partials: ["CHANNEL"],
  intents: new Intents(32767)
});

if (process.env.DISCORD_BOT_TOKEN == undefined) {
  console.error('tokenが設定されていません！')
  process.exit(0)
}

client.on('ready', async () => {
  client.user.setActivity(`メンテナンス`, {
    type: 'PLAYING'
  });
  client.user.setStatus("dnd");
  console.log(`${client.user.tag} is ready!`);
});

client.login(process.env.DISCORD_BOT_TOKEN)