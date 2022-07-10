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
