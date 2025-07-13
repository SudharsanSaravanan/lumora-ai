// app/chat/page.tsx
import React, { Suspense } from 'react'
import { ChatClient } from '@/components/chat-client'

export const dynamic = 'force-dynamic'

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between p-3 sm:p-4 bg-black/90 backdrop-blur-sm border-b border-gray-800">
        <a href="/" className="text-lg font-bold bg-gradient-to-b from-white to-black text-transparent bg-clip-text">
          Lumora-ai
        </a>
        <a
          href="https://www.linkedin.com/in/your-linkedin-url"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="md:px-3 md:py-1.5 px-5 py-1 text-xs md:text-sm bg-gradient-to-r from-gray-900 via-black to-gray-900 text-gray-400 border border-white/20 rounded-xl font-serif shadow-md hover:text-white hover:brightness-125 hover:border-white transition-all duration-300">
          Contact
           </button>
        </a>
      </header>

      {/* Chat Client in Suspense */}
      <div className="flex-1">
        <Suspense fallback={<div className="p-4 text-gray-400">Loading chat...</div>}>
          <ChatClient />
        </Suspense>
      </div>
    </div>
  )
}
