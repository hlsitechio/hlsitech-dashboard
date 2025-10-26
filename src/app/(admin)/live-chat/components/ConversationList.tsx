'use client'

import { formatDistanceToNow } from '@/lib/utils/date'

interface ConversationListProps {
  conversations: any[]
  selectedId: string | null
  onSelectConversation: (id: string) => void
  loading: boolean
}

export default function ConversationList({
  conversations,
  selectedId,
  onSelectConversation,
  loading,
}: ConversationListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800'
      case 'assigned':
        return 'bg-blue-100 text-blue-800'
      case 'resolved':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600'
      case 'high':
        return 'text-orange-600'
      case 'normal':
        return 'text-blue-600'
      case 'low':
        return 'text-gray-600'
      default:
        return 'text-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  if (conversations.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">No conversations yet</p>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="font-semibold text-gray-900 dark:text-white">
          Conversations ({conversations.length})
        </h2>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {conversations.map((conversation) => (
          <button
            key={conversation.id}
            onClick={() => onSelectConversation(conversation.id)}
            className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition ${
              selectedId === conversation.id
                ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600'
                : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {conversation.users?.name?.[0]?.toUpperCase() ||
                     conversation.users?.email?.[0]?.toUpperCase() ||
                     'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {conversation.users?.name || conversation.users?.email || 'Unknown User'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {conversation.subject || 'No subject'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="ml-2 flex flex-col items-end space-y-1">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(
                    conversation.status
                  )}`}
                >
                  {conversation.status}
                </span>
                {conversation.priority && conversation.priority !== 'normal' && (
                  <span className={`text-xs font-medium ${getPriorityColor(conversation.priority)}`}>
                    {conversation.priority}
                  </span>
                )}
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {conversation.channel || 'chat'}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {formatDistanceToNow(conversation.updated_at)}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
