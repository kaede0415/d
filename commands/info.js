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
    .addField("= 導入鯖数 =",`${client.guilds.cache.size}鯖`)
    .setColor("RANDOM")
    await interaction.reply({ embeds: [ embed ] })
  }
}