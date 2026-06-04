# Fern Dashboard

Plain HTML/CSS/JS dashboard for FernBot. No build step, no framework.

## Structure

```
fern-dashboard/
├── index.html              ← entry, redirects to home
├── vercel.json             ← routing config
├── pages/
│   ├── home.html
│   ├── about.html
│   ├── profile.html
│   ├── stats.html
│   └── staff.html
├── core/
│   ├── style.css           ← all CSS vars, themes, animations
│   └── sidebar.js          ← sidebar injector + active links + topbar
├── managers/
│   ├── auth.js             ← Discord OAuth, session, staff gating
│   ├── api.js              ← all fetch calls
│   ├── toast.js            ← toast notifications
│   └── keepalive.js        ← countdown timer + ping
└── api/
    ├── callback.js         ← OAuth token exchange
    ├── stats.js            ← public stats
    ├── user.js             ← user profile
    ├── ping.js             ← keep-alive ping
    ├── heat.js             ← staff heat management
    ├── tier.js             ← admin tier management
    └── blacklist.js        ← admin blacklist
```

## Environment Variables (Vercel)

```
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
DISCORD_REDIRECT_URI=https://your-domain.vercel.app/api/callback.js
TURSO_URL=
TURSO_TOKEN=
RENDER_PING_URL=
```

## Deploy

1. Push to GitHub
2. Import repo in Vercel
3. Add environment variables
4. Deploy — done

## Staff Gating

Staff IDs are pulled live from:
`https://raw.githubusercontent.com/supernova0866/FernBot/main/configdata.json`

Admins and moderators are merged into one `staffIds` array.
Admins get extra tools (tier management, blacklist).
Update staff by editing `configdata.json` in the FernBot repo — no dashboard changes needed.
