import { type NextRequest, NextResponse } from "next/server"
import { aiService } from "@/lib/ai-service"

export async function POST(request: NextRequest) {
  try {
    const { question, mode, conversationHistory } = await request.json()

    if (!question || !mode) {
      return NextResponse.json({ error: "Missing question or mode" }, { status: 400 })
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "GROQ_API_KEY not configured" }, { status: 500 })
    }

    const response = await aiService.processQuestion({
      question,
      mode,
      conversationHistory,
    })

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json({ error: "AI processing failed", details: error.message }, { status: 500 })
  }
}
