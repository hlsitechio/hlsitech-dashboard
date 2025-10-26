'use client'

import { useState, useEffect, useRef } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'
import { formatTime } from '@/lib/utils/date'

interface ChatWindowProps {
  conversationId: string
  onClose: () => void
}

export default function ChatWindow({ conversationId, onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [conversation, setConversation] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const supabase = getSupabaseClient()

  useEffect(() => {
    loadConversation()
    loadMessages()

    // Subscribe to real-time message updates
    const messagesSubscription = supabase
      .channel(`messages-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((current) => [...current, payload.new])
          scrollToBottom()
        }
      )
      .subscribe()

    return () => {
      messagesSubscription.unsubscribe()
    }
  }, [conversationId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadConversation = async () => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          users (
            id,
            name,
            email,
            avatar_url
          ),
          agents (
            id,
            name,
            email
          )
        `)
        .eq('id', conversationId)
        .single()

      if (error) throw error
      setConversation(data)
    } catch (error) {
      console.error('Error loading conversation:', error)
    }
  }

  const loadMessages = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      console.error('Error loading messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    try {
      setSending(true)

      const response = await fetch('/api/chat/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId,
          content: newMessage,
          senderType: 'agent',
        }),
      })

      if (!response.ok) throw new Error('Failed to send message')

      const data = await response.json()

      // Message will be added via real-time subscription
      setNewMessage('')

      // Optionally trigger AI response
      if (data.message) {
        // AI response will be handled by the API
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const renderMessage = (message: any) => {
    const isAgent = message.sender_type === 'agent'
    const isAI = message.sender_type === 'ai'
    const isUser = message.sender_type === 'user'

    return (
      <div
        key={message.id}
        className={`flex ${isAgent || isAI ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`max-w-[70%] ${isAgent || isAI ? 'order-2' : 'order-1'}`}>
          <div
            className={`rounded-lg px-4 py-2 ${
              isAgent
                ? 'bg-blue-600 text-white'
                : isAI
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
            }`}
          >
            {isAI && (
              <div className="flex items-center space-x-2 mb-1">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
                </svg>
                <span className="text-xs font-medium">AI Assistant</span>
              </div>
            )}
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            {message.ai_confidence && (
              <p className="text-xs opacity-75 mt-1">
                Confidence: {Math.round(message.ai_confidence * 100)}%
              </p>
            )}
          </div>
          <div className={`flex items-center mt-1 text-xs text-gray-500 ${isAgent || isAI ? 'justify-end' : 'justify-start'}`}>
            <span>{formatTime(message.created_at)}</span>
            {message.read_at && (
              <span className="ml-2">✓ Read</span>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
            {conversation?.users?.name?.[0]?.toUpperCase() ||
             conversation?.users?.email?.[0]?.toUpperCase() ||
             'U'}
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              {conversation?.users?.name || conversation?.users?.email || 'Unknown User'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {conversation?.subject || 'No subject'}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map(renderMessage)
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={sending}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Send'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
