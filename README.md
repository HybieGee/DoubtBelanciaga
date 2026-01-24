# DOUBT vs BELIEVE

An interactive PvP web experience exploring conviction, hesitation, and consequence in crypto markets.

## 🎮 Concept

Players choose between two philosophies every hour:
- **DOUBT** - Bet on price decline (Death/Hell/666 symbolism)
- **BELIEVE** - Bet on price growth (Light/Heaven/Angels)

The market decides the winner. 95% of gas fees go to winners, 5% to marketing.

## 🎨 Visual Style

- Split-screen design (black vs white)
- Sketch-style line art aesthetic
- Hand-drawn, pseudo-3D environments
- Philosophical and symbolic motifs
- Built with react-three-fiber

## 🏗️ Tech Stack

- **Frontend**: React + Vite
- **3D**: Three.js + react-three-fiber
- **Animations**: Framer Motion
- **Wallet**: ethers.js
- **Fingerprinting**: FingerprintJS
- **State**: Zustand
- **Deployment**: Cloudflare Pages

## 🚀 Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 Deployment to Cloudflare Pages

### Option 1: GitHub Integration (Recommended)

1. Push this repository to GitHub
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
3. Navigate to Pages
4. Click "Create a project"
5. Connect to GitHub and select this repository
6. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/`
7. Click "Save and Deploy"

### Option 2: Direct Upload

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Build and deploy
npm run build
wrangler pages deploy dist --project-name=doubt-belanciaga
```

## 🔧 Environment Variables

Create a `.env` file for local development:

```env
VITE_API_URL=https://your-api-endpoint.workers.dev
```

For Cloudflare Pages, add environment variables in the dashboard under Settings > Environment variables.

## 📋 Game Mechanics

### Hourly Rounds
- Each round lasts 60 minutes
- Players choose DOUBT or BELIEVE
- Price is compared at hour boundaries

### Outcome Logic
- Price increases → BELIEVERS win
- Price decreases → DOUBTERS win
- No change → Round void, fees returned

### Economic Model
- Fixed ETH entry fee per round
- 95% to winners (split proportionally)
- 5% to marketing/development
- Provably fair via Chainlink oracles

### Anti-Abuse
- Browser fingerprinting prevents multi-accounting
- Wallet verification required for rewards
- One claim per wallet per round

## 🎯 Features

- ✅ Dramatic split-screen 3D environment
- ✅ Character walking animation
- ✅ Real-time player stats
- ✅ Wallet connection (MetaMask)
- ✅ Countdown timer for rounds
- ✅ Results and reward claiming
- ✅ Comprehensive whitepaper
- ✅ Fingerprint-based user tracking
- ⏳ Backend API (Cloudflare Workers)
- ⏳ Smart contract integration
- ⏳ Chainlink price oracle
- ⏳ Payment processing

## 🔐 Security

- All price data from Chainlink (decentralized oracle)
- Smart contracts open-source and verified
- No hidden fees or manipulation
- Transparent distribution logic
- Public verification of results

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

This is a collaborative project. For questions or contributions:
- Open an issue on GitHub
- Submit a pull request
- Contact: [email protected]

## ⚠️ Disclaimer

This is a game of chance based on market volatility. Only play with funds you can afford to lose. Past performance does not guarantee future results. Not financial advice.

---

Built with conviction. Play with caution. 🎲
