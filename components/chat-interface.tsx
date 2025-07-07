"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Send, User, Bot, Loader2, Brain } from "lucide-react"

interface ChatMessage {
  id: string
  type: "user" | "ai" | "loading"
  content: string
  followUpQuestions?: string[]
}

interface ChatInterfaceProps {
  mode: "reflection" | "answer" | "leetcode" | "learning-plan"
  initialQuestion?: string
}

export function ChatInterface({ mode, initialQuestion }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)
  const [viewportHeight, setViewportHeight] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const inputContainerRef = useRef<HTMLDivElement>(null)
  const initialProcessedRef = useRef(false)

  // Handle viewport changes for mobile keyboard detection
  useEffect(() => {
    const handleViewportChange = () => {
      if (typeof window !== "undefined") {
        const currentHeight = window.visualViewport?.height || window.innerHeight
        const fullHeight = window.screen.height

        // Detect if keyboard is visible (viewport height significantly reduced)
        const keyboardThreshold = fullHeight * 0.75
        const isKeyboard = currentHeight < keyboardThreshold

        setIsKeyboardVisible(isKeyboard)
        setViewportHeight(currentHeight)
      }
    }

    // Initial setup
    handleViewportChange()

    // Listen for viewport changes
    if (typeof window !== "undefined" && window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleViewportChange)
      window.visualViewport.addEventListener("scroll", handleViewportChange)

      return () => {
        window.visualViewport?.removeEventListener("resize", handleViewportChange)
        window.visualViewport?.removeEventListener("scroll", handleViewportChange)
      }
    } else {
      // Fallback for browsers without visualViewport support
      window.addEventListener("resize", handleViewportChange)
      return () => window.removeEventListener("resize", handleViewportChange)
    }
  }, [])

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Auto-resize textarea without scroll
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      const newHeight = Math.min(textareaRef.current.scrollHeight, 120)
      textareaRef.current.style.height = `${newHeight}px`
    }
  }, [input])

  // Handle initial question ONCE
  useEffect(() => {
    if (initialQuestion && !initialProcessedRef.current) {
      initialProcessedRef.current = true
      processQuestion(initialQuestion)
    }
  }, [initialQuestion, mode])

  const processQuestion = async (question: string) => {
    if (isLoading) return
    setIsLoading(true)

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: "user",
      content: question,
    }

    const loadingMessage: ChatMessage = {
      id: `loading-${Date.now()}`,
      type: "loading",
      content: "Thinking...",
    }

    setMessages((prev) => [...prev, userMessage, loadingMessage])

    try {
      const conversationHistory = messages
        .filter((msg) => msg.type === "user" || msg.type === "ai")
        .reduce(
          (acc, msg, index, arr) => {
            if (msg.type === "user" && arr[index + 1]?.type === "ai") {
              acc.push({
                question: msg.content,
                answer: arr[index + 1].content,
              })
            }
            return acc
          },
          [] as Array<{ question: string; answer: string }>,
        )

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, mode, conversationHistory }),
      })

      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const data = await response.json()

      setMessages((prev) => {
        const withoutLoading = prev.filter((msg) => msg.type !== "loading")
        return [
          ...withoutLoading,
          {
            id: `ai-${Date.now()}`,
            type: "ai",
            content: data.answer,
            followUpQuestions: data.followUpQuestions,
          },
        ]
      })
    } catch (error) {
      setMessages((prev) => {
        const withoutLoading = prev.filter((msg) => msg.type !== "loading")
        return [
          ...withoutLoading,
          {
            id: `error-${Date.now()}`,
            type: "ai",
            content: `Error: ${(error as Error).message}\n\nCheck your GROQ_API_KEY in .env.local`,
          },
        ]
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const question = input.trim()
    setInput("")
    await processQuestion(question)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div
      className="flex flex-col bg-black text-white transition-all duration-300"
      style={{
        height: isKeyboardVisible ? `${viewportHeight}px` : "100vh",
        minHeight: isKeyboardVisible ? `${viewportHeight}px` : "100vh",
      }}
    >
      {/* Messages Container - Proper padding to avoid fixed input overlap */}
      <div
        className={`flex-1 overflow-y-auto p-2 sm:p-3 md:p-4 space-y-2 sm:space-y-3 transition-all duration-300 ${
          isKeyboardVisible ? "pb-20" : "pb-32 sm:pb-36 md:pb-40"
        }`}
        style={{
          height: isKeyboardVisible
            ? `${viewportHeight - 120}px` // Account for input area
            : "calc(100vh - 160px)",
        }}
      >
        {messages.length === 0 && (
          <div className="text-center text-white py-4 sm:py-8">
            <Brain className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-4 opacity-50 text-white" />
            <p className="text-sm sm:text-lg mb-1 sm:mb-2 text-white">Ready to learn! 🚀</p>
            <p className="text-xs sm:text-sm text-gray-300">
              {mode === "reflection"
                ? "I'll guide you with questions"
                : mode === "answer"
                  ? "I'll explain step by step"
                  : mode === "leetcode"
                    ? "I'll teach algorithms first"
                    : "I'll create learning plans"}
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className="w-full">
            {message.type === "user" && (
              <div className="flex justify-end mb-1 sm:mb-2 w-full">
                <div className="flex items-start gap-1 sm:gap-2 max-w-[85%] sm:max-w-[75%] md:max-w-[65%] lg:max-w-[55%]">
                  <Card className="bg-blue-600 text-white border-blue-600">
                    <CardContent className="p-2 sm:p-3">
                      <p className="text-xs sm:text-sm text-white break-words leading-tight sm:leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </CardContent>
                  </Card>
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <User className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                  </div>
                </div>
              </div>
            )}

            {(message.type === "ai" || message.type === "loading") && (
              <div className="flex justify-start w-full">
                <div className="flex items-start gap-1 sm:gap-2 max-w-[90%] sm:max-w-[85%] md:max-w-[75%] lg:max-w-[70%]">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                    {message.type === "loading" ? (
                      <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 text-white animate-spin" />
                    ) : (
                      <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                    )}
                  </div>
                  <Card className="bg-gray-800 border-gray-700 w-full min-w-0">
                    <CardContent className="p-2 sm:p-3 md:p-4 overflow-hidden">
                      {message.type === "loading" ? (
                        <div className="flex items-center gap-2">
                          <div className="flex space-x-1">
                            {[0, 1, 2].map((i) => (
                              <div
                                key={i}
                                className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-bounce"
                                style={{ animationDelay: `${i * 0.1}s` }}
                              />
                            ))}
                          </div>
                          <span className="text-xs sm:text-sm text-white">Thinking...</span>
                        </div>
                      ) : (
                        <>
                          <div className="whitespace-pre-wrap text-xs sm:text-sm md:text-base leading-tight sm:leading-relaxed text-white break-words overflow-wrap-anywhere hyphens-auto max-w-full">
                            {message.content}
                          </div>
                          {message.followUpQuestions?.length && (
                            <div className="mt-2 sm:mt-4 pt-2 sm:pt-4 border-t border-gray-600">
                              <p className="text-xs text-gray-300 mb-2 sm:mb-3 flex items-center gap-1 sm:gap-2">
                                <Brain className="h-2.5 w-2.5 sm:h-3 sm:w-3" />💭 Follow-up questions:
                              </p>
                              <div className="space-y-1 sm:space-y-2">
                                {message.followUpQuestions.map((q, i) => (
                                  <Button
                                    key={i}
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs sm:text-sm h-auto p-2 sm:p-3 text-left justify-start hover:bg-gray-700 w-full border border-gray-600 hover:border-gray-500 text-white leading-tight sm:leading-relaxed min-h-0"
                                    onClick={() => setInput(q)}
                                  >
                                    <span className="break-words text-left w-full whitespace-normal overflow-wrap-anywhere hyphens-auto block">
                                      {q}
                                    </span>
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Fixed at Bottom with keyboard-aware positioning */}
      <div
        ref={inputContainerRef}
        className={`fixed left-0 right-0 bg-black/95 backdrop-blur-sm border-t border-gray-800 z-50 transition-all duration-300 ${
          isKeyboardVisible ? "p-2" : "p-2 sm:p-3 md:p-4"
        }`}
        style={{
          bottom: isKeyboardVisible ? "0px" : "0px",
        }}
      >
        <form onSubmit={handleSubmit} className="flex gap-1 sm:gap-2 items-center max-w-full mx-auto">
          <div className="flex-1 relative min-w-0 max-w-full">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question... (Shift+Enter for new line)"
              className="w-full bg-gray-900 border border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-3 pr-10 sm:pr-12 rounded-lg resize-none min-h-[32px] sm:min-h-[40px] max-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 box-border overflow-hidden"
              disabled={isLoading}
              rows={1}
              style={{
                wordBreak: "break-word",
                overflowWrap: "break-word",
                hyphens: "auto",
                boxSizing: "border-box",
                maxWidth: "100%",
                overflowX: "hidden",
                overflowY: "hidden",
                fontSize: isKeyboardVisible ? "16px" : "", // Prevent zoom on iOS
              }}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-1 top-1/2 transform -translate-y-[15px] md:-translate-y-[20px] bg-blue-600 hover:bg-blue-700 px-2 sm:px-3 h-6 sm:h-8 w-6 sm:w-8 flex items-center justify-center flex-shrink-0"
            >
              <Send className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </form>

        {/* Mode Indicator */}
        <div
          className={`text-xs text-gray-400 text-center transition-all duration-300 ${
            isKeyboardVisible ? "mt-1" : "mt-1 sm:mt-2"
          }`}
        >
          {mode === "reflection" && "Socratic questioning mode"}
          {mode === "answer" && "Direct explanation mode"}
          {mode === "leetcode" && "Algorithm teaching mode"}
          {mode === "learning-plan" && "Learning roadmap mode"}
        </div>
      </div>
    </div>
  )
}
