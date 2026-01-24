# DOUBT vs BELIEVE - Project Overview

## 🎯 What Was Built

A complete interactive web experience for a memecoin PvP game where users choose between DOUBT (betting on price decline) or BELIEVE (betting on price growth) every hour. The market decides winners, and 95% of gas fees are distributed to them.

---

## 📁 Project Structure

```
DoubtBelanciaga/
├── src/
│   ├── components/
│   │   ├── 3D/                        # Three.js 3D components
│   │   │   ├── BelieveSide.jsx        # White side environment (angels, light)
│   │   │   ├── Character.jsx          # Player character with walking animation
│   │   │   ├── DoubtSide.jsx          # Black side environment (666, darkness)
│   │   │   └── SplitEnvironment.jsx   # Combined split-screen environment
│   │   ├── UI/                        # User interface components
│   │   │   ├── ChoicePrompt.jsx       # "Pick a Faith" choice screen
│   │   │   ├── GameStats.jsx          # Live game statistics
│   │   │   ├── Results.jsx            # Round results and reward claiming
│   │   │   ├── Timer.jsx              # Countdown timer to next round
│   │   │   ├── UI.jsx                 # Main UI coordinator
│   │   │   ├── WalletButton.jsx       # MetaMask wallet connection
│   │   │   └── Whitepaper.jsx         # Comprehensive game documentation
│   │   ├── LoadingScreen.jsx          # Dramatic split-screen loading animation
│   │   ├── MainExperience.jsx         # Main app container
│   │   └── Scene.jsx                  # Three.js scene setup
│   ├── store/
│   │   └── gameStore.js               # Zustand state management
│   ├── utils/
│   │   ├── fingerprint.js             # Browser fingerprinting for user ID
│   │   └── wallet.js                  # Wallet connection utilities
│   ├── api/
│   │   └── game.js                    # API endpoints for game logic
│   ├── App.jsx                        # Main app component
│   ├── main.jsx                       # React entry point
│   └── index.css                      # Global styles
├── index.html                         # HTML template
├── package.json                       # Dependencies and scripts
├── vite.config.js                     # Vite build configuration
├── README.md                          # Project documentation
├── DEPLOYMENT.md                      # Cloudflare deployment guide
└── .env.example                       # Environment variable template
```

---

## 🎨 Visual Design

### Split-Screen Aesthetic
- **Left Side (DOUBT)**: Black background with white line art
- **Right Side (BELIEVE)**: White background with black line art
- **Art Style**: Hand-drawn, sketch-style 3D using wireframes
- **Inspiration**: https://github.com/HybieGee/TLS

### DOUBT Side Symbolism
- Devil horns (cone geometry with wireframe)
- 666 symbols
- Cracks and chains
- Dark, sharp geometry
- Theme: Death, Hell, Fear, Cynicism

### BELIEVE Side Symbolism
- Angel wings (line art)
- Rotating halo (torus geometry)
- Light rays
- Cross symbol
- Theme: Heaven, Light, Faith, Conviction

### Character Design
- Wireframe humanoid figure
- Idle breathing animation
- Smooth walking animation between sides
- Camera follows player choice

---

## 🎮 Game Flow

1. **Loading Screen**
   - Dramatic split-screen title animation
   - Typewriter effect for "DOUBT vs BELIEVE"
   - Fingerprint initialization in background

2. **Choice Phase**
   - Character stands at center
   - Large prompt: "PICK A FAITH"
   - Two glowing buttons: DOUBT vs BELIEVE
   - Player selects their conviction

3. **Walking Phase**
   - Character walks toward chosen side
   - Camera smoothly follows
   - 3-second animation with bob motion
   - Character rotates to face direction

4. **Waiting Phase**
   - Live statistics display:
     - DOUBT count vs BELIEVE count
     - Distribution bar (red vs green)
     - Total pool amount (ETH)
     - Current price change percentage
   - Countdown timer to next hour
   - Real-time updates every 5 seconds

5. **Results Phase**
   - Winner announcement (VICTORY or DEFEAT)
   - Price change display
   - Reward amount (if won)
   - Claim button (requires wallet)
   - Play again option

---

## ⚙️ Technical Architecture

### Frontend Stack
- **React 18**: Component framework
- **Vite**: Build tool and dev server
- **Three.js**: 3D rendering engine
- **react-three-fiber**: React renderer for Three.js
- **@react-three/drei**: Three.js helpers
- **Framer Motion**: UI animations
- **Zustand**: State management (lightweight)
- **ethers.js v6**: Ethereum wallet interaction
- **FingerprintJS**: Browser fingerprinting

### State Management (Zustand)
```javascript
{
  fingerprint: string,          // Unique user ID
  walletAddress: string,         // Connected wallet
  gamePhase: string,             // 'choosing' | 'walking' | 'waiting' | 'results'
  userChoice: string,            // 'doubt' | 'believe'
  currentRound: number,          // Round number
  doubtCount: number,            // Players who chose DOUBT
  believeCount: number,          // Players who chose BELIEVE
  totalPool: number,             // Total ETH in pool
  currentPrice: number,          // Current token price
  priceChange: number,           // % change from last hour
}
```

### Key Features Implemented

✅ **3D Environment**
- Split-screen design with perfect vertical division
- Sketch-style wireframe aesthetics
- Animated environments with ambient motion
- Optimized for performance

✅ **Character System**
- Wireframe humanoid design
- Idle breathing animation
- Walking animation with rotation
- Camera tracking

✅ **UI System**
- Choice prompt with hover effects
- Real-time countdown timer (circular progress)
- Live player statistics
- Wallet connection integration
- Results screen with claim functionality
- Modal whitepaper

✅ **User Identification**
- Browser fingerprinting (FingerprintJS)
- IP + device signature
- Fallback ID generation
- No registration required to play

✅ **Wallet Integration**
- MetaMask connection
- Address display (truncated)
- Required only for claiming rewards
- ethers.js v6 provider

✅ **Whitepaper**
- Comprehensive game documentation
- Transparent economic model
- Security and fairness explanation
- Risk disclosure

---

## 🔌 Backend Requirements (Not Yet Implemented)

The frontend is complete and ready. You'll need to build:

### 1. Cloudflare Workers API
Create endpoints:
- `POST /api/choice` - Submit user choice
- `GET /api/stats` - Get current round stats
- `POST /api/claim` - Claim reward
- `GET /api/price` - Get price data

### 2. Cloudflare D1 Database
Tables needed:
```sql
-- Users table
CREATE TABLE users (
  fingerprint TEXT PRIMARY KEY,
  wallet_address TEXT,
  created_at INTEGER
);

-- Rounds table
CREATE TABLE rounds (
  round_id INTEGER PRIMARY KEY,
  start_time INTEGER,
  end_time INTEGER,
  starting_price REAL,
  ending_price REAL,
  price_change REAL,
  total_pool REAL,
  doubt_count INTEGER,
  believe_count INTEGER
);

-- Choices table
CREATE TABLE choices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fingerprint TEXT,
  round_id INTEGER,
  choice TEXT, -- 'doubt' or 'believe'
  timestamp INTEGER,
  FOREIGN KEY (fingerprint) REFERENCES users(fingerprint),
  FOREIGN KEY (round_id) REFERENCES rounds(round_id)
);

-- Claims table
CREATE TABLE claims (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fingerprint TEXT,
  wallet_address TEXT,
  round_id INTEGER,
  amount REAL,
  claimed_at INTEGER,
  tx_hash TEXT,
  UNIQUE(fingerprint, round_id)
);
```

### 3. Chainlink Price Oracle
- Integrate Chainlink price feed
- Record price at top of each hour
- Store in rounds table
- Calculate winners

### 4. Smart Contract (Optional but Recommended)
- Store round data on-chain
- Handle ETH deposits and withdrawals
- Automated reward distribution
- Provably fair logic

---

## 🚀 Deployment Status

### ✅ Completed
- [x] Full frontend codebase
- [x] Git repository initialized
- [x] Committed to GitHub
- [x] Pushed to https://github.com/HybieGee/DoubtBelanciaga
- [x] Ready for Cloudflare Pages

### ⏳ Next Steps

1. **Deploy to Cloudflare Pages** (5 minutes)
   - Follow DEPLOYMENT.md guide
   - Connect GitHub repo to Cloudflare
   - Site will be live at `https://doubt-belanciaga.pages.dev`

2. **Test Frontend** (30 minutes)
   - Open site in browser
   - Test choice selection
   - Verify animations work
   - Test wallet connection
   - Check responsive design

3. **Build Backend API** (2-4 hours)
   - Create Cloudflare Worker
   - Set up D1 database
   - Implement game logic endpoints
   - Connect to Chainlink oracle

4. **Smart Contract** (4-8 hours)
   - Write Solidity contract
   - Deploy to testnet (Sepolia/Goerli)
   - Test with fake ETH
   - Deploy to mainnet

5. **Integration Testing** (2-4 hours)
   - Connect frontend to backend
   - Test full game flow
   - Verify reward distribution
   - Security audit

6. **Launch** 🚀
   - Set up custom domain
   - Marketing announcement
   - Monitor for issues
   - Gather feedback

---

## 📊 Performance Optimizations

- Vite for fast builds
- Code splitting for smaller bundles
- Optimized Three.js rendering
- Debounced API calls
- Efficient state management with Zustand
- Lazy loading for modals

---

## 🔐 Security Considerations

- Fingerprinting prevents multi-accounting
- Wallet signature required for claims
- No private keys stored
- Client-side validation
- Rate limiting needed on backend
- Smart contract audit recommended

---

## 🎯 Success Metrics

Track these after launch:
- Daily active users
- Choice distribution (DOUBT vs BELIEVE)
- Average pool size per round
- Wallet connection rate
- Claim success rate
- User retention (returning players)

---

## 📞 Support & Contact

- **GitHub**: https://github.com/HybieGee/DoubtBelanciaga
- **Issues**: Open an issue on GitHub
- **Email**: [email protected] (update in whitepaper)

---

## 🎨 Future Enhancements

Potential additions:
- [ ] Leaderboard system
- [ ] Historical stats dashboard
- [ ] Multiple token pairs (ETH/BTC/SOL)
- [ ] Social sharing (Twitter integration)
- [ ] Achievement badges
- [ ] Sound effects and music
- [ ] Mobile app version
- [ ] Multiplayer chat
- [ ] Referral system
- [ ] Staking mechanism

---

**Status**: Frontend complete and deployed to GitHub ✅

**Next Action**: Deploy to Cloudflare Pages (see DEPLOYMENT.md)

Built with conviction. Ready to launch. 🚀
