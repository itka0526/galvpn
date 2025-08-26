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
