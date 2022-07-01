const DISCORD = require('discord.js');
const DISCORD_CLIENT = new DISCORD.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
const FETCH = require('node-fetch');
const CONFIG = require("./config.json");

const prefix = '!divide';

DISCORD_CLIENT.on('ready', () => {
    console.log('The great divide has begun.')
})

DISCORD_CLIENT.on("disconnected", function () {
	console.log('Division completed.');
	process.exit(1);
});

DISCORD_CLIENT.on('message', msg => {

    // Only runs if prefix is correct (later add admin check)
    if (!msg.content.startsWith(prefix)) return;
    let command = msg.content.split(' ')[1];

    if (command === 'help') {
        // message instructions
        // msg.channel.send()
        return;
    }

    if (command === 'divide') {
        // divide members by roles
        return;
    }
    
})

DISCORD_CLIENT.login(process.env.TOKEN);

