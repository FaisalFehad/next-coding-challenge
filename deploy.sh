#!/bin/bash

# Quick deployment script for development
# Usage: ./deploy.sh [platform]
# Platforms: vercel, netlify, build

set -e

PLATFORM=${1:-vercel}

echo "🚀 Starting deployment process..."

# Run tests first
echo "🧪 Running tests..."
npm test

# Build the application
echo "🔨 Building application..."
npm run build

case $PLATFORM in
  "vercel")
    echo "🌍 Deploying to Vercel..."
    if command -v vercel &> /dev/null; then
      vercel --prod
    else
      echo "❌ Vercel CLI not found. Install with: npm i -g vercel"
      exit 1
    fi
    ;;
  
  "netlify")
    echo "🌍 Deploying to Netlify..."
    if command -v netlify &> /dev/null; then
      netlify deploy --prod --dir=.next
    else
      echo "❌ Netlify CLI not found. Install with: npm i -g netlify-cli"
      exit 1
    fi
    ;;
  
  "build")
    echo "✅ Build completed successfully!"
    echo "📁 Files ready for deployment in .next/ directory"
    ;;
  
  *)
    echo "❌ Unknown platform: $PLATFORM"
    echo "Available platforms: vercel, netlify, build"
    exit 1
    ;;
esac

echo "✅ Deployment process completed!"