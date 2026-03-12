
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
//const hypixel = new Hypixel.Client('')
const itemChoices = [];


function formatString(str) {
  return str.replaceAll("_", " ").toLowerCase().replace(/(^|\s)\S/g, match => match.toUpperCase()); //str = str.replace(/(^|\s)\S/g, match => match.toUpperCase()); //match = any NON WHITESPACE CHARACTER that is at the first line || is a whitespace character
}

function deformatString(str){
  return str.replaceAll(" ", "_").toUpperCase();
}

function buildEmbed(itemDetails, interaction) {
  var itemName = formatString(itemDetails.productId);
  interaction.editReply({
    content: `<@${interaction.member.user.id}>`,
    embeds: [new EmbedBuilder()
      .setDescription(`**BAZAAR OVERVIEW: **`)
      .setTitle(`**${itemName}**`)
      .setAuthor({
          name: interaction.member.user.displayName,
          iconURL: interaction.member.user.displayAvatarURL(),
      })
      .addFields({name: `**Sell Price: **`, value: `${Math.trunc(itemDetails.sellPrice)}`, inline: true})
      .addFields({name: `**Sell Volume: **`, value: `${itemDetails.sellVolume}`, inline: true})
      .addFields({name: `**Sell Moving Week: **`, value: `${itemDetails.sellMovingWeek}`, inline: true})
      .addFields({name: `**Sell Orders: **`, value: `${itemDetails.sellOrders}`, inline: true})
      .addFields({name: `**Buy Price: **`, value: `${Math.trunc(itemDetails.buyPrice)}`, inline: true})
      .addFields({name: `**Buy Volume: **`, value: `${itemDetails.buyVolume}`, inline: true})
      .addFields({name: `**Buy Moving Week: **`, value: `${itemDetails.buyMovingWeek}`, inline: true})
      .addFields({name: `**Buy Orders: **`, value: `${itemDetails.buyOrders}`, inline: true}) 
      .setColor(0xcec1e6),
    ],
  });
}


async function getBazaarReturn (itemId, interaction) {
  fetch("https://api.hypixel.net/v2/skyblock/bazaar")
    .then(response => response.json())
    .then ( data  => {
      //console.log(data);
      let dataEntries = data.products;
      var itemDetails = dataEntries[itemId].quick_status;
      console.log(itemDetails);
      buildEmbed(itemDetails, interaction);
    })
    .catch(error => {
      console.error("Error fetching item data:", error);
    });
}


async function autoCompleteList(arrayStrings, interaction, optFocused) {
  if (Array.isArray(arrayStrings)) {
    var itemsFiltered = arrayStrings.filter(choice => choice.startsWith(deformatString(optFocused.value)));
    //var lowerCaseString = optFocused.value.toLowerCase();
    if (itemsFiltered.length > 25) {
      itemsFiltered = itemsFiltered.slice(0, 25);
    }
    
    var mappedVals = itemsFiltered.map((choice) => ({name: formatString(choice), value: choice}));
    interaction.respond(mappedVals);
  }
}



async function listOfItems (interaction, optFocused) {
  var arrayStrings = [];
  fetch("https://api.hypixel.net/v2/skyblock/bazaar")
    .then(response => response.json())
    .then( data => {
      let dataEntries = data.products;
      for (var key in dataEntries) {
        arrayStrings.push(key);
      }
      autoCompleteList(arrayStrings, interaction, optFocused);
    })
    .catch(error => {
      console.error("Error fetching names:", error);
    })
}


module.exports = {
  data: new SlashCommandBuilder()
    .setName('bazaar_prices')
    .setDescription('Return bazaar description')
    .addStringOption((option) => 
      option.setName('item_id')
        .setDescription('item to check on bazaar')
        .setRequired(true)
        .setAutocomplete(true)
    ),
  async autocomplete(interaction) {
    const optFocused = interaction.options.getFocused(true);
    if (optFocused.name == `item_id`) {
      listOfItems(interaction, optFocused);
    }
  },
  async execute(interaction) {
    const sent = await interaction.reply({ content: '*fetching bazaar details...*', fetchReply: true});
    const itemId = interaction.options.getString(`item_id`);
    getBazaarReturn(deformatString(itemId), interaction); 
    
  },

};

