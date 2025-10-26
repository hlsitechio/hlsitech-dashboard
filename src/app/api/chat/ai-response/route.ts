import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'

export async function POST(request: Request) {
  try {
    const { conversationId, userMessage } = await request.json()

    if (!conversationId || !userMessage) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Load conversation history for context
    const { data: messages } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(10) // Last 10 messages for context

    // Build context for AI
    const conversationHistory = messages
      ?.map((m) => {
        const role = m.sender_type === 'user' ? 'User' : 'Assistant'
        return `${role}: ${m.content}`
      })
      .join('\n') || ''

    // Create AI prompt
    const prompt = `You are a helpful customer support assistant for HLS iTech, an IT services company based in Montreal South Shore.

Company Information:
- Services: IT technician services, computer repair, network setup, troubleshooting
- Owner: Hubert Larose Surprenant
- Email: hlarosesurprenant@gmail.com
- Location: Montreal South Shore, Quebec

Your role:
- Be professional, friendly, and helpful
- Answer questions about IT services
- Help troubleshoot technical issues
- Schedule appointments when needed
- Escalate complex issues to human agents

Conversation History:
${conversationHistory}

User's latest message: ${userMessage}

Provide a helpful, professional response. Keep it concise and actionable.`

    // Call Google Gemini API
    const startTime = Date.now()

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Gemini API error: ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()
    const responseTime = Date.now() - startTime

    // Extract AI response
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, but I could not generate a response. Please try again or wait for a human agent to assist you.'

    // Calculate confidence (this is a simplified version - Gemini doesn't provide direct confidence scores)
    const confidence = data.candidates?.[0]?.finishReason === 'STOP' ? 0.85 : 0.60

    // Save AI message to database
    const { data: aiMessage, error: messageError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_type: 'ai',
        content: aiResponse,
        content_type: 'text',
        ai_confidence: confidence,
        ai_model: 'gemini-pro',
        escalation_suggested: confidence < 0.70,
      })
      .select()
      .single()

    if (messageError) throw messageError

    // Log AI interaction for analytics
    await supabase.from('ai_interactions').insert({
      message_id: aiMessage.id,
      conversation_id: conversationId,
      model_name: 'gemini-pro',
      response_time_ms: responseTime,
      confidence_score: confidence,
      escalated: confidence < 0.70,
      metadata: {
        finish_reason: data.candidates?.[0]?.finishReason,
        prompt_feedback: data.promptFeedback,
      },
    })

    return NextResponse.json({
      message: aiMessage,
      confidence,
      success: true,
    })
  } catch (error) {
    console.error('Error generating AI response:', error)
    return NextResponse.json(
      { error: 'Failed to generate AI response' },
      { status: 500 }
    )
  }
}
