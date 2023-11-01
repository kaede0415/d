const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const newbutton = (buttondata) => {
  return {
    components: buttondata.map((data) => {
      return {
        custom_id: data.id,
        label: data.label,
        style: data.style || 1,
        url: data.url,
        emoji: data.emoji,
        disabled: data.disabled,
        type: 2,
      };
    }),
    type: 1,
  };
};

module.exports = {
  data: {
    name: "verify",
    description: "認証パネルを設置",
    options: [
      {
        type: "ROLE",
        name: "ロール",
        description: "付与するロールを指定",
        required: true,
      },
      {
        type: "STRING",
        name: "タイトル",
        description: "パネルのタイトル",
      },
      {
        type: "STRING",
        name: "概要",
        description: "パネルの概要",
      }
    ],
  },
  async execute(interaction) {
    if(require("config.json").call_now == true) return interaction.reply("現在callが行われています")
    if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ content: "サーバー管理者しか使えません", ephemeral: true })
    const role = interaction.options.getRole("ロール");
    let title = interaction.options.getString("タイトル"),
        description = interaction.options.getString("概要")
    if(title == null) title = "認証パネル"
    if(description == null) description = "下のボタンを押して認証してください"
    const embed = new MessageEmbed()
    .setTitle(title)
    .setDescription(description)
    .setColor("RANDOM")
    interaction.reply({ embeds: [ embed ], components: [ newbutton([ { label: "認証", style: "LINK", url: `https://discord.com/api/oauth2/authorize?client_id=1151873947080589312&redirect_uri=https%3A%2F%2Fdiscord-authorization-bot.glitch.me%2Fcallback&response_type=code&scope=identify%20guilds.join&state=${BigInt(interaction.guild.id).toString(16).toUpperCase()}-${BigInt(role.id).toString(16).toUpperCase()}` } ]) ] })
  },
};
