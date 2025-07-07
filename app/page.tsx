"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Send } from 'lucide-react'
import { ChatInterface } from "@/components/chat-interface"

export default function Home() {
  const [question, setQuestion] = useState("")
  const [mode, setMode] = useState<"reflection" | "answer" | "leetcode" | "learning-plan">("reflection")
  const [showChat, setShowChat] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [question])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) return
    setShowChat(true)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  if (showChat) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <header className="relative z-10 flex items-center justify-between p-3 sm:p-4 border-b border-gray-800">
          <button onClick={() => setShowChat(false)}>
            <h1 className="text-lg sm:text-xl font-bold tracking-wide text-center bg-gradient-to-b from-white to-black text-transparent bg-clip-text">
              Lumora-ai
            </h1>
          </button>
          <div className="flex items-center gap-2">
            <a
              href="https://www.linkedin.com/in/your-linkedin-url"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="md:px-3 md:py-1.5 px-5 py-1 text-xs md:text-sm bg-gradient-to-r from-gray-900 via-black to-gray-900 text-gray-400 border border-white/20 rounded-xl md:rounded-2xl font-serif shadow-md hover:shadow-lg hover:brightness-125 transition-all duration-300">
                Contact
              </button>
            </a>
          </div>
        </header>
        <div className="flex-1">
          <ChatInterface mode={mode} initialQuestion={question} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20"></div>
      </div>

      {/* Header - Responsive */}
      <header className="relative z-10 flex items-center justify-between p-3 sm:p-4 border-b border-gray-800">
        <h1 className="text-lg sm:text-xl font-bold tracking-wide text-center bg-gradient-to-b from-white to-black text-transparent bg-clip-text">
          Lumora-ai
        </h1>
        <div className="flex items-center gap-2">
          <a
            href="https://www.linkedin.com/in/your-linkedin-url"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="md:px-3 md:py-1.5 px-5 py-1 text-xs md:text-sm bg-gradient-to-r from-gray-900 via-black to-gray-900 text-gray-400 border border-white/20 rounded-xl md:rounded-2xl font-serif shadow-md hover:shadow-lg hover:brightness-125 transition-all duration-300">
              Contact
            </button>
          </a>
        </div>
      </header>

      {/* Main Content - Responsive with bottom padding for fixed input */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-4 sm:p-8 pb-32 sm:pb-36 md:pt-20">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-5xl sm:text-8xl font-bold tracking-wide text-center mb-4 bg-gradient-to-b from-white to-black text-transparent bg-clip-text">
            Lumora-ai
          </h1>
          <p className="text-gray-300 text-base sm:text-lg">Thoughts That Shine Brighter Than Stars</p>
        </div>

        {/* Mode Cards - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12 w-full max-w-6xl">
          <Card
            className={`cursor-pointer transition-all duration-200 border ${
              mode === "reflection"
                ? "border-blue-500 bg-blue-500/10"
                : "border-gray-800 bg-gray-900/50 hover:border-gray-700"
            }`}
            onClick={() => setMode("reflection")}
          >
            <CardContent className="p-4 sm:p-6">
              <h3 className="font-semibold text-sm mb-3 text-white">Reflection Mode</h3>
              <p className="text-gray-300 text-xs sm:text-sm">Guides you with questions to think through problems.</p>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all duration-200 border ${
              mode === "answer"
                ? "border-green-500 bg-green-500/10"
                : "border-gray-800 bg-gray-900/50 hover:border-gray-700"
            }`}
            onClick={() => setMode("answer")}
          >
            <CardContent className="p-4 sm:p-6">
              <h3 className="font-semibold text-sm mb-3 text-white">Answer Mode</h3>
              <p className="text-gray-300 text-xs sm:text-sm">Provides direct answers with explanations.</p>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all duration-200 border ${
              mode === "leetcode"
                ? "border-purple-500 bg-purple-500/10"
                : "border-gray-800 bg-gray-900/50 hover:border-gray-700"
            }`}
            onClick={() => setMode("leetcode")}
          >
            <CardContent className="p-4 sm:p-6">
              <h3 className="font-semibold text-sm mb-3 text-white">LeetCode Help</h3>
              <p className="text-gray-300 text-xs sm:text-sm">Algorithm understanding before code.</p>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all duration-200 border ${
              mode === "learning-plan"
                ? "border-orange-500 bg-orange-500/10"
                : "border-gray-800 bg-gray-900/50 hover:border-gray-700"
            }`}
            onClick={() => setMode("learning-plan")}
          >
            <CardContent className="p-4 sm:p-6">
              <h3 className="font-semibold text-sm mb-3 text-white">Learning Plan</h3>
              <p className="text-gray-300 text-xs sm:text-sm">Structured learning roadmaps.</p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Bottom Input - Fixed with proper z-index */}
      <div className="fixed bottom-0 left-0 right-0 p-2 sm:p-3 md:p-4 bg-black/90 backdrop-blur-sm border-t border-gray-800 z-50">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="flex gap-1 sm:gap-2 items-end">
            <div className="flex-1 relative min-w-0">
              <textarea
                ref={textareaRef}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question... (Shift+Enter for new line)"
                className="w-full bg-gray-900/80 border border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 text-xs sm:text-sm md:text-base px-2 sm:px-3 py-2 sm:py-3 pr-10 sm:pr-12 rounded-lg resize-none min-h-[36px] sm:min-h-[48px] max-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 break-words overflow-wrap-anywhere overflow-hidden"
                rows={1}
                style={{
                  wordBreak: "break-word",
                  overflowWrap: "anywhere",
                  hyphens: "auto",
                }}
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-2 top-[18px] md:top-[25px] -translate-y-1/2 bg-blue-600 hover:bg-blue-700 h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0"
              >
                <Send className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </form>

          {/* Mode Buttons - Responsive */}
          <div className="flex flex-col sm:flex-row items-center justify-between mt-2 sm:mt-3 gap-2 text-sm text-gray-400">
            <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center sm:justify-start">
              {[
                { key: "reflection", icon: "", label: "Reflection" },
                { key: "answer", icon: "", label: "Answer" },
                { key: "leetcode", icon: "", label: "LeetCode" },
                { key: "learning-plan", icon: "", label: "Plan" },
              ].map((m) => (
                <Button
                  key={m.key}
                  variant={mode === m.key ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setMode(m.key as any)}
                  className="text-xs px-2 py-1 text-gray-300 bg-gray-900 hover:text-gray-700"
                >
                  {m.icon} {m.label}
                </Button>
              ))}
            </div>
            <div className="text-center sm:text-right">
              <span className="text-xs text-gray-400 block">
                {mode === "reflection"
                  ? "Guiding questions"
                  : mode === "answer"
                    ? "Direct explanations"
                    : mode === "leetcode"
                      ? "Algorithm teaching"
                      : "Learning roadmaps"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
