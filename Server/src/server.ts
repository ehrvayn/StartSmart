import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { analyzeBusiness, chatbot } from "./GroqService.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "Server is running" });
});

app.post("/api/analyze-business", async (req, res) => {
  try {
    const { businessIdea } = req.body;

    if (!businessIdea) {
      res.status(400).json({ error: "Missing businessIdea" });
      return;
    }

    const result = await analyzeBusiness(businessIdea);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/chatbot", async (req, res) => {
  try {
    const { businessIdea, context, conversationHistory } = req.body;

    if (!businessIdea || !context) {
      res.status(400).json({ error: "Missing businessIdea or Context" });
      return;
    }

    const result = await chatbot(businessIdea, context, conversationHistory);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

server.on("error", (err) => {
  console.error("Server error:", err);
});
