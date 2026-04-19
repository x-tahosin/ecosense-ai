# EcoSense AI 🌍

**AI-Powered Carbon Footprint Analyzer** — Built for Earth Day 2026

## What It Does
Answer 4 quick questions about your daily habits (transport, diet, energy, shopping) and EcoSense AI uses **Google Gemini** to:
- Calculate your estimated annual carbon footprint
- Grade your eco-friendliness (A+ to F)
- Show impact breakdown by category
- Give 5 personalized tips to reduce your footprint
- Generate a shareable Earth Day pledge

## Live Demo
**[https://ecosense-ai.pages.dev](https://ecosense-ai.pages.dev)**

## Tech Stack
- **Next.js 16** (static export)
- **Tailwind CSS** (custom Earth Day theme)
- **Google Gemini 2.0 Flash** (AI analysis via server-side proxy)
- **Cloudflare Pages** (hosting + serverless functions)
- **Lucide React** (icons)

## Architecture
```
Browser → Static HTML/JS (Cloudflare Pages)
            ↓
         /api/generate (Cloudflare Function — server-side only)
            ↓
         Google Gemini API (key never exposed to client)
```

## Setup
```bash
npm install
npm run build
# Deploy: wrangler pages deploy out
# Set GEMINI_API_KEY in Cloudflare Pages environment variables
```

## Built for
[DEV Weekend Challenge: Earth Day Edition](https://dev.to/challenges/weekend-2026-04-16)

---
Made with ♥ for our planet 🌱
