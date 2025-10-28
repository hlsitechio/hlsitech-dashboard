'use client'

import { useState, useEffect } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'
import TicketList from './components/TicketList'
import TicketDetail from './components/TicketDetail'

export default function TicketsPage() {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const [tickets, setTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')

  const supabase = getSupabaseClient()

  // Load tickets
  useEffect(() => {
    loadTickets()

    // Subscribe to real-time ticket updates
    const ticketsSubscription = supabase
      .channel('tickets-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tickets',
        },
        () => {
          loadTickets()
        }
      )
      .subscribe()

    return () => {
      ticketsSubscription.unsubscribe()
    }
  }, [statusFilter, priorityFilter])

  const loadTickets = async () => {
    try {
      let query = supabase
        .from('tickets')
        .select(`
          *,
          users (
            id,
            name,
            email,
            avatar_url
          ),
          conversations (
            id,
            subject
          ),
          agents (
            id,
            name,
            email
          )
        `)
        .order('created_at', { ascending: false })

      // Apply filters
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter)
      }
      if (priorityFilter !== 'all') {
        query = query.eq('priority', priorityFilter)
      }

      const { data, error } = await query

      if (error) throw error
      setTickets(data || [])
    } catch (error) {
      console.error('Error loading tickets:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTicket = async (ticketId: string) => {
    try {
      const { error } = await supabase
        .from('tickets')
        .delete()
        .eq('id', ticketId)

      if (error) throw error

      // If the deleted ticket was selected, clear selection
      if (selectedTicketId === ticketId) {
        setSelectedTicketId(null)
      }

      // Reload tickets
      loadTickets()
    } catch (error) {
      console.error('Error deleting ticket:', error)
      alert('Failed to delete ticket. Please try again.')
    }
  }

  const handleUpdateTicketStatus = async (ticketId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('tickets')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', ticketId)

      if (error) throw error

      // Reload tickets
      loadTickets()
    } catch (error) {
      console.error('Error updating ticket status:', error)
      alert('Failed to update ticket status. Please try again.')
    }
  }

  // Calculate statistics
  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    urgent: tickets.filter(t => t.priority === 'urgent').length,
    high: tickets.filter(t => t.priority === 'high').length,
  }

  return (
    <div className="h-[calc(100vh-100px)]">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Support Tickets
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Track and manage customer support tickets
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-2 border-blue-200 dark:border-blue-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">Open</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.open}</p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border-2 border-yellow-200 dark:border-yellow-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.inProgress}</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border-2 border-green-200 dark:border-green-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">Resolved</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.resolved}</p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border-2 border-red-200 dark:border-red-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">Urgent</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.urgent}</p>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border-2 border-orange-200 dark:border-orange-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">High Priority</p>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.high}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-600">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Priority
          </label>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Ticket List and Detail View */}
      <div className="grid grid-cols-12 gap-4 h-[calc(100%-280px)]">
        {/* Ticket List - Left Sidebar */}
        <div className="col-span-5 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <TicketList
            tickets={tickets}
            selectedId={selectedTicketId}
            onSelectTicket={setSelectedTicketId}
            onDeleteTicket={handleDeleteTicket}
            loading={loading}
          />
        </div>

        {/* Ticket Detail - Main Area */}
        <div className="col-span-7 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {selectedTicketId ? (
            <TicketDetail
              ticketId={selectedTicketId}
              onClose={() => setSelectedTicketId(null)}
              onUpdateStatus={handleUpdateTicketStatus}
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  No ticket selected
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Select a ticket from the list to view details
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
