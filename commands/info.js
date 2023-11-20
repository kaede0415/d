const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const client = new Client({
  partials: ["CHANNEL"],
  intents: new Intents(32767)
});

module.exports = {
  data: {
    name: "info",
    description: "BOTの情報を表示します",
  },
  async execute(interaction) {
    const embed = new MessageEmbed()
    .setTitle("Info:")
    .addField("サーバー数",`${client.guilds.cache.size}`,true)
    .addField("チャンネル数",`${client.channels.cache.size}\n(${text_emoji}:${client.channels.cache.filter(c => c.type == 'GUILD_TEXT').size},${voice_emoji}:${client.channels.cache.filter(c => c.type == 'GUILD_VOICE').size},${stage_emoji}:${client.channels.cache.filter(c => c.type == 'GUILD_NEWS').size},${category_emoji}:${client.channels.cache.filter(c => c.type === 'GUILD_CATEGORY').size})`,true)
    .addField("ユーザー数",`${client.users.cache.size}\n(${member_emoji}:${client.users.cache.filter((u) => !u.bot).size},${bot_emoji}:${client.users.cache.filter((u) => u.bot).size})`,true)
    .addField("開発言語","```fix\nJavaScript```",true)
    .addField("Discord.js ver","```js\nver.13.6.0```",true)
    .addField("Ping",`\`\`\`fix\n${client.ws.ping}ms\`\`\``,true)
    .addField("Botの招待",`[こちら](${config.invite})`,true)
    .addField("サポートサーバー",`[こちら](${config.support})`,true)
    .setColor("RANDOM")
    await interaction.reply({ embeds: [ embed ] })
  }
}

client.login(process.env.DISCORD_BOT_TOKEN)