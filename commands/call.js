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
const wait = require('util').promisify(setTimeout);

module.exports = {
  data: {
    name: "call",
    description: "登録されている人を全員追加",
  },
  async execute(interaction) {
    const configPath = './config.json';
    const configData = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(configData);
    if(config.call_now == true) return interaction.reply("現在callが行われています")
    if((!config.admin_list.includes(interaction.user.id) && !config.white_list.includes(interaction.user.id)) || !interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ content: "コマンドの実行権限がありません\n実行権限は[公式鯖](https://discord.gg/YFSUDemgPp)で販売しています。", ephemeral: true })
    config.call_now = true;
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    const json_ = fs.readFileSync("tokens.json", 'utf8')
    const jsonData = JSON.parse(json_)
    const list = jsonData.map(obj => Object.keys(obj)[0])
    const msg = await interaction.reply(`<a:load:959821046498881566>処理中です...`)
    const head = {
      'Authorization': `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      'Content-Type': 'application/json'
    };
    let result = [0,0,0]
    let del_count = 0
    for(let i=0;i<list.length;i++){
      const token = await getToken(list[i])
      const data = {
        access_token: token
      };
      axios.put(`https://discord.com/api/guilds/${interaction.guild.id}/members/${list[i]}`, data, {
        headers: head
      })
      .then(async (response) => {
        if(response.status == 201){
          result[0]++
        }else if(response.status == 204){
          result[1]++
        }
        console.log(`${i}:${response.status}`)
      })
      .catch(err => {
        result[2]++
        if(err.response && err.response.status === 403){
          jsonData.splice(i-del_count, 1);
          del_count++;
        }
        console.log(`${i}:${err.response.status}`)
      })
      await wait(1000)
      if(i == list.length-1){
        fs.writeFileSync("tokens.json", JSON.stringify(jsonData, null, 2), 'utf8');
        const embed = new MessageEmbed()
        .setTitle("Call結果")
        .addField("追加成功",`${result[0]}人`)
        .addField("追加済み",`${result[1]}人`)
        .addField("追加失敗",`${result[2]}人`)
        .setColor("RANDOM")
        await interaction.editReply({ content: "<a:check:959821181719040120>終了", embeds: [ embed ] })
        const configData_ = fs.readFileSync(configPath, 'utf8');
        const config_ = JSON.parse(configData);
        config_.call_now = false;
        fs.writeFileSync(configPath, JSON.stringify(config_, null, 2));
        console.log("終了")
      }
    }
  },
};
