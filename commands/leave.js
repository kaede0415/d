const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const fs = require('fs');
const client = new Client({
  partials: ["CHANNEL"],
  intents: new Intents(32767)
});

module.exports = {
  data: {
    name: "leave",
    description: "サーバーからBOTを退出させます",
    options: [
      {
        type: "STRING",
        name: "id",
        description: "退出するサーバーのIDを入力",
        required: true,
      }
    ],
  },
  async execute(interaction) {
    const configData = fs.readFileSync("config.json", 'utf8');
    const config = JSON.parse(configData);
    const admin = config.admin_list
    if(!admin.includes(interaction.user.id)) return interaction.reply({ content: "BOT管理者しか使えません", ephemeral: true })
    const guild = client.guilds.cache.get(interaction.options.getString("id"))
    if(!guild) return interaction.reply({ content: "サーバーの取得に失敗しました", ephemeral: true })
    const embed = new MessageEmbed()
    .setTitle("サーバー情報:")
    .addField("サーバー名:",`>>> ${guild.name}`)
    .addField("サーバーID:",`>>> ${guild.id}`)
    .addField("オーナー:",`>>> ${client.users.cache.get(guild.ownerId).username}/${client.users.cache.get(guild.ownerId).toString()}/${guild.ownerId}`)
    .addThumbnail(guild.iconURL())
    .setColor("RANDOM")
    interaction.reply({ embeds: [ embed ], ephemeral: true })
  },
};

client.login(process.env.DISCORD_BOT_TOKEN)

