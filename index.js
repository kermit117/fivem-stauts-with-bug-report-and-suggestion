const Discord = require('discord.js');

const request = require('request'); // npm install request



const bot = new Discord.Client({disableEveryone: false})

const Settings = {
    statusChannel: "", //Server Status Channel ID.
    ServerIP: '', //Server IP.
    ServerPORT: '' // Server PORT.
};


bot.on('ready', async () => {
    console.info("Bot is active! { " + bot.user.username + "#" + bot.user.discriminator + " }");

    bot.user.setActivity("🐌Loading data...");

    async function updateBot()
    {
        let maxclients = null;
        
        request(`http://${Settings.ServerIP}:${Settings.ServerPORT}/info.json`, (err, data, body) =>
        {
            if(!err && data && data.statusCode == 200)
            {
                let mp = JSON.parse(body);
                if(mp && mp.vars && mp.vars.sv_maxClients)
                {
                    maxclients = mp.vars.sv_maxClients;
                }
            }
            if(err)
            {
                bot.guilds.forEach(guild => {
                    let OfflineMsg = "no-info";

                 
                    bot.user.setActivity("🐌(no-data)" + guild.memberCount + ".");

                   
                })
            } 
            if(maxclients != null)
            {
                request(`http://${Settings.ServerIP}:${Settings.ServerPORT}/players.json`, function(error, data, body)
                {
                    bot.guilds.forEach(guild => {
                        let Status = "Status [ON]";
                        let Players = "Players ["+JSON.parse(body).length + "/" + maxclients + "]";
    
                        bot.user.setActivity("🐌(" + JSON.parse(body).length + "/" + maxclients + ")" + guild.memberCount + ".");
                    })
                })
            }
        })
    }
    setInterval(() => {updateBot();}, 7000);
})



async function updateBot()
{
    let maxclients = null;
        
    request(`http://${Settings.ServerIP}:${Settings.ServerPORT}/info.json`, (err, data, body) =>
    {
        if(!err && data && data.statusCode == 200)
        {
            let mp = JSON.parse(body);
            if(mp && mp.vars && mp.vars.sv_maxClients)
            {
                maxclients = mp.vars.sv_maxClients;
            }
        }
        else
        {
            const serverName = "Hunt County RP";
            
            const logoURL = "https://i.imgur.com/SKhPh2S.png";
            var currentdate = new Date(); 
            var datetime = currentdate.getDate() + "/" + (currentdate.getMonth()+1)  + "/" + currentdate.getFullYear() + " "  + currentdate.getHours() + ":"  + currentdate.getMinutes() + ":" + currentdate.getSeconds();            
            const embed = new Discord.RichEmbed()
                .setColor('#ff0000')
                .setTitle(`Your server name  Server Stats\nPlayers [no-info]`)
                .setAuthor("Your server name FiveM", logoURL)
                .setThumbnail(logoURL)
                .setDescription('Server is currently offline.')
                .setFooter(`Powered by kermit#1549 Last Updated:`, logoURL)
                .setTimestamp();
                const msgId = ''; //Bot Message ID.
                bot.channels.get('channel message is in').fetchMessages({around: msgId, limit: 1}).then(msg => {
                    const Msg1 = msg.first();
                    Msg1.edit(embed);
            })
        }
        request(`http://${Settings.ServerIP}:${Settings.ServerPORT}/players.json`, function(error, data, body)
        {
            let players = JSON.parse(body)
            let playeri = new Array
            let playern = new Array
            let discordp = new Array
            for(player of players)
            {
                let playername = player.name
                let playerid = player.id
                let discord = new Array
               
    
                for(let identifiers of player.identifiers)
                {
                    if(identifiers.startsWith("discord:"))
                    {
                        discord.push(identifiers.replace('discord:', ''))
                    }
                }
                playeri.push(`${playerid}`)
                playern.push(`${playername}`)
                discordp.push(`<@${discord}>`)
                
            }
            if(players.length < 1)
            {
                const logoURL = "https://i.imgur.com/SKhPh2S.png";
                var currentdate = new Date(); 
                var datetime = currentdate.getDate() + "/" + (currentdate.getMonth()+1)  + "/" + currentdate.getFullYear() + " "  + currentdate.getHours() + ":"  + currentdate.getMinutes() + ":" + currentdate.getSeconds();            
                const embed5 = new Discord.RichEmbed()
                    .setColor('#030056')
                    .setTitle("server name here Status")
                    .setAuthor("your server name here", logoURL)
                    .setDescription(`${players.length} Players out of ${maxclients} slots.\nThere are currently 0 queue.\nPlayers info\n\nNo players online.`)
                    .setThumbnail(logoURL)
                    .setFooter(`Powered by kermit#1549 Last Updated: `, logoURL)
                    .setTimestamp();
                const msgId = ''; //Bot Message ID.
                    bot.channels.get('channel is').fetchMessages({around: msgId, limit: 1}).then(msg => {
                        const Msg1 = msg.first();
                        Msg1.edit(embed5);
                })
            }
            else
            {
                const serverName = "server name here RP";
               
                const logoURL = "https://i.imgur.com/SKhPh2S.png";
                var currentdate = new Date(); 
                var datetime = currentdate.getDate() + "/" + (currentdate.getMonth()+1)  + "/" + currentdate.getFullYear() + " "  + currentdate.getHours() + ":"  + currentdate.getMinutes() + ":" + currentdate.getSeconds();            
                const embed = new Discord.RichEmbed()
                    .setColor('#00ff00')
                    .setTitle("Hunt County Status")
                    .setAuthor("Hunt County RP", logoURL) //Katan text
                    .setDescription(`${players.length} Players out of ${maxclients} slots.\nThere are currently 0 queue.\nPlayers info`)
                    .setThumbnail(logoURL)
                    .addField("ID", `${playeri.join("\n ")}`, true)
                    .addField("Name", `${playern.join("\n ")}`, true)
                    .addField("Discord", `${discordp.join("\n ")}`, true)
                    .setFooter(`Powered by kermit#1549 Last Updated: `, logoURL)
                    .setTimestamp();
                    const msgId = ''; //Bot Message ID.
                    bot.channels.get('channel id').fetchMessages({around: msgId, limit: 1}).then(msg => {
                        const Msg1 = msg.first();
                        Msg1.edit(embed);
                })
            }
        })
    })
} setInterval(() => {updateBot();}, 15000);




bot.on('message',(message) => {
  if (!message.author.bot) {
    if (message.member) {
      if (message.member.hasPermission('ADMINISTRATOR')) {
        if (message.content.startsWith('+status ')) {
          let status = message.content.substr(7).trim();
          let embed =  new Discord.RichEmbed()
          .setAuthor(message.member.nickname ? message.member.nickname : message.author.tag,message.author.displayAvatarURL)
          .setColor(0x2894C2)
          .setTitle('Updated status message')
          .setTimestamp(new Date());
          if (status === 'clear') {
            STATUS = undefined;
            embed.setDescription('Cleared status message');
          } else {
            STATUS = status;
            embed.setDescription(`New message:\n\`\`\`${STATUS}\`\`\``);
          }
          bot.channels.get(LOG_CHANNEL).send(embed);
          return log(LOG_LEVELS.INFO,`${message.author.username} updated status`);
        }
      }
      if (message.channel.id === 'suggestion channel id') { 
        let embed = new Discord.RichEmbed()
        .setAuthor(message.member.nickname ? message.member.nickname : message.author.tag,message.author.displayAvatarURL)
        .setColor(0x2894C2)
        .setTitle('Suggestion')
        .setDescription(message.content)
        .setTimestamp(new Date());
        message.channel.send(embed).then((message) => {
          const sent = message;
          sent.react('👍').then(() => {
            sent.react('👎').then(() => {
              console.log();
            }).catch(console.error);
          }).catch(console.error);
        }).catch(console.error);
        return message.delete();
      }
      if (message.channel.id === "bug report channel id") {
        let embedUser = new Discord.RichEmbed()
        .setAuthor(message.author.tag,message.author.displayAvatarURL)
        .setColor(0x2894C2)
        .setTitle('Bug Report')
        .setDescription('Your report has been sent to the staff team!')
        .setTimestamp(new Date());
        let embedStaff = new Discord.RichEmbed()
        .setAuthor(message.author.tag,message.author.displayAvatarURL)
        .setColor(0x2894C2)
        .setTitle('New Bug Report')
        .setDescription(message.content)
        .setTimestamp(new Date());
        message.channel.send(embedUser).then(null).catch(console.error);
        bot.channels.get('channel id here').send(embedStaff).then(null).catch(console.error);// (channel id here) where bug reports go
        return message.delete();
      }
    }
  }
});

  

bot.login('token here')
