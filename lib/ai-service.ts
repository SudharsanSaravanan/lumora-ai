import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"

const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
})

export interface AIRequest {
  question: string
  mode: "reflection" | "answer" | "leetcode" | "learning-plan"
  conversationHistory?: Array<{ question: string; answer: string }>
}

export interface AIResponse {
  answer: string
  followUpQuestions: string[]
}

class AIService {
  private getSystemPrompt(mode: string): string {
    const prompts = {
      reflection: `You are a Socratic learning mentor. Guide students to discover answers through questions. Never give direct answers - ask probing questions that lead to understanding.`,

      answer: `You are a teaching assistant. Provide direct answers but always explain the reasoning process step by step first.`,

      leetcode: `You are an algorithms teacher. Focus on understanding before coding. Explain the concept, approach, and complexity before showing any code.`,

      "learning-plan": `You are an educational strategist. Create structured learning paths with clear steps, prerequisites, and practice exercises.`,
    }
    return prompts[mode] || prompts.answer
  }

  async processQuestion(request: AIRequest): Promise<AIResponse> {
    try {
      const systemPrompt = this.getSystemPrompt(request.mode)

      let prompt = request.question
      if (request.conversationHistory?.length) {
        const context = request.conversationHistory
          .slice(-2)
          .map((ex) => `Human: ${ex.question}\nAI: ${ex.answer}`)
          .join("\n\n")
        prompt = `Previous conversation:\n${context}\n\nCurrent question: ${request.question}`
      }

      const { text } = await generateText({
        model: groq("llama-3.1-8b-instant"),
        system: systemPrompt,
        prompt: prompt,
        maxTokens: 1500,
        temperature: 0.7,
      })

      const followUpQuestions = await this.generateFollowUpQuestions(request.question, request.mode)

      return {
        answer: text,
        followUpQuestions,
      }
    } catch (error) {
      throw new Error(`AI processing failed: ${error.message}`)
    }
  }

  async generateFollowUpQuestions(question: string, mode: string): Promise<string[]> {
    try {
      const { text } = await generateText({
        model: groq("llama-3.1-8b-instant"),
        prompt: `Generate 3 follow-up questions for this ${mode} conversation about: "${question}". Return only a JSON array of strings.`,
        maxTokens: 150,
        temperature: 0.8,
      })

      const parsed = JSON.parse(text.trim())
      return Array.isArray(parsed) ? parsed.slice(0, 3) : []
    } catch {
      const defaults = {
        reflection: [
          "What assumptions are you making?",
          "How would you approach this differently?",
          "What patterns do you notice?",
        ],
        leetcode: [
          "Can you think of a more efficient approach?",
          "What edge cases should we consider?",
          "How would you explain this algorithm?",
        ],
        answer: [
          "How does this connect to what you know?",
          "What would happen if we changed something?",
          "Can you think of a real-world example?",
        ],
        "learning-plan": [
          "What's the most challenging part?",
          "How will you measure progress?",
          "What resources work best for you?",
        ],
      }
      return defaults[mode] || defaults.answer
    }
  }
}

export const aiService = new AIService()
