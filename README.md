# StartSmart

AI-powered business viability analyzer. Enter your business idea, get instant insights on costs, timeline, risks, and legality.

## Features

- AI-powered analysis (Groq LLaMA 3.3)
- Startup costs breakdown
- Implementation timeline
- Market demand & risk assessment
- Legal requirements checklist
- Save & export analysis

## Tech Stack

**Frontend:** React, TypeScript, Tailwind, Vite  
**Backend:** Node.js, Express, TypeScript, Groq API

## Quick Start

**Backend:**
```bash
cd Server
npm install
# Create .env with GROQ_API_KEY and PORT=5000
npm run dev
```

**Frontend:**
```bash
cd Client
npm install
npm run dev
```

Visit `http://localhost:5173`

## API

**POST** `/api/analyze-business`
```json
{ "businessIdea": "Coffee shop" }
```

Returns analysis with costs, timeline, challenges, legal requirements, and viability score.

**GET** `/health` - Server status

## How It Works

1. Enter business idea
2. Groq AI analyzes and generates insights
3. View comprehensive report
4. Save to browser storage
5. Export as PDF

## License

MIT
