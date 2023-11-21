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
    .addField("チャンネル数",`${client.channels.cache.size}\n(<:text:1176315370370498631>:${client.channels.cache.filter(c => c.type == 'GUILD_TEXT').size},<:voice:1176315379451166772>:${client.channels.cache.filter(c => c.type == 'GUILD_VOICE').size},<:stage:1176315388133388358>:${client.channels.cache.filter(c => c.type == 'GUILD_NEWS').size},<:category:1176315353136111617>:${client.channels.cache.filter(c => c.type === 'GUILD_CATEGORY').size})`,true)
    .addField("ユーザー数",`${client.users.cache.size}\n(<:user:1176315397503467590>:${client.users.cache.filter((u) => !u.bot).size},<:bot:1176315406030471208>:${client.users.cache.filter((u) => u.bot).size})`,true)
    .addField("開発言語","```fix\nJavaScript```",true)
    .addField("Discord.js ver","```js\nver.13.16.0```",true)
    .addField("Ping",`\`\`\`fix\n${client.ws.ping}ms\`\`\``,true)
    //.addField("Botの招待",`[こちら](${config.invite})`,true)
    .addField("サポートサーバー",`[こちら](https://discord.gg/YFSUDemgPp)`,true)
    .setColor("RANDOM")
    await interaction.reply({ embeds: [ embed ] })
  }
}

client.login(process.env.DISCORD_BOT_TOKEN)