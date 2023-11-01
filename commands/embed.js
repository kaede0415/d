const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const client = new Client({
  partials: ["CHANNEL"],
  intents: new Intents(32767)
});

module.exports = {
  data: {
    name: "embed",
    description: "埋め込み生成",
    options: [
      {
        type: "STRING",
        name: "title",
        description: "タイトル",
      },
      {
        type: "STRING",
        name: "title_url",
        description: "タイトル(URL)",
      },
      {
        type: "STRING",
        name: "description",
        description: "デスクリプション",
      },
      {
        type: "STRING",
        name: "author_name",
        description: "アーサー",
      },
      {
        type: "STRING",
        name: "author_name_url",
        description: "アーサー(URL)",
      },
      {
        type: "ATTACHMENT",
        name: "author_icon",
        description: "アーサー(icon)",
      },
      {
        type: "STRING",
        name: "footer_text",
        description: "フーター",
       },
      {
        type: "ATTACHMENT",
        name: "footer_icon",
        description: "フーター(icon)",
      },
      {
        type: "STRING",
        name: "color",
        description: "色",
      },
      {
        type: "ATTACHMENT",
        name: "image",
        description: "画像",
      },
      {
        type: "ATTACHMENT",
        name: "thumbnail",
        description: "サムネイル",
      },
      {
        type: "BOOLEAN",
        name: "timestamp",
        description: "タイムスタンプ",
      },
      {
        type: "STRING",
        name: "field_title_1",
        description: "フィールドタイトル(1)",
      },
      {
        type: "STRING",
        name: "field_value_1",
        description: "フィールドバリュー(1)",
      },
      {
        type: "BOOLEAN",
        name: "field_inline_1",
        description: "フィールドインライン(1)",
      },
      {
        type: "STRING",
        name: "field_title_2",
        description: "フィールドタイトル(2)",
      },
      {
        type: "STRING",
        name: "field_value_2",
        description: "フィールドバリュー(2)",
      },
      {
        type: "BOOLEAN",
        name: "field_inline_2",
        description: "フィールドインライン(2)",
      },
      {
        type: "STRING",
        name: "field_title_3",
        description: "フィールドタイトル(3)",
      },
      {
        type: "STRING",
        name: "field_value_3",
        description: "フィールドバリュー(3)",
      },
      {
        type: "BOOLEAN",
        name: "field_inline_3",
        description: "フィールドインライン(3)",
      },
      {
        type: "STRING",
        name: "field_title_4",
        description: "フィールドタイトル(4)",
      },
      {
        type: "STRING",
        name: "field_value_4",
        description: "フィールドバリュー(4)",
      },
      {
        type: "BOOLEAN",
        name: "field_inline_4",
        description: "フィールドインライン(4)",
      }
    ],
  },
  async execute(interaction) {
    const embed = new MessageEmbed();
    const title = interaction.options.getString("title");
    const title_url = interaction.options.getString("title_url");
    const description = interaction.options.getString("description");
    const author_name = interaction.options.getString("author_name");
    const author_name_url = interaction.options.getString("author_name_url");
    const author_icon = interaction.options.getAttachment("author_icon");
    const footer_text = interaction.options.getString("footer_text");
    const footer_icon = interaction.options.getAttachment("footer_icon");
    const image = interaction.options.getAttachment("image");
    const thumbnail = interaction.options.getAttachment("thumbnail");
    const timestamp = interaction.options.getBoolean("timestamp");
    const color = interaction.options.getString("color");
    const field_title_1 = interaction.options.getString("field_title_1");
    const field_value_1 = interaction.options.getString("field_value_1");
    const field_inline_1 = interaction.options.getBoolean("field_inline_1");
    const field_title_2 = interaction.options.getString("field_title_2");
    const field_value_2 = interaction.options.getString("field_value_2");
    const field_inline_2 = interaction.options.getBoolean("field_inline_2");
    const field_title_3 = interaction.options.getString("field_title_3");
    const field_value_3 = interaction.options.getString("field_value_3");
    const field_inline_3 = interaction.options.getBoolean("field_inline_3");
    const field_title_4 = interaction.options.getString("field_title_4");
    const field_value_4 = interaction.options.getString("field_value_4");
    const field_inline_4 = interaction.options.getBoolean("field_inline_4");
    if(title){
      embed.setTitle(title);
    }
    if(title_url){
      embed.setURL(title_url);
    }
    if(description){
      embed.setDescription(description);
    }
    if(author_name){
      embed.setAuthor(author_name, author_icon.url, author_name_url);
    }
    if(footer_text){
      embed.setFooter(footer_text, footer_icon.url);
    }
    if(image){
      embed.setImage(image.url);
    }
    if(thumbnail){
      embed.setThumbnail(thumbnail.url);
    }
    if(timestamp){
      embed.setTimestamp();
    }
    if(color){
      embed.setColor(color.toUpperCase());
    }
    if(field_title_1 && field_value_1){
      embed.addField(field_title_1, field_value_1, field_inline_1);
    }
    if(field_title_2 && field_value_2){
      embed.addField(field_title_2, field_value_2, field_inline_2);
    }
    if(field_title_3 && field_value_3){
      embed.addField(field_title_3, field_value_3, field_inline_3);
    }
    if(field_title_4 && field_value_4){
      embed.addField(field_title_4, field_value_4, field_inline_4);
    }
    interaction.reply({ embeds: [embed] })
    .catch(err => {
      interaction.reply({ content: "不適な情報", ephemeral: true })
    })
  },
};
