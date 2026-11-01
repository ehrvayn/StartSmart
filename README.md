<h1>
  <img src="https://res.cloudinary.com/dlvcjwfjm/image/upload/v1793525760/StartSmartLogo.png" alt="InterviewSpark logo" height="48" align="absmiddle">
  StartSmart
</h1>

AI-powered business viability analyzer. Enter your business idea, get instant insights on costs, timeline, risks, and legality.


**Live:** [View Website](https://startsmartgo.vercel.app)

![StartSmart setup screen](https://res.cloudinary.com/dlvcjwfjm/image/upload/v1793525511/StartSmartSample.png)

## Features

- AI-powered analysis (gpt-oss-120b)
- Startup costs breakdown
- Implementation timeline
- Market demand & risk assessment
- Legal requirements checklist
- Save & export analysis

## Tech Stack

**Frontend:** Next.js (App Router), React, TypeScript, Tailwind  
**Backend:** Next.js API Routes, Groq API

## Quick Start

```bash
npm install
# Create .env with GROQ_ANALYSIS_API_KEY, GROQ_CHATBOT_API_KEY and PORT=3000
npm run dev
```

Visit `http://localhost:3000`

## API

**POST** `/api/analyze-business`
```json
{ "businessIdea": "Coffee shop" }
```

Returns analysis with costs, timeline, challenges, legal requirements, and viability score.

**POST** `/api/chatbot`
```json
{ "businessIdea": "Coffee shop", "context": "...", "conversationHistory": [] }
```

**GET** `/api/health` - Server status

## How It Works

1. Enter business idea
2. Groq AI analyzes and generates insights
3. View comprehensive report
4. Save to browser storage
5. Export as PDF

## License

MIT
