const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const axios = require('axios');
const fs = require('fs');
async function getToken(userId){
  const filePath = 'tokens.json';
  const data = fs.readFileSync(filePath, 'utf8')
  const jsonData = JSON.parse(data)
  for(let i=0;i<jsonData.length;i++){
    const entry = jsonData[i];
    if(entry.hasOwnProperty(userId)){
      return entry[userId]
      break;
    }
  }
  return undefined
}

module.exports = {
  data: {
    name: "request",
    description: "IDを指定して追加",
    options: [
      {
        type: "STRING",
        name: "id",
        description: "追加する人のIDを入力",
        required: true,
      }
    ],
  },
  async execute(interaction) {
    if(require("config.json").call_now == true) return interaction.reply("現在callが行われています")
    const id = interaction.options.getString("id");
    if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ content: "サーバー管理者しか使えません", ephemeral: true })
    await interaction.deferReply({ ephemeral: true })
    const token = await getToken(id)
    if(!token) return interaction.editReply({ content: "トークンが見つかりませんでした" })
    let str
    const head = {
      'Authorization': `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      'Content-Type': 'application/json'
    };
    const data = {
      access_token: token
    };
    axios.put(`https://discord.com/api/guilds/${interaction.guild.id}/members/${id}`, data, {
      headers: head
    })
    .then(async (response) => {
      if(response.status == 201){
        str = "ユーザーの追加に成功しました"
      }else if(response.status == 204){
        str = "ユーザーはすでに追加されています"
      }
      interaction.editReply({ content: str })
    })
    .catch((error) => {
      interaction.editReply({ content: "ユーザーの追加に失敗しました" })
      console.error('更新エラー:', error);
    });
  },
};
