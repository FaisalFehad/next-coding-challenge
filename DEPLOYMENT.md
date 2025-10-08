# Deployment Setup

This project includes automated deployment via GitHub Actions. Choose one of the deployment options below:

## Option 1: Vercel (Recommended for Next.js)

### Setup Steps:
1. Create a Vercel account at [vercel.com](https://vercel.com)
2. Install Vercel CLI: `npm i -g vercel`
3. Link your project: `vercel link`
4. Get your Vercel token: `vercel whoami` then go to Settings > Tokens
5. Get your organization and project IDs from `.vercel/project.json`

### GitHub Secrets Required:
- `VERCEL_TOKEN`: Your Vercel API token
- `ORG_ID`: Your Vercel organization ID
- `PROJECT_ID`: Your Vercel project ID

### Add secrets in GitHub:
1. Go to your GitHub repository
2. Settings > Secrets and variables > Actions
3. Add the three secrets above

## Option 2: Netlify

Replace the Vercel step in `.github/workflows/ci.yml` with:

```yaml
- name: Deploy to Netlify
  uses: netlify/actions/cli@master
  with:
    args: deploy --prod --dir=.next
  env:
    NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
    NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

### GitHub Secrets Required:
- `NETLIFY_AUTH_TOKEN`: Your Netlify API token
- `NETLIFY_SITE_ID`: Your Netlify site ID

## Option 3: GitHub Pages (Static Export)

Add to `next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
```

Replace deployment step with:
```yaml
- name: Deploy to GitHub Pages
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./out
```

## Option 4: Self-hosted / VPS

Replace deployment step with:
```yaml
- name: Deploy to VPS
  uses: appleboy/ssh-action@v1.0.0
  with:
    host: ${{ secrets.HOST }}
    username: ${{ secrets.USERNAME }}
    key: ${{ secrets.KEY }}
    script: |
      cd /path/to/your/app
      git pull origin main
      npm ci
      npm run build
      pm2 restart your-app
```

## Current Setup

The current workflow is configured for Vercel deployment. If you want to use a different platform, modify the deployment step in `.github/workflows/ci.yml` accordingly.

## Deployment Trigger

The deployment runs automatically when you push to any branch, but only after all tests pass.