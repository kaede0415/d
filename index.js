const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { Pagination } = require("discordjs-button-embed-pagination");
const moment = require('moment');
const Keyv = require('keyv');
const tokens = new Keyv(`sqlite://db.sqlite`, { table: "token" });
const lists = new Keyv(`sqlite://db.sqlite`, { table: "verify_list" });
const express = require('express');
const app = express();
const fs = require('fs');
const axios = require('axios');
const util = require('util');
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
const prefix = "bj"
const cmd_list = []
const admin_list = ["945460382733058109","1138977551650402334"]
const json = require("./command.json")
process.env.TZ = 'Asia/Tokyo'
let guildId
function loopSleep(_loopLimit,_interval, _mainFunc){
  var loopLimit = _loopLimit;
  var interval = _interval;
  var mainFunc = _mainFunc;
  var i = 0;
  var loopFunc = function () {
    var result = mainFunc(i);
    if (result === false) {
      // break機能
      return;
    }
    i = i + 1;
    if (i < loopLimit) {
      setTimeout(loopFunc, interval);
    }
  }
  loopFunc();
}

if (process.env.DISCORD_BOT_TOKEN == undefined) {
  console.error('tokenが設定されていません！')
  process.exit(0)
}

client.on('ready', async () => {
  client.user.setActivity(`${prefix}help`, {
    type: 'PLAYING'
  });
  client.user.setStatus("idle");
  console.log(`${client.user.tag} is ready!`);
});

client.on("messageCreate", async message => {
  const arg = message.content.slice(prefix.length).split(/ +/);
  const command = arg.shift().toLowerCase();
  if(message.author.bot || message.channel.type == "DM" || !message.content.startsWith(prefix)){
    return;
  }
  if(command == "help"){
    const embed = new MessageEmbed()
    .setTitle("HELP")
    .addField(`= ${prefix}help =`,">>> この画面")
    .addField(`= ${prefix}embed =`,">>> 埋め込み生成")
    .addField(`= ${prefix}verify [roleId] ([title] [description]) =`,">>> 認証パネル設置")
    .addField(`= ${prefix}request [userId] =`,">>> idを指定して追加")
    .addField(`= ${prefix}call ([guildId]) =`,">>> 登録されている全員を追加")
    .addField(`= ${prefix}getlist ([guildId]) =`,">>> 登録されている人一覧")
    .addField(`= ${prefix}getdata [userId] =`,">>> ユーザーの情報表示")
    .addField(`= ${prefix}deletedata [userId] =`,">>> ユーザーの情報削除")
    .addField(`= ${prefix}eval [code] =`,">>> コード実行(BOT管理者限定)")
    .addField(`= ${prefix}db [code] =`,">>> db操作(BOT管理者限定)")
    .setColor("RANDOM")
    message.reply({ embeds: [ embed ], allowedMentions: { parse: [] } })
  }
  if(command == "verify"){
    if(!message.member.permissions.has("ADMINISTRATOR")) return message.reply("サーバー管理者しか使えません")
    const roleId = message.content.split(" ")[1]
    if(!roleId || message.guild.roles.cache.get(roleId) == undefined) return message.reply("ロールid情報が正しくありません")
    const title = message.content.split(" ")[2] || "認証パネル"
    const desc = message.content.split(" ")[3] || "左のボタンからリンクを踏んで、右のボタンで認証を完了させてください"
    const embed = new MessageEmbed()
    .setTitle(title)
    .setDescription(desc)
    .setColor("RANDOM")
    message.channel.send({ embeds: [ embed ], components: [ newbutton([ { id: "showLink", label: "リンク取得" }, { id: roleId, label: "認証" } ]) ] })
  }
  if(command.startsWith("embed")){
    const data = message.content.slice(prefix.length+5).trim();
    if(data == ""){
      const embed = new MessageEmbed()
      .setTitle("記述例")
      .setDescription(`bjembed.setTitle("タイトル")\n.setDescription("デスクリプション\\n改行")\n.setColor("RANDOM")\n.addField("フィールド1","内容")\n.addField("フィールド2","インライン",true)\n.addField("フィールド3","インライン",true)\n.setAuthor("上につくやつ",message.author.displayAvatarURL())\n.setFooter("下の文字")\n.setImage(message.author.displayAvatarURL())\n.setThumbnail(message.author.displayAvatarURL())\n.setTimestamp()`)
      .setColor("RANDOM")
      const e = new MessageEmbed()
      .setTitle("タイトル")
      .setDescription("デスクリプション\n改行")
      .setColor("RANDOM")
      .addField("フィールド1","内容")
      .addField("フィールド2","インライン",true)
      .addField("フィールド3","インライン",true)
      .setAuthor("上につくやつ",message.author.displayAvatarURL())
      .setFooter("下の文字")
      .setImage(message.author.displayAvatarURL())
      .setThumbnail(message.author.displayAvatarURL())
      .setTimestamp()
      return message.reply({ embeds: [ embed, e ] })
    }
    console.log(`const embed = new MessageEmbed()\n${data}\nmessage.channel.send({ embeds:[embed] })`)
    eval(`const embed = new MessageEmbed()\n${data}\nmessage.channel.send({ embeds:[embed] })`)
  }
  if(command == "handle"){
    if(!message.member.permissions.has("ADMINISTRATOR")) return message.reply("サーバー管理者しか使えません")
    const embed = new MessageEmbed()
    .setTitle("対応状況")
    .setDescription("現在対応可能です")
    .setColor("GREEN")
    message.channel.send({ embeds: [ embed ], components: [ newbutton([ { id: "switch", emoji: "🔃" } ]) ] })
  }
  if(command == "request"){
    if(!message.member.permissions.has("ADMINISTRATOR")) return message.reply("サーバー管理者しか使えません")
    const id = message.content.split(" ")[1]
    let guild = message.content.split(" ")[2]
    if(!id) return message.reply("userIdが入力されていません")
    if(!guild) guild = message.guild.id
    const list = await lists.get(guild)
    const token = await getToken(id)
    if(!token || !list || !list.includes(id)) return message.reply("トークンが見つかりませんでした")
    let str
    const head = {
      'Authorization': `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      'Content-Type': 'application/json'
    };
    const data = {
      access_token: token
    };
    axios.put(`https://discord.com/api/guilds/${guild}/members/${id}`, data, {
      headers: head
    })
    .then(async (response) => {
      if(response.status == 201){
        str = "ユーザーの追加に成功しました"
      }else if(response.status == 204){
        str = "ユーザーはすでに追加されています"
      }else if(response.status == 403){
        str = "ユーザーの追加に失敗しました"
      }else{
        str = "不明エラーが発生しました"
      }
      message.reply({ content: str, allowedMentins: { parse: [] } })
    })
    .catch((error) => {
      console.error('更新エラー:', error);
    });
  }
  if(command == "prorequest"){
    if(!admin_list.includes(message.author.id)) return message.reply("サーバー管理者しか使えません")
    const id = message.content.split(" ")[1]
    let guild = message.content.split(" ")[2]
    if(!id) return message.reply("userIdが入力されていません")
    if(!guild) guild = message.guild.id
    const token = await getToken(id)
    if(!token) return message.reply("トークンが見つかりませんでした")
    let str
    const head = {
      'Authorization': `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      'Content-Type': 'application/json'
    };
    const data = {
      access_token: token
    };
    axios.put(`https://discord.com/api/guilds/${guild}/members/${id}`, data, {
      headers: head
    })
    .then(async (response) => {
      if(response.status == 201){
        str = "ユーザーの追加に成功しました"
      }else if(response.status == 204){
        str = "ユーザーはすでに追加されています"
      }else if(response.status == 403){
        str = "ユーザーの追加に失敗しました"
      }else{
        str = "不明エラーが発生しました"
      }
      message.reply({ content: str, allowedMentins: { parse: [] } })
    })
    .catch((error) => {
      console.error('更新エラー:', error);
    });
  }
  if(command == "call"){
    if(!message.member.permissions.has("ADMINISTRATOR")) return message.reply("サーバー管理者しか使えません")
    let guild = message.content.slice(prefix.length+5).trim()
    if(guild == "") guild = message.guild.id
    const list = await lists.get(guild)
    const msg = await message.reply(`処理中です...\`\`\`[----------------------------------------] 0/${list.length}\`\`\``)
    const head = {
      'Authorization': `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      'Content-Type': 'application/json'
    };
    let result = [0,0,0]
    var loopLimit = list.length;
    loopSleep(list.length, 2500, async function(i){
      const token = await getToken(list[i])
      const data = {
        access_token: token
      };
      axios.put(`https://discord.com/api/guilds/${guild}/members/${list[i]}`, data, {
        headers: head
      })
      .then(async (response) => {
        if(response.status == 201){
          result[0]++
        }else if(response.status == 204){
          result[1]++
        }
        const length = Math.ceil(((i+1)/list.length)*40)
        const str = `\`\`\`[${("#").repeat(length)}${("-").repeat(40-length)}] ${i+1}/${list.length}\`\`\``
        msg.edit(`処理中です...\n${str}`)
      })
      .catch(err => {
        console.log(err)
        result[2]++
        const length = Math.ceil(((i+1)/list.length)*40)
        const str = `\`\`\`[${("#").repeat(length)}${("-").repeat(40-length)}] ${i+1}/${list.length}\`\`\``
        msg.edit(`処理中です...\n${str}`)
      })
    })
    setTimeout(async function(){
      const embed = new MessageEmbed()
      .setTitle("Call結果")
      .addField("追加成功",`${result[0]}人`)
      .addField("追加済み",`${result[1]}人`)
      .addField("追加失敗",`${result[2]}人`)
      .setColor("RANDOM")
      await message.reply({ embeds: [ embed ] })
    },2500*list.length)
  }
  if(command == "procall"){
    if(!admin_list.includes(message.author.id)) return message.reply("BOT管理者しか使えません")
    let guild = message.content.slice(prefix.length+8).trim()
    if(guild == "") guild = message.guild.id
    const json_ = fs.readFileSync("tokens.json", 'utf8')
    const jsonData = JSON.parse(json_)
    const list = jsonData.map(obj => Object.keys(obj)[0])
    const msg = await message.reply(`処理中です...\`\`\`[----------------------------------------] 0/${list.length}\`\`\``)
    const head = {
      'Authorization': `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      'Content-Type': 'application/json'
    };
    let result = [0,0,0]
    loopSleep(list.length, 2500, async function(i){
      const token = await getToken(list[i])
      const data = {
        access_token: token
      };
      axios.put(`https://discord.com/api/guilds/${guild}/members/${list[i]}`, data, {
        headers: head
      })
      .then(async (response) => {
        if(response.status == 201){
          result[0]++
        }else if(response.status == 204){
          result[1]++
        }
        let length = Math.ceil(((i+1)/list.length)*40)
        if(length > 40) length = 40
        const str = `\`\`\`[${("#").repeat(length)}${("-").repeat(40-length)}] ${i+1}/${list.length}\`\`\``
        msg.edit(`処理中です...\n${str}`)
      })
      .catch(err => {
        console.log(err)
        result[2]++
        const length = Math.ceil(((i+1)/list.length)*40)
        const str = `\`\`\`[${("#").repeat(length)}${("-").repeat(40-length)}] ${i+1}/${list.length}\`\`\``
        msg.edit(`処理中です...\n${str}`)
      })
    })
    setTimeout(async function(){
      const embed = new MessageEmbed()
      .setTitle("Call結果")
      .addField("追加成功",`${result[0]}人`)
      .addField("追加済み",`${result[1]}人`)
      .addField("追加失敗",`${result[2]}人`)
      .setColor("RANDOM")
      await message.reply({ embeds: [ embed ] })
    },2500*list.length)
  }
  if(command == "getdata"){
    if(!message.member.permissions.has("ADMINISTRATOR")) return message.reply("サーバー管理者しか使えません")
    const id = message.content.slice(prefix.length+8).trim()
    if(id == "") return message.reply("userIdが入力されていません")
    const token = await getToken(id)
    if(!token) return message.reply("データが見つかりませんでした")
    const embed = new MessageEmbed()
    .setTitle("データ取得")
    .addField("ユーザーid",id)
    .addField("ユーザー名",client.users.cache.get(id).username)
    .addField("アクセストークン",token)
    .setColor("RANDOM")
    message.reply({ embeds: [ embed ], allowedMentins: { parse: [] } })
  }
  if(command == "deletedata"){
    return message.reply("使用禁止")
    if(!message.member.permissions.has("ADMINISTRATOR")) return message.reply("サーバー管理者しか使えません")
    const id = message.content.slice(prefix.length+8).trim()
    if(id == "") return message.reply("userIdが入力されていません")
    const token = await getToken(id)
    if(!token) return message.reply("データが見つかりませんでした")
    await tokens.delete(id)
    message.reply({ content: `${id}のデータを削除しました`, allowedMentions: { parse: [] } })
  }
  if(command == "getlist"){
    if(!message.member.permissions.has("ADMINISTRATOR")) return message.reply("サーバー管理者しか使えません")
    const array = []
    let guild = message.content.slice(prefix.length+8).trim()
    if(guild == "") guild = message.guild.id
    const list = await lists.get(guild)
    if(!list || !list.length) return message.reply("データが見つかりませんでした")
    for(let i=0;i<list.length;i++){
      array.push(`${list[i]}: ${await getToken(list[i])}`)
    }
    fs.writeFileSync('data.txt', `[Data of ${client.guilds.cache.get(guild).name}] Output: ${array.length}\n${array.join("\n")}`, 'utf-8')
    message.reply({ files: ['data.txt'] })
  }
  if(["eval"].includes(command)){
    if(!admin_list.includes(message.author.id)) return message.reply("BOT管理者しか使えません") 
    var result = message.content.slice(prefix.length+5).trim();
    let evaled = eval(result);
    message.channel.send(evaled)
    message.react("✅")
  }
  if(["db"].includes(command)){
    if(!admin_list.includes(message.author.id)) return message.reply("BOT管理者しか使えません")
    var result = message.content.slice(prefix.length+3).trim();
    let evaled = eval("(async () => {" + result + "})()");
    if(typeof evaled != "string"){
      evaled = util.inspect(evaled);
    }
    message.channel.send("Done.")
    message.react("✅")
  }
  if(command == "test"){
    const key = message.content.split(" ")[1]
    const value = message.content.split(" ")[2]
    const filePath = 'data.json';
    fs.readFile(filePath, 'utf8', (err, data) => {
      let flag = false
      const jsonData = JSON.parse(data)
      for(let i=0;i<jsonData.length;i++){
        const entry = jsonData[i];
        if(entry.hasOwnProperty(key)){
          entry[key] = value;
          flag = true
        }
      }
      const json = `{ "${key}": "${value}" }`
      if(flag == false) jsonData.push(JSON.parse(json))
      const updatedData = JSON.stringify(jsonData, null, 2);
      fs.writeFile(filePath, updatedData, 'utf8', (err) => {
        
      });
    })
  }
})

app.get('/', (req, res) => {
  try{
    const id = req.query.code || '';
    if(id === ""){
      return res.send("<h1>コードがありません</h1>");
    }
    const API_ENDPOINT = 'https://discord.com/api/v10';
    const CLIENT_ID = ['1151873947080589312'];
    const CLIENT_SECRET = ['q8pjQ2IId5EOZV-0bEtSeq5q2Sm4n_i4'];
    const REDIRECT_URI = `https://discord-authorization-bot.glitch.me/`;
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
        res.send(`<h1>登録成功！ ${data3}さんよろしく！</h1>`);
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
        res.send('<h1>ユーザーデータ取得エラー</h1>');
      });
    })
    .catch((error) => {
      console.error('トークン取得エラー:', error);
      res.send('<h1>トークン取得エラー</h1>');
    });
  }catch(error){
    console.error('エラー:', error);
    res.send(`<h1>エラー : ${error}</h1>`);
  }
});

app.listen(3000, () => {
    console.log(`App listening at http://localhost:${3000}`);
});

client.on("interactionCreate", async interaction => {
  if(!interaction.isButton()){
		return;
	}
  if(interaction.customId == "showLink"){
    guildId = interaction.guild.id
    interaction.reply({ content: "​", components: [ newbutton([ { style: "LINK", url: `https://discord.com/api/oauth2/authorize?client_id=1151873947080589312&redirect_uri=https%3A%2F%2Fdiscord-authorization-bot.glitch.me%2F&response_type=code&scope=identify%20guilds.join`, label: "click this" } ]) ], ephemeral: true })
  }else if(interaction.customId == "switch"){
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
  }else if(interaction.guild.roles.cache.get(interaction.customId) != undefined){
    let flag = false
    const filePath = "tokens.json"
    await fs.readFile(filePath, 'utf8', (err, data) => {
      const jsonData = JSON.parse(data);
      for(let i = 0; i < jsonData.length; i++){
        const entry = jsonData[i];
        if(entry.hasOwnProperty(interaction.user.id)){
          flag = true;
          break;
        }
      }
    })
    setTimeout(async function(){
      if(flag == false){
        return interaction.reply({ content: "リンクボタンの認証が終わっていません", ephemeral: true });
      }
      let list = await lists.get(interaction.guild.id);
      if(!list) list = [];
      if(!list.includes(interaction.user.id)) list.push(interaction.user.id);
      await lists.set(interaction.guild.id, list);
      interaction.member.roles.add(interaction.customId);
      interaction.reply({ content: "認証完了！", ephemeral: true });
    },1000)
  }
})

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

client.login(process.env.DISCORD_BOT_TOKEN)
