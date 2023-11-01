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
    name: "handle",
    description: "対応状況パネルを設置",
  },
  async execute(interaction) {
    if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ content: "サーバー管理者しか使えません", ephemeral: true })
    const embed = new MessageEmbed()
    .setTitle("対応状況")
    .setDescription("現在対応可能です")
    .setColor("GREEN")
    interaction.reply({ embeds: [ embed ], components: [ newbutton([ { id: "switch", emoji: "🔃" } ]) ] })
  },
};
