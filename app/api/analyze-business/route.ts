import { NextResponse } from "next/server";
import { analyzeBusiness } from "@/lib/groq";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { businessIdea } = body;

    if (!businessIdea) {
      return NextResponse.json(
        { error: "Missing businessIdea" },
        { status: 400 },
      );
    }

    const result = await analyzeBusiness(businessIdea);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
