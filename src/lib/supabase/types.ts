// TypeScript types generated from Supabase schema
// These types match the DATABASE_SCHEMA.sql

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar_url: string | null
          phone: string | null
          created_at: string
          updated_at: string
          last_seen_at: string | null
          metadata: Json
          is_blocked: boolean
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          avatar_url?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
          last_seen_at?: string | null
          metadata?: Json
          is_blocked?: boolean
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
          last_seen_at?: string | null
          metadata?: Json
          is_blocked?: boolean
        }
      }
      agents: {
        Row: {
          id: string
          name: string
          email: string
          avatar_url: string | null
          is_ai: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          avatar_url?: string | null
          is_ai?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          avatar_url?: string | null
          is_ai?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          user_id: string | null
          assigned_agent_id: string | null
          status: string
          priority: string
          subject: string | null
          channel: string
          created_at: string
          updated_at: string
          resolved_at: string | null
          first_response_at: string | null
          metadata: Json
        }
        Insert: {
          id?: string
          user_id?: string | null
          assigned_agent_id?: string | null
          status?: string
          priority?: string
          subject?: string | null
          channel?: string
          created_at?: string
          updated_at?: string
          resolved_at?: string | null
          first_response_at?: string | null
          metadata?: Json
        }
        Update: {
          id?: string
          user_id?: string | null
          assigned_agent_id?: string | null
          status?: string
          priority?: string
          subject?: string | null
          channel?: string
          created_at?: string
          updated_at?: string
          resolved_at?: string | null
          first_response_at?: string | null
          metadata?: Json
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_type: string
          sender_id: string | null
          content: string
          content_type: string
          attachments: Json
          created_at: string
          read_at: string | null
          metadata: Json
          ai_confidence: number | null
          ai_model: string | null
          escalation_suggested: boolean
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_type: string
          sender_id?: string | null
          content: string
          content_type?: string
          attachments?: Json
          created_at?: string
          read_at?: string | null
          metadata?: Json
          ai_confidence?: number | null
          ai_model?: string | null
          escalation_suggested?: boolean
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_type?: string
          sender_id?: string | null
          content?: string
          content_type?: string
          attachments?: Json
          created_at?: string
          read_at?: string | null
          metadata?: Json
          ai_confidence?: number | null
          ai_model?: string | null
          escalation_suggested?: boolean
        }
      }
      sessions: {
        Row: {
          id: string
          user_id: string
          conversation_id: string
          is_active: boolean
          started_at: string
          ended_at: string | null
          user_agent: string | null
          ip_address: string | null
          metadata: Json
        }
        Insert: {
          id?: string
          user_id: string
          conversation_id: string
          is_active?: boolean
          started_at?: string
          ended_at?: string | null
          user_agent?: string | null
          ip_address?: string | null
          metadata?: Json
        }
        Update: {
          id?: string
          user_id?: string
          conversation_id?: string
          is_active?: boolean
          started_at?: string
          ended_at?: string | null
          user_agent?: string | null
          ip_address?: string | null
          metadata?: Json
        }
      }
      tickets: {
        Row: {
          id: string
          ticket_number: number
          conversation_id: string | null
          user_id: string
          assigned_agent_id: string | null
          title: string
          description: string | null
          status: string
          priority: string
          category: string | null
          tags: string[]
          created_at: string
          updated_at: string
          resolved_at: string | null
          closed_at: string | null
          metadata: Json
        }
        Insert: {
          id?: string
          ticket_number?: never
          conversation_id?: string | null
          user_id: string
          assigned_agent_id?: string | null
          title: string
          description?: string | null
          status?: string
          priority?: string
          category?: string | null
          tags?: string[]
          created_at?: string
          updated_at?: string
          resolved_at?: string | null
          closed_at?: string | null
          metadata?: Json
        }
        Update: {
          id?: string
          ticket_number?: never
          conversation_id?: string | null
          user_id?: string
          assigned_agent_id?: string | null
          title?: string
          description?: string | null
          status?: string
          priority?: string
          category?: string | null
          tags?: string[]
          created_at?: string
          updated_at?: string
          resolved_at?: string | null
          closed_at?: string | null
          metadata?: Json
        }
      }
      knowledge_base: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          excerpt: string | null
          category: string | null
          tags: string[]
          is_published: boolean
          view_count: number
          helpful_count: number
          not_helpful_count: number
          created_at: string
          updated_at: string
          published_at: string | null
          author_id: string | null
          metadata: Json
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content: string
          excerpt?: string | null
          category?: string | null
          tags?: string[]
          is_published?: boolean
          view_count?: number
          helpful_count?: number
          not_helpful_count?: number
          created_at?: string
          updated_at?: string
          published_at?: string | null
          author_id?: string | null
          metadata?: Json
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: string
          excerpt?: string | null
          category?: string | null
          tags?: string[]
          is_published?: boolean
          view_count?: number
          helpful_count?: number
          not_helpful_count?: number
          created_at?: string
          updated_at?: string
          published_at?: string | null
          author_id?: string | null
          metadata?: Json
        }
      }
      canned_responses: {
        Row: {
          id: string
          title: string
          shortcut: string
          content: string
          category: string | null
          usage_count: number
          is_active: boolean
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          title: string
          shortcut: string
          content: string
          category?: string | null
          usage_count?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          title?: string
          shortcut?: string
          content?: string
          category?: string | null
          usage_count?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
      }
      analytics_events: {
        Row: {
          id: string
          event_type: string
          event_name: string
          user_id: string | null
          conversation_id: string | null
          properties: Json
          created_at: string
        }
        Insert: {
          id?: string
          event_type: string
          event_name: string
          user_id?: string | null
          conversation_id?: string | null
          properties?: Json
          created_at?: string
        }
        Update: {
          id?: string
          event_type?: string
          event_name?: string
          user_id?: string | null
          conversation_id?: string | null
          properties?: Json
          created_at?: string
        }
      }
      ai_interactions: {
        Row: {
          id: string
          message_id: string | null
          conversation_id: string | null
          model_name: string
          prompt_tokens: number | null
          completion_tokens: number | null
          total_tokens: number | null
          response_time_ms: number | null
          confidence_score: number | null
          escalated: boolean
          created_at: string
          metadata: Json
        }
        Insert: {
          id?: string
          message_id?: string | null
          conversation_id?: string | null
          model_name: string
          prompt_tokens?: number | null
          completion_tokens?: number | null
          total_tokens?: number | null
          response_time_ms?: number | null
          confidence_score?: number | null
          escalated?: boolean
          created_at?: string
          metadata?: Json
        }
        Update: {
          id?: string
          message_id?: string | null
          conversation_id?: string | null
          model_name?: string
          prompt_tokens?: number | null
          completion_tokens?: number | null
          total_tokens?: number | null
          response_time_ms?: number | null
          confidence_score?: number | null
          escalated?: boolean
          created_at?: string
          metadata?: Json
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
