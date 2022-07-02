const DISCORD = require('discord.js');
const DISCORD_CLIENT = new DISCORD.Client({ intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS']});
require('dotenv').config();

const prefix = '!divide';
const roleNames = ['Blue', 'Red'];

DISCORD_CLIENT.on('ready', () => {
    console.log('The great divide has begun.')
    // listen to server joins and divide if division is active
})

DISCORD_CLIENT.on('disconnected', function () {
	console.log('Disconnected.');
	process.exit(1);
});

DISCORD_CLIENT.on('messageCreate', async (msg) => {
    // Only runs if prefix is correct and author is server owner
    const serverOwner = await msg.guild.fetchOwner();
    if (!msg.content.startsWith(prefix) || (msg.author.id !== serverOwner.id)) return;

    const message = msg.content.split(' ');
    const command = message[1];
    const server = DISCORD_CLIENT.guilds.resolve(msg.guild.id);

    if (command === 'help') {
        // message instructions
        // msg.channel.send()
        return;
    }

    if (command === 'start') {
        // add roles
        startDivision(server);
        msg.channel.send('Division started. Roles assigned.')
        return;
    }

    if (command === 'stop') {
        // remove roles
        resetDivision(server);
        msg.channel.send('Division stopped. Roles removed.')
        return;
    }
    
})
DISCORD_CLIENT.login(process.env.TOKEN);

async function startDivision(server) {
    resetDivision(server);
    const memberMap = await server.members.fetch({ force: true }).catch(console.error);
    const members = shuffle(memberMap.map(member => member));
    const roles = await createRoles(server);
    addRolesToAllMembers(members, roles);
}

function resetDivision(server) {
    roleNames.forEach(roleName => {
        let role = server.roles.cache.find(role => role.name === roleName);
        if (role) role.delete();
    })
}

async function createRoles(server) {
    const roles = [];
    for (let i in roleNames) {
        const cachedRole = server.roles.cache.find((x) => x.name === roleNames[i]);
        let role = cachedRole ? await server.roles.fetch(cachedRole.id, { force: true }) : null;
        if (!role) {
            // create role if doesn't exist
            role = await server.roles.create({
                name: roleNames[i],
                color: roleNames[i].toUpperCase(),
                reason: 'Need to divide',
                mentionable: true
            }).catch(console.error)
        }
        roles.push(role);
    }
    return roles;
}

function addRolesToAllMembers(members, roles) {
    let roleCounter = 0;
    for (let i in members) {
        // add role to members
        members[i].roles.add(roles[roleCounter].id).catch(console.error);
        roleCounter++;
        if (roleCounter === roleNames.length) roleCounter = 0;
    }
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}