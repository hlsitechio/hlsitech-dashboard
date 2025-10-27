'use client'

import { useState, useEffect } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'
import ConversationList from './components/ConversationList'
import ChatWindow from './components/ChatWindow'

export default function LiveChatPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [conversations, setConversations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = getSupabaseClient()

  // Load conversations
  useEffect(() => {
    loadConversations()

    // Subscribe to real-time conversation updates
    const conversationsSubscription = supabase
      .channel('conversations-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
        },
        () => {
          loadConversations()
        }
      )
      .subscribe()

    return () => {
      conversationsSubscription.unsubscribe()
    }
  }, [])

  const loadConversations = async () => {
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
        .order('updated_at', { ascending: false })

      if (error) throw error
      setConversations(data || [])
    } catch (error) {
      console.error('Error loading conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteConversation = async (conversationId: string) => {
    try {
      // First, delete all messages in the conversation
      const { error: messagesError } = await supabase
        .from('messages')
        .delete()
        .eq('conversation_id', conversationId)

      if (messagesError) throw messagesError

      // Then delete the conversation itself
      const { error: conversationError } = await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId)

      if (conversationError) throw conversationError

      // If the deleted conversation was selected, clear selection
      if (selectedConversationId === conversationId) {
        setSelectedConversationId(null)
      }

      // Reload conversations
      loadConversations()
    } catch (error) {
      console.error('Error deleting conversation:', error)
      alert('Failed to delete conversation. Please try again.')
    }
  }

  return (
    <div className="h-[calc(100vh-100px)]">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Live Chat
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Real-time customer support conversations
        </p>
      </div>

      <div className="grid grid-cols-12 gap-4 h-[calc(100%-80px)]">
        {/* Conversation List - Left Sidebar */}
        <div className="col-span-4 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <ConversationList
            conversations={conversations}
            selectedId={selectedConversationId}
            onSelectConversation={setSelectedConversationId}
            onDeleteConversation={handleDeleteConversation}
            loading={loading}
          />
        </div>

        {/* Chat Window - Main Area */}
        <div className="col-span-8 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {selectedConversationId ? (
            <ChatWindow
              conversationId={selectedConversationId}
              onClose={() => setSelectedConversationId(null)}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  No conversation selected
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Select a conversation from the list to start chatting
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
