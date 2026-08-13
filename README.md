# bot.teerzo.com

React dashboard for [teerzobot](https://github.com/teerzo/teerzobot). It shows bot status and lets you manage custom Twitch chat commands.

## Setup

```bash
npm install
```

Copy `.env.example` to `.env`. Leave `VITE_API_URL` empty for local development so Vite proxies `/api` and `/health` to the bot on port 3000.

In production, set `VITE_API_URL` to the API origin.

## Run locally

Start the bot first (from the teerzobot repo):

```bash
npm run dev
```

The API listens on **http://localhost:3000**. Set `FRONTEND_ORIGIN=http://localhost:5173` in the bot `.env` if you point the UI at the API directly.

Then start this app:

```bash
npm run dev
```

The UI is at **http://localhost:5173**.

## Deploy

Pushes to `main` build the Vite app and sync `dist/` to S3, then invalidate CloudFront — same pattern as [teerzo.com](https://github.com/teerzo/teerzo.com).

Create a GitHub **prod** environment on this repo and add these secrets:

| Secret | Purpose |
| --- | --- |
| `AWS_ACCESS_KEY_ID` | Deploy IAM user |
| `AWS_SECRET_ACCESS_KEY` | Deploy IAM user |
| `S3_BUCKET` | Target bucket name |
| `S3_BUCKET_REGION` | Bucket region |
| `CLOUDFRONT_DISTRIBUTION_ID` | Distribution to invalidate |
| `VITE_API_URL` | Bot API origin, baked in at build time |

On the bot, set `FRONTEND_ORIGIN` to `https://bot.teerzo.com`.
