# Contributing

## Running your own version of Stravanity

There are 2 ways to run your own version of Stravanity:

### Run locally with the production app

```bash
npm install
npm run dev
```

Open `localhost:5173` in your browser

Copy the `access_token` cookie from https://stravanity.vercel.app/ and paste it in your local version to connect to Strava

### Run with your own Strava app + Vercel

Create a [Strava API app](https://www.strava.com/settings/api)

Create an account on [Vercel](https://vercel.app)

Create an `.env` file at the root of the project to set the following environment variables:

```
STRAVA_ACCESS_TOKEN
STRAVA_CLIENT_ID
STRAVA_CLIENT_SECRET
STRAVA_REDIRECT_URI
VITE_HERE_MAPS_API_KEY
VITE_STRAVA_CLIENT_ID
```

The rest is as easy as:

```bash
npm install
vercel dev
```

Open `localhost:3000` in your browser
