'use client'

import { useSearchParams } from 'next/navigation'
import { ChatInterface } from '@/components/chat-interface'
import React from 'react'

const validModes = ['reflection', 'answer', 'leetcode', 'learning-plan'] as const
type ModeType = typeof validModes[number]

export function ChatClient() {
  const searchParams = useSearchParams()

  const rawMode = searchParams.get('mode')
  const mode: ModeType = validModes.includes(rawMode as ModeType)
    ? (rawMode as ModeType)
    : 'reflection'

  const question = searchParams.get('question') || ''

  return <ChatInterface mode={mode} initialQuestion={question} />
}
