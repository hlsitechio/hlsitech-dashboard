'use client'

import { useState, useEffect } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'

interface TicketDetailProps {
  ticketId: string
  onClose: () => void
  onUpdateStatus: (ticketId: string, newStatus: string) => void
}

export default function TicketDetail({
  ticketId,
  onClose,
  onUpdateStatus,
}: TicketDetailProps) {
  const [ticket, setTicket] = useState<any>(null)
  const [agents, setAgents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  const supabase = getSupabaseClient()

  useEffect(() => {
    loadTicketDetails()
    loadAgents()
  }, [ticketId])

  const loadTicketDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          *,
          users (
            id,
            name,
            email,
            phone,
            avatar_url
          ),
          conversations (
            id,
            subject,
            channel
          ),
          agents (
            id,
            name,
            email
          )
        `)
        .eq('id', ticketId)
        .single()

      if (error) throw error
      setTicket(data)
    } catch (error) {
      console.error('Error loading ticket details:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadAgents = async () => {
    try {
      const { data, error } = await supabase
        .from('agents')
        .select('id, name, email, role')
        .order('name')

      if (error) throw error
      setAgents(data || [])
    } catch (error) {
      console.error('Error loading agents:', error)
    }
  }

  const handleAssignAgent = async (agentId: string | null) => {
    setUpdating(true)
    try {
      const { error } = await supabase
        .from('tickets')
        .update({
          assigned_to: agentId,
          updated_at: new Date().toISOString()
        })
        .eq('id', ticketId)

      if (error) throw error

      // Reload ticket details
      await loadTicketDetails()
    } catch (error) {
      console.error('Error assigning agent:', error)
      alert('Failed to assign agent. Please try again.')
    } finally {
      setUpdating(false)
    }
  }

  const handleUpdatePriority = async (newPriority: string) => {
    setUpdating(true)
    try {
      const { error } = await supabase
        .from('tickets')
        .update({
          priority: newPriority,
          updated_at: new Date().toISOString()
        })
        .eq('id', ticketId)

      if (error) throw error

      // Reload ticket details
      await loadTicketDetails()
    } catch (error) {
      console.error('Error updating priority:', error)
      alert('Failed to update priority. Please try again.')
    } finally {
      setUpdating(false)
    }
  }

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

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
      case 'normal':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'low':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
    }
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Ticket not found</p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Ticket #{ticket.ticket_number || ticket.id.substring(0, 8)}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Title */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {ticket.title}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
              {ticket.status.replace('_', ' ')}
            </span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityBadgeColor(ticket.priority)}`}>
              {ticket.priority.toUpperCase()}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
              {ticket.category}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Description
          </h4>
          <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            {ticket.description}
          </p>
        </div>

        {/* Customer Information */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Customer Information
          </h4>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                {ticket.users?.name?.[0]?.toUpperCase() ||
                 ticket.users?.email?.[0]?.toUpperCase() ||
                 'U'}
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {ticket.users?.name || 'Unknown User'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {ticket.users?.email}
                </p>
                {ticket.users?.phone && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {ticket.users.phone}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Assignment Section */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Assign to Agent
          </h4>
          <select
            value={ticket.assigned_to || ''}
            onChange={(e) => handleAssignAgent(e.target.value || null)}
            disabled={updating}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <option value="">Unassigned</option>
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.name} ({agent.email})
              </option>
            ))}
          </select>
          {ticket.agents && (
            <div className="mt-2 flex items-center space-x-2 text-sm text-blue-600 dark:text-blue-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Currently assigned to: {ticket.agents.name}</span>
            </div>
          )}
        </div>

        {/* Status Update Section */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Update Status
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {['open', 'in_progress', 'resolved', 'closed'].map((status) => (
              <button
                key={status}
                onClick={() => onUpdateStatus(ticketId, status)}
                disabled={ticket.status === status || updating}
                className={`px-4 py-2 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${
                  ticket.status === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Priority Update Section */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Update Priority
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {['urgent', 'high', 'normal', 'low'].map((priority) => (
              <button
                key={priority}
                onClick={() => handleUpdatePriority(priority)}
                disabled={ticket.priority === priority || updating}
                className={`px-4 py-2 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${
                  ticket.priority === priority
                    ? getPriorityBadgeColor(priority)
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {priority.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Metadata */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Additional Information
          </h4>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Created:</span>
              <span className="text-gray-900 dark:text-white">
                {new Date(ticket.created_at).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Last Updated:</span>
              <span className="text-gray-900 dark:text-white">
                {new Date(ticket.updated_at).toLocaleString()}
              </span>
            </div>
            {ticket.conversations && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Related Conversation:</span>
                <span className="text-blue-600 dark:text-blue-400">
                  {ticket.conversations.subject || 'View Conversation'}
                </span>
              </div>
            )}
            {ticket.metadata?.created_by_ai && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Created By:</span>
                <span className="text-purple-600 dark:text-purple-400">
                  🤖 AI Agent ({ticket.metadata.ai_model})
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
