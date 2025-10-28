'use client'

import { formatDistanceToNow } from '@/lib/utils/date'

interface TicketListProps {
  tickets: any[]
  selectedId: string | null
  onSelectTicket: (id: string) => void
  onDeleteTicket: (id: string) => void
  loading: boolean
}

export default function TicketList({
  tickets,
  selectedId,
  onSelectTicket,
  onDeleteTicket,
  loading,
}: TicketListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'closed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 dark:text-red-400 font-bold'
      case 'high':
        return 'text-orange-600 dark:text-orange-400 font-bold'
      case 'normal':
        return 'text-blue-600 dark:text-blue-400'
      case 'low':
        return 'text-gray-600 dark:text-gray-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getPriorityEmoji = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return '🔴'
      case 'high':
        return '🟠'
      case 'normal':
        return '🟢'
      case 'low':
        return '⚪'
      default:
        return '🟢'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'hardware':
        return '🖥️'
      case 'software':
        return '💾'
      case 'network':
        return '🌐'
      case 'server':
        return '🖧'
      case 'security':
        return '🔒'
      default:
        return '🎫'
    }
  }

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  if (tickets.length === 0) {
    return (
      <div className="p-6 text-center">
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
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p className="text-gray-500 dark:text-gray-400 mt-4">No tickets yet</p>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <h2 className="font-semibold text-gray-900 dark:text-white">
          Tickets ({tickets.length})
        </h2>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className={`relative group w-full p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer ${
              selectedId === ticket.id
                ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600'
                : ''
            }`}
          >
            {/* Delete Button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (confirm(`Delete ticket "${ticket.title}"?`)) {
                  onDeleteTicket(ticket.id)
                }
              }}
              className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity z-10"
              title="Delete ticket"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Ticket Content - Clickable */}
            <button
              onClick={() => onSelectTicket(ticket.id)}
              className="w-full text-left"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{getCategoryIcon(ticket.category)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        #{ticket.ticket_number || ticket.id.substring(0, 8)}
                      </span>
                      <span className={getPriorityColor(ticket.priority)}>
                        {getPriorityEmoji(ticket.priority)}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1 line-clamp-2">
                      {ticket.title}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
                    {ticket.users?.name?.[0]?.toUpperCase() ||
                     ticket.users?.email?.[0]?.toUpperCase() ||
                     'U'}
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {ticket.users?.name || ticket.users?.email || 'Unknown'}
                  </span>
                </div>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(
                    ticket.status
                  )}`}
                >
                  {ticket.status.replace('_', ' ')}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400 capitalize">
                  {ticket.category}
                </span>
                {ticket.agents && (
                  <span className="text-blue-600 dark:text-blue-400">
                    👤 {ticket.agents.name}
                  </span>
                )}
                <span className="text-gray-400 dark:text-gray-500">
                  {formatDistanceToNow(ticket.created_at)}
                </span>
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
