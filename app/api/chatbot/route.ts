import { NextResponse } from "next/server";
import { chatbot } from "@/lib/groq";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { businessIdea, context, conversationHistory } = body;

    if (!businessIdea || !context) {
      return NextResponse.json(
        { error: "Missing businessIdea or Context" },
        { status: 400 },
      );
    }

    const result = await chatbot(
      businessIdea,
      context,
      conversationHistory,
    );
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
