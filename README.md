# GitHub -> Mattermost Webhook

it does

## how?

env variables:

- MATTERMOST_HOOK_URL: that hook url
- GITHUB_WEBHOOK_SECRET: I would tell you but then I'd have to kill you
- PORT: port, but in all caps

tell github to send push events to `/hook` then there you go

## docker?

yea, `docker pull tjhorner/mattermost-github-webhook:latest`