const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const moment = require('moment');
const express = require('express');
const app = express();
const fs = require('fs');
const axios = require('axios');
const util = require('util');
const path = require('path');
const client = new Client({
  partials: ["CHANNEL"],
  intents: new Intents(32767)
});
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
process.env.TZ = 'Asia/Tokyo'
let guildId

const commands = {}
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

for(const file of commandFiles){
  const command = require(`./commands/${file}`);
  commands[command.data.name] = command
}

if (process.env.DISCORD_BOT_TOKEN == undefined) {
  console.error('tokenが設定されていません！')
  process.exit(0)
}

client.on('ready', async () => {
  client.user.setActivity(`認証パネル`, {
    type: 'WATCHING'
  });
  const embed = new MessageEmbed()
  .setTitle("起動しました！")
  .setDescription(">>> ```diff\n+ Hello World!　　　　　``````diff\n+ 導入サーバー数:" + client.guilds.cache.size + "\n+ ユーザー数:" + client.users.cache.size + "```" + moment().format("YYYY-MM-DD HH:mm:ss"))
  .setThumbnail(client.user.displayAvatarURL())
  .setColor("RANDOM")
  client.channels.cache.get("1169873093116842095").send({ embeds: [ embed ] })
  const data = []
  for(const commandName in commands){
    data.push(commands[commandName].data)
  }
  await client.application.commands.set(data);
  client.user.setStatus("idle");
  console.log(`${client.user.tag} is ready!`);
  const configData = fs.readFileSync("./config.json", 'utf8');
  const config = JSON.parse(configData);
  config.call_now = false;
  fs.writeFileSync("./config.json", JSON.stringify(config, null, 2));
});

app.get('/callback', (req, res) => {
  try{
    const id = req.query.code || '';
    const guild_id = BigInt("0x" + req.query.state.split("-")[0]).toString()
    const role_id = BigInt("0x" + req.query.state.split("-")[1]).toString()
    if(id === "" || !req.query.state){
      return res.send("<h1>不正:(</h1>");
    }
    const API_ENDPOINT = 'https://discord.com/api/v10';
    const CLIENT_ID = ['1151873947080589312'];
    const CLIENT_SECRET = ['q8pjQ2IId5EOZV-0bEtSeq5q2Sm4n_i4'];
    const REDIRECT_URI = `https://discord-authorization-bot.glitch.me/callback`;
    const data = {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: id,
      redirect_uri: REDIRECT_URI
    };
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    axios.post(`${API_ENDPOINT}/oauth2/token`, new URLSearchParams(data), {
      headers: headers
    })
    .then((response) => {
      const token = response.data.access_token;
      axios.get(`${API_ENDPOINT}/users/@me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(async (response) => {
        const data = response.data;
        const data2 = data.id;
        const data3 = data.username;
        const avatarExt = data.avatar ? (data.avatar.startsWith('a_') ? 'gif' : 'png') : 'png';
        const data4 = data.avatar ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.${avatarExt}` : 'URL_TO_DEFAULT_IMAGE';
        const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>認証成功</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f2f2f2;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
      }
      .container {
        max-width: 800px;
        padding: 30px;
        background-color: #fff;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        border-radius: 10px;
      }
      h1 {
        text-align: center;
        color: #333;
        font-size: 32px;
        margin-bottom: 20px;
      }
      p {
        text-align: center;
        color: #666;
        font-size: 20px;
      }
      img {
        display: block;
        margin: 0 auto;
        border-radius: 50%;
        width: 150px;
        height: 150px;
      }
      #serverButton {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 10px;
        background-color: #007bff;
        color: #fff;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>認証成功！</h1>
      <p>${data3}さん、よろしくお願いします！</p>
      <img src="${data4}" alt="User Avatar">
    </div>
    <button id="serverButton" onclick="openLink()">公式鯖に参加</button>
  </body>
  <script>
  function openLink(){
    location = "https://discord.gg/YFSUDemgPp"
  }
  </script>
</html>
`;
        res.send(html);
        const role = client.guilds.cache.get(guild_id).roles.cache.find(role => role.id === role_id)
        client.guilds.cache.get(guild_id).members.cache.get(data2).roles.add(role)
        const filePath = 'tokens.json';
        fs.readFile(filePath, 'utf8', (err, data) => {
          let flag = false
          const jsonData = JSON.parse(data)
          for(let i=0;i<jsonData.length;i++){
            const entry = jsonData[i];
            if(entry.hasOwnProperty(data2)){
              entry[data2] = token;
              flag = true
            }
          }
          const json = `{ "${data2}": "${token}" }`
          if(flag == false) jsonData.push(JSON.parse(json))
          const updatedData = JSON.stringify(jsonData, null, 2);
          fs.writeFile(filePath, updatedData, 'utf8', (err) => {

          });
        })
      })
      .catch((error) => {
        console.error('ユーザーデータ取得エラー:', error);
        res.send('<h1>ユーザーデータ取得エラー もう一度やり直してください</h1>');
      });
    })
    .catch((error) => {
      console.error('トークン取得エラー:', error);
      res.send('<h1>トークン取得エラー もう一度やり直してください</h1>');
    });
  }catch(error){
    console.error('エラー:', error);
    res.send(`<h1>エラー : ${error}</h1>`);
  }
});

app.get('/home', (req, res) => {
  const filePath = path.join(__dirname, './', 'home.html');
  res.sendFile(filePath);
})

app.listen(3000, () => {
    console.log(`App listening at http://localhost:${3000}`);
});

client.on("interactionCreate", async interaction => {
  if(!interaction.isButton()){
    return;
  }
  if(interaction.customId == "switch"){
    if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ content: "サーバー管理者しか使えません", ephemeral: true })
    let content,color
    const description = interaction.message.embeds[0].description
    if(description == "現在対応可能です") content = "現在対応不可能です", color = "RED"
    else if(description == "現在対応不可能です") content = "現在対応可能です", color = "GREEN"
    const embed = new MessageEmbed()
    .setTitle("対応状況")
    .setDescription(content)
    .setColor(color)
    await interaction.message.edit({ embeds: [ embed ], components: [ newbutton([ { id: "switch", emoji: "🔃" } ]) ] })
    await interaction.deferUpdate()
  }
})


client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }
    const command = commands[interaction.commandName];
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: 'There was an error while executing this command!',
            ephemeral: true,
        })
    }
});

client.on('error', (err) => {
  console.error("error")
})

client.login(process.env.DISCORD_BOT_TOKEN)
