<div align="center">

# 🌍 EcoSense AI

**AI-Powered Carbon Footprint Analyzer | Earth Day 2026**

[![Live Demo](https://img.shields.io/badge/Live_Demo-ecosense--ai.pages.dev-00C853?style=for-the-badge&logo=googlechrome&logoColor=white)](https://ecosense-ai.pages.dev)
[![Dev.to](https://img.shields.io/badge/Challenge_Submission-DEV.to-0A0A0A?style=for-the-badge&logo=devdotto&logoColor=white)](https://dev.to/tahosin/ecosense-ai-know-your-carbon-footprint-in-60-seconds-3gac)

![Next.js](https://img.shields.io/badge/Next.js_16-000?style=flat-square&logo=next.js)
![Gemini](https://img.shields.io/badge/Google_Gemini-4285F4?style=flat-square&logo=google&logoColor=white)
![Backboard](https://img.shields.io/badge/Backboard-5C6BC0?style=flat-square)
![Solana](https://img.shields.io/badge/Solana-9945FF?style=flat-square&logo=solana&logoColor=white)
![Cloudflare](https://img.shields.io/badge/Cloudflare_Pages-F38020?style=flat-square&logo=cloudflare&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)

</div>


## 📖 Deep Dive

This project is one of 5 AI apps I shipped on Google's Gemini free tier. I wrote up the exact architecture, cost breakdown, and what breaks first in production:

**[$0/Month, 5 AI Apps, All on Gemini: Here's Exactly What the Free Tier Gives You (and What Breaks First)](https://dev.to/tahosin/0month-5-ai-apps-all-on-gemini-heres-exactly-what-the-free-tier-gives-you-and-what-breaks-58fl)** — on Dev.to

---

## What It Does

Answer 4 quick questions about your daily habits and **Google Gemini** analyzes your carbon footprint in real-time:

- **Eco Score** (0-100) with letter grade and SVG donut chart
- **Estimated annual CO2** compared to global average
- **Impact breakdown** by category (transport, diet, energy, shopping)
- **5 personalized tips** to reduce your footprint
- **Earth Day pledge** — copy and share on social media
- **Carbon offset** — donate SOL via Solana to plant trees
- **Progress tracking** — Backboard memory saves your assessments

## Architecture

```
Browser → Static HTML/JS (Cloudflare Pages)
            ↓
         /api/generate → Cloudflare Function → Google Gemini API
         /api/memory   → Cloudflare Function → Backboard API
         
         API keys NEVER reach the browser.
```

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Next.js 16** | Static export frontend |
| **Google Gemini 2.0 Flash** | AI analysis engine |
| **Backboard** | Persistent memory threads |
| **Solana** | Carbon offset donations |
| **Cloudflare Pages** | Hosting + serverless functions |
| **Tailwind CSS** | Earth Day green theme |
| **Lucide React** | Icons |

## Quick Start

```bash
git clone https://github.com/x-tahosin/ecosense-ai.git
cd ecosense-ai
npm install
npm run build
```

Set environment variables on Cloudflare Pages:
- `GEMINI_API_KEY` — Google Gemini API key
- `BACKBOARD_API_KEY` — Backboard API key

Deploy:
```bash
wrangler pages deploy out --project-name ecosense-ai
```

## Built For

[DEV Weekend Challenge: Earth Day Edition](https://dev.to/challenges/weekend-2026-04-16) — $1,000 prize pool

**Prize Categories:** Best Use of Google Gemini • Best Use of Backboard • Best Use of Solana • Best Use of GitHub Copilot

---

<div align="center">

Made with 💚 for our planet

</div>
