'use client'

import { useSearchParams } from 'next/navigation'
import { ChatInterface } from '@/components/chat-interface'
import React from 'react'

export default function ChatPage() {
  const searchParams = useSearchParams()
  const mode = searchParams.get('mode') as
    | 'reflection'
    | 'answer'
    | 'leetcode'
    | 'learning-plan'
    | null
  const question = searchParams.get('question') || ''

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="relative z-10 flex items-center justify-between p-3 sm:p-4 border-b border-gray-800">
        <a href="/" className="text-lg font-bold bg-gradient-to-b from-white to-black text-transparent bg-clip-text">
          Lumora-ai
        </a>
        <a
          href="https://www.linkedin.com/in/your-linkedin-url"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="md:px-3 md:py-1.5 px-5 py-1 text-xs md:text-sm bg-gradient-to-r from-gray-900 via-black to-gray-900 text-gray-400 border border-white/20 rounded-xl font-serif shadow-md hover:shadow-lg transition-all duration-300">
            Contact
          </button>
        </a>
      </header>
      <div className="flex-1">
        <ChatInterface mode={mode || 'reflection'} initialQuestion={question} />
      </div>
    </div>
  )
}
