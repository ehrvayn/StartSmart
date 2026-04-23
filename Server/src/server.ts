import type { Express, Request, Response } from "express";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { analyzeBusiness } from "./GroqService.ts";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post("/api/analyze-business", async (req: Request, res: Response) => {
  try {
    const { businessIdea, location } = req.body;

    if (!businessIdea || !location) {
      res.status(400).json({ error: "Missing businessIdea or location" });
      return;
    }

    const result = await analyzeBusiness(businessIdea, location);

    res.json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "Server is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
