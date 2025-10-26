import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const { conversationId, content, senderType, senderId } = await request.json()

    if (!conversationId || !content || !senderType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Insert message
    const { data: message, error: messageError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_type: senderType,
        sender_id: senderId,
        content: content.trim(),
        content_type: 'text',
      })
      .select()
      .single()

    if (messageError) throw messageError

    // Update conversation updated_at
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId)

    // If this is a user message, trigger AI response
    if (senderType === 'user') {
      // Trigger AI response in the background (don't await)
      fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/chat/ai-response`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId,
          userMessage: content,
        }),
      }).catch((error) => {
        console.error('Failed to trigger AI response:', error)
      })
    }

    return NextResponse.json({ message, success: true })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
