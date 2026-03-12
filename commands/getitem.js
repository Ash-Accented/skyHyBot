const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

//const hypixel = new Hypixel.Client('')

async function getItemsReturn () {
  fetch("https://api.hypixel.net/v2/resources/skyblock/items")
    .then(response => response.json())
    .then ( data  => {
      //console.log(data);
      console.log(Object.entries(data.items[0]));
      let dataEntries = data.items;
      for (var i = 0; i < dataEntries.length; i++) {
        console.log(`${dataEntries[i].name}`);
        console.log(`${dataEntries[i].material}`);
      } 
    
    })
    .catch(error => {
      console.error("Error fetching item data:", error);
    });
}

async function navigateItems (data) {
  for (let key in data) {
    if(data.hasOwnProperty(key)) {
      console.log(data[key].name);
    }
  }
}

module.exports = {
  data: new SlashCommandBuilder().setName('getitem').setDescription('Return items'),
  async execute(interaction) {
    const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true});
    const pingTime = sent.createdTimestamp - interaction.createdTimestamp;
    getItemsReturn();
  },
};  

