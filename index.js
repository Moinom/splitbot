require("dotenv").config();
const DISCORD = require("discord.js");
const DISCORD_CLIENT = new DISCORD.Client({
  intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS"],
});
const prefix = "!divide";
// role names can be changed and extended, just note that they are also used for the role colour.
// If you want to use a different colour to the role name, you will need a separate colour array to use it in the createRoles function.
const roleNames = ["Blue", "Red"];
let isActive = {};

DISCORD_CLIENT.on("ready", () => {
  DISCORD_CLIENT.guilds.cache.forEach(
    (serverId) => (isActive[serverId] = false)
  );
  console.log("The great divide has begun.");
});

DISCORD_CLIENT.on("disconnected", function () {
  console.log("Disconnected.");
  process.exit(1);
});

DISCORD_CLIENT.on("guildMemberAdd", (member) => {
  // listens to server joins and divides if division is active
  addRoleToNewJoiner(member);
});

DISCORD_CLIENT.on("messageCreate", async (msg) => {
  // Only runs if prefix is correct and author is server owner
  const serverOwner = await msg.guild.fetchOwner();
  if (!msg.content.startsWith(prefix) || msg.author.id !== serverOwner.id)
    return;
  const message = msg.content.split(" ");
  const command = message[1];
  const server = DISCORD_CLIENT.guilds.resolve(msg.guild.id);

  if (command === "help") {
    // send bot instructions
    msg.channel.send(generateHelpMessage());
    return;
  }

  if (command === "start") {
    // add roles
    msg.channel.send("The great divide has begun...");
    startDivision(server);
    isActive[server] = true;
    msg.channel.send("Division completed. Roles assigned.");
    return;
  }

  if (command === "stop") {
    // remove roles
    resetDivision(server);
    isActive[server] = false;
    msg.channel.send("Division stopped. Roles removed.");
    return;
  }
});
DISCORD_CLIENT.login(process.env.TOKEN);

async function startDivision(server) {
  const memberMap = await server.members
    .fetch({ force: true })
    .catch(console.error);
  const members = shuffle(memberMap.map((member) => member));
  const roles = await createRoles(server);
  await addRolesToMembers(members, roles, server);
}

function resetDivision(server) {
  roleNames.forEach((roleName) => {
    let role = server.roles.cache.find((role) => role.name === roleName);
    if (role) role.delete();
  });
}

async function createRoles(server) {
  const roles = [];
  for (let i in roleNames) {
    const cachedRole = server.roles.cache.find((x) => x.name === roleNames[i]);
    let role = cachedRole
      ? await server.roles
          .fetch(cachedRole.id, { force: true })
          .catch(console.error)
      : null;
    if (!role) {
      // create role if doesn't exist
      role = await server.roles
        .create({
          name: roleNames[i],
          color: roleNames[i].toUpperCase(),
          reason: "Need to divide",
          mentionable: true,
        })
        .catch(console.error);
    }
    roles.push(role);
  }
  return roles;
}

async function addRolesToMembers(members, roles, server) {
  let [smallestRole, diff] = await findSmallestRole(server);
  if (diff < 0) diff = diff * -1;
  let roleCounter = 0;

  for (let i in members) {
    // only add role if member doesn't have one yet
    let hasRole = false;
    roleNames.forEach((roleName) => {
      let role = members[i].roles.cache.find((role) => role.name === roleName);
      if (role) hasRole = true;
    });
    if (hasRole) continue;

    // add to smallest role to balance difference
    // async should avoid rate limit
    if (diff > 0) {
      await members[i].roles.add(smallestRole).catch(console.error);
      diff--;
      continue;
    }
    await members[i].roles.add(roles[roleCounter].id).catch(console.error);
    roleCounter++;
    if (roleCounter === roleNames.length) roleCounter = 0;
  }
}

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}

async function addRoleToNewJoiner(member) {
  const server = DISCORD_CLIENT.guilds.resolve(member.guild.id);
  if (!isActive[server]) return;
  const [smallestRole, diff] = await findSmallestRole(server);
  if (!smallestRole) return;
  member.roles.add(smallestRole).catch(console.error);
}

async function findSmallestRole(server) {
  const allRoles = await server.roles.fetch().catch(console.error);
  let blueRole;
  let redRole;

  allRoles.forEach((role) => {
    if (role.name === "Blue") blueRole = role;
    if (role.name === "Red") redRole = role;
  });
  if (!blueRole || !redRole) return null;
  return [
    blueRole.members.size < redRole.members.size ? blueRole.id : redRole.id,
    blueRole.members.size - redRole.members.size,
  ];
}

function generateHelpMessage() {
  let lightBlue = 3447003;
  return {
    content:
      "You have requested help. I provide you with instructions on how to command the great divide",
    embeds: [
      {
        color: lightBlue,
        title: "General rules",
        description:
          "Only the server owner can command this bot. You command this bot by starting your message with `!divide`. If the bot went offline, you will have to run !divide start again once it's back to have it distribute roles to members who joined during offline time.",
      },
      {
        color: lightBlue,
        title: "Start the great divide",
        description:
          'To start the great divide type `!divide start`. The bot will create the roles "red" and "blue" if they don\'t exist yet and will equally assign all server members to this role.',
      },
      {
        color: lightBlue,
        title: "Stop the great divide",
        description:
          'To stop the great divide type `!divide stop`. The bot will delete the roles "red" and "blue", which will cause all members to loose these roles.',
      },
      {
        color: lightBlue,
        title: "New members",
        description:
          "After `!divide start` was used, the division is active, which means any server members who join later, will be added by the bot to the smallest team. Roles are not rebalanced when a server member leaves. Once the `!divide stop` command was given (removes roles) or the bot went offline (will not remove roles), new members will not receive roles on joining anymore.",
      },
    ],
  };
}
