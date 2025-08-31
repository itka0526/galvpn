# GalVPN

## Description:

Last time I used domains and Vercel to host the frontend of the application but it was unnecessary since everybody would use the telegram version of the application. And also Namecheap's domain subscription is soon ending, and I found out that the first year is dirt cheap but to prolong it you have to pay 3 times more. However, that is not the only reason, I surmised that I do not need a domain name, and its just another layer of complexity to setup this crap.

## Goals:

-   Simple
-   Use Telegram's Mini App feature
    -   Write Github YAML file to compile ReactJS and serve it on Github pages
-   ExpressJS with some Typescript for backend magic and Webhook handling
-   Use SQLite to keep some data with Prisma perhaps (I hate complex SQL queries)
-   Multiple language support RU/MN/EN

## Not to do's:

-   Do not overthink, just use UI libraries. Simpler the better.

## Instructions:

### Setup Github pages to host the HTML files

-   Go to Github
-   Find the repository's 'Settings', and go to 'Pages'
-   Set the 'Source' to 'Github Actions', so we can use the .github/workflows/deploy-client.yml
    (You can modify YML to suit your needs, i.e. I set the 'Action' to run everytime it detects a change, and it can be manually triggered)

### Telegram Bot

-   Go to https://web.telegram.org
-   Search for '@BotFather'
-   Create your bot
-   Go to bot's 'Bot Settings'
-   Go to 'Configure Mini App'
-   Finally, 'Edit Mini App URL'
    -   Production Mode:
        -   Set the URL to https://your-github-username.github.io/app-name
        -   Don't forget to check vite.config.ts (base: 'app-name') and package.json (homepage: '.../app-name') files
    -   Development Mode (Hot-Reload):
        -   This works only on Desktop and Web version of Telegram since iOS and android requires bit more security
        -   Run the ReactJS App using the following command cd app-name/ && npm run dev:https
        -   Set the URL to https://local-ip-addr/app-name, i.e. https://172.20.10.2:5173/galvpn/

### Handle Prisma Changes

```bash
prisma generate
prisma migrate dev
prisma db push
```

### UI

-   For text use gray-200 and gray-300, and for background use gray-600 and gray-800
