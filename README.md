# Maplestory Music Quiz

Code and chill to maplestory music discord bot integration.

## Setup

Create a Discord App and add a Bot User (see [Discord Developers](https://discord.com/developers/docs/intro)). Under `./src`, create a `.config.json` file with the following:
```json
{
    "token": "<REDACTED>",
    "prefix": "!mmq"
}
```
> TODO: Secure the token better

Install the bot via OAuth2 URL to approve Maplestory Music Quiz to a Discord Guild (Server).

## Running the Bot

To develop locally, run the backend application:
```bash
yarn local
```

On your Discord Server, the following commands are available to you:

```
  Listening Option:
    !mmq --listen (-l)		Start listening
    !mmq --skip (-s)		Skip the current song
    !mmq --quit (-q)		Stop listening

  Quiz Options:
  	!mmq --play (-p)		Start Quiz
```
> Discord facing CLI expected to change in the future
> TODO: Quiz not yet complete

