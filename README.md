# the-great-divide

Discord bot for assigning roles equally to server members.

## create your bot

First create your Discord bot, see more info on the official [Discord.js documentation](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot). Make sure to give it permissions to send messages and manage roles.
Invite the bot to your Discord server ([instructions here](https://discordjs.guide/preparations/adding-your-bot-to-servers.html#bot-invite-links)).

## create a .env file

Add your secret bot token to your .env file like:
TOKEN='verySecretToken123456789'

## adjustments

At the moment there are two roles hardcoded (red and blue), but this can easily be expanded. If you want to use different roles or more roles, you can change the rolenames array or even create roles from custom input. Keep in mind that the role colour is currently based on the role name, so if you choose a role name that is not a supported role colour, you will need a separate role colour array to choose the colour from.

## run your bot

Start the node script with 'node index.js'. If you want the bot to keep assigning newly joined members to the roles, you'll have to host the bot to be always online.

## bot commands

As long as the bot is online, it will add new server members to the role with the least members.

### !divide start

Creates roles for red and blue, if they don't exist yet. Assigns roles equally between server members.

### !divide stop

Deletes the roles, roles will be automatically removed from server members when deleted.

### !divide help

Bot will send a message with an explanation of all commands.
