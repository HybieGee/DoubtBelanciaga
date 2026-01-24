# Deployment Guide: Cloudflare Pages

## Quick Start

### Method 1: GitHub Integration (Recommended)

1. **Go to Cloudflare Dashboard**
   - Visit: https://dash.cloudflare.com
   - Navigate to: **Workers & Pages** → **Pages**

2. **Create New Project**
   - Click **"Create a project"**
   - Click **"Connect to Git"**

3. **Connect Repository**
   - Select **GitHub** as your Git provider
   - Authorize Cloudflare if needed
   - Select repository: **HybieGee/DoubtBelanciaga**

4. **Configure Build Settings**
   ```
   Project name: doubt-belanciaga (or your choice)
   Production branch: main
   Build command: npm run build
   Build output directory: dist
   Root directory: /
   ```

5. **Environment Variables** (Optional for now)
   - You can add these later in Settings → Environment variables
   ```
   VITE_API_URL=https://your-api-endpoint.workers.dev
   ```

6. **Deploy**
   - Click **"Save and Deploy"**
   - Wait for build to complete (~2-3 minutes)
   - Your site will be live at: `https://doubt-belanciaga.pages.dev`

### Method 2: Direct Deploy (CLI)

If you prefer command-line deployment:

```bash
# 1. Install dependencies
npm install

# 2. Build the project
npm run build

# 3. Install Wrangler CLI globally (if not installed)
npm install -g wrangler

# 4. Login to Cloudflare
wrangler login

# 5. Deploy to Cloudflare Pages
wrangler pages deploy dist --project-name=doubt-belanciaga
```

## Custom Domain Setup

After deployment, you can add a custom domain:

1. Go to your project in Cloudflare Pages
2. Navigate to **Custom domains**
3. Click **"Set up a custom domain"**
4. Enter your domain (e.g., `doubtvsbelieve.com`)
5. Follow DNS configuration instructions
6. SSL certificate is automatically provisioned

## Environment Variables

Add these in Cloudflare Pages Dashboard → Settings → Environment variables:

### Production Variables
```
VITE_API_URL=https://your-production-api.workers.dev
VITE_CONTRACT_ADDRESS=0x...
VITE_CHAINLINK_FEED=0x...
```

### Preview/Development Variables
You can set different values for preview deployments.

## Continuous Deployment

Every push to the `main` branch will automatically trigger a new deployment.

Preview deployments are created for pull requests.

## Troubleshooting

### Build Fails
- Check that Node.js version is compatible (16+)
- Verify all dependencies are in package.json
- Check build logs in Cloudflare dashboard

### Site Loads but Blank Screen
- Check browser console for errors
- Verify base path in vite.config.js is `'./'`
- Ensure all assets are properly bundled

### 3D Not Rendering
- Check that WebGL is supported in browser
- Verify Three.js and react-three-fiber are properly installed
- Check for console errors related to Canvas

## Next Steps

Once deployed, you'll need to:

1. **Set up Backend API** (Cloudflare Workers)
   - Price oracle integration
   - Game round management
   - User choice tracking
   - Reward distribution

2. **Smart Contract Deployment**
   - Deploy game contract
   - Configure Chainlink price feeds
   - Set up reward distribution logic

3. **Database Setup** (Cloudflare D1)
   - User fingerprints
   - Round history
   - Choice tracking
   - Reward claims

4. **Testing**
   - Test wallet connection
   - Verify game flow
   - Check responsive design
   - Performance optimization

## Support

For issues:
- Check Cloudflare Pages documentation: https://developers.cloudflare.com/pages/
- GitHub Issues: https://github.com/HybieGee/DoubtBelanciaga/issues
- Cloudflare Discord: https://discord.gg/cloudflaredev

---

**Your site is now ready to deploy!** 🚀
