# Roblox Finder 🎮

A responsive Roblox discovery web app built with Next.js, TypeScript, and Tailwind CSS.

## Features

- Search Roblox experiences, players, catalog items, avatars/players, and groups
- Server-side search route that calls Roblox public APIs
- Game and player thumbnails where available
- Favorites saved in local storage
- Recent searches saved locally
- Dark and light themes
- Responsive mobile and desktop interface
- Direct links to Roblox pages
- Loading, empty, and error states

## Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Roblox public web APIs

## Run locally

Requires Node.js 18.17 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Production

```bash
npm run build
npm start
```

## Deploy

Import this repository into Vercel and deploy using the default Next.js settings. No environment variables are required.

## Notes

- This is an unofficial fan-made project and is not affiliated with Roblox Corporation.
- Roblox APIs may change, throttle requests, or return different results.
- Favorites and recent searches are stored in the current browser/device.
- Search requests are handled by the Next.js API route at `/api/search`.
