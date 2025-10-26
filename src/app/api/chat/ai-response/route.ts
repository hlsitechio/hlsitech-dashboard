import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent'

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
        const role = m.sender_type === 'user' ? 'Customer' : 'Support Agent'
        return `${role}: ${m.content}`
      })
      .join('\n') || ''

    // Create specialized IT Support AI prompt
    const systemPrompt = `You are an IT Support AI Agent for HLS iTech, a professional IT services company in Montreal South Shore, Quebec.

COMPANY INFORMATION:
- Name: HLS iTech
- Owner: Hubert Larose Surprenant
- Location: Montreal South Shore, Quebec, Canada
- Email: hlarosesurprenant@gmail.com
- Services: IT technician services, computer repair, network setup, server maintenance, troubleshooting, cybersecurity, cloud solutions

YOUR ROLE - IT SUPPORT AGENT ONLY:
You are a specialized IT support agent. You ONLY handle IT-related inquiries.

WHAT YOU CAN HELP WITH:
✅ Computer problems (hardware, software)
✅ Network issues (WiFi, ethernet, routers, switches)
✅ Server setup and maintenance
✅ Software installation and troubleshooting
✅ Printer and peripheral issues
✅ Email configuration (Outlook, Gmail, etc.)
✅ Cybersecurity concerns and advice
✅ Data backup and recovery
✅ Remote desktop and VPN setup
✅ Windows, Mac, and Linux support
✅ IT service quotes and scheduling
✅ Business IT infrastructure

WHAT YOU CANNOT HELP WITH:
❌ Weather information
❌ General knowledge questions
❌ News or current events
❌ Entertainment or media
❌ Personal advice unrelated to IT
❌ Any non-IT topics

RESPONSE GUIDELINES:
1. Be professional, technical, and helpful
2. Provide step-by-step troubleshooting when needed
3. Ask clarifying questions about the technical issue
4. Suggest when to escalate to Hubert for on-site visits
5. Provide accurate IT technical information
6. If asked about non-IT topics, politely redirect: "I'm specialized in IT support only. For this question, please contact our support team directly at hlarosesurprenant@gmail.com"

TONE:
- Professional and knowledgeable
- Patient and clear
- Technical but accessible
- Solution-oriented

ESCALATION:
Suggest human agent escalation for:
- Complex network infrastructure setup
- On-site hardware repairs
- Business IT consulting
- Custom server configurations
- Emergency IT situations`

    const userPrompt = `${conversationHistory ? 'Conversation History:\n' + conversationHistory + '\n\n' : ''}Customer's Current Message: ${userMessage}

Provide a helpful IT support response. Stay within your IT support scope. Be concise and actionable.`

    // Call Google Gemini 2.0 Flash API
    const startTime = Date.now()

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [
            {
              text: systemPrompt,
            },
          ],
        },
        contents: [
          {
            parts: [
              {
                text: userPrompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.4, // Lower temperature for more consistent IT support responses
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
        ],
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Gemini API error:', errorData)
      throw new Error(`Gemini API error: ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()
    const responseTime = Date.now() - startTime

    // Extract AI response
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text ||
      'I apologize, but I encountered an issue generating a response. Please wait for our IT support team to assist you, or contact us directly at hlarosesurprenant@gmail.com.'

    // Calculate confidence based on finish reason and safety ratings
    const finishReason = data.candidates?.[0]?.finishReason
    const safetyRatings = data.candidates?.[0]?.safetyRatings || []

    let confidence = 0.85 // Default confidence

    if (finishReason === 'STOP') {
      confidence = 0.90 // High confidence for normal completion
    } else if (finishReason === 'MAX_TOKENS') {
      confidence = 0.75 // Medium confidence if truncated
    } else {
      confidence = 0.60 // Lower confidence for other reasons
    }

    // Check if response seems off-topic (non-IT)
    const offTopicKeywords = ['weather', 'temperature', 'forecast', 'movie', 'music', 'recipe', 'cooking']
    const isLikelyOffTopic = offTopicKeywords.some(keyword =>
      userMessage.toLowerCase().includes(keyword) &&
      !['server temperature', 'cpu temperature'].some(tech => userMessage.toLowerCase().includes(tech))
    )

    if (isLikelyOffTopic) {
      confidence = 0.50 // Low confidence for off-topic questions
    }

    // Save AI message to database
    const { data: aiMessage, error: messageError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_type: 'ai',
        content: aiResponse,
        content_type: 'text',
        ai_confidence: confidence,
        ai_model: 'gemini-2.0-flash-exp',
        escalation_suggested: confidence < 0.70,
      })
      .select()
      .single()

    if (messageError) {
      console.error('Error saving AI message:', messageError)
      throw messageError
    }

    // Log AI interaction for analytics
    await supabase.from('ai_interactions').insert({
      message_id: aiMessage.id,
      conversation_id: conversationId,
      model_name: 'gemini-2.0-flash-exp',
      response_time_ms: responseTime,
      confidence_score: confidence,
      escalated: confidence < 0.70,
      metadata: {
        finish_reason: finishReason,
        safety_ratings: safetyRatings,
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

    // Try to save error message to conversation
    try {
      const { conversationId } = await request.json()
      await supabase.from('messages').insert({
        conversation_id: conversationId,
        sender_type: 'system',
        content: 'An error occurred with the AI assistant. A human support agent will respond shortly.',
        content_type: 'text',
      })
    } catch (e) {
      console.error('Failed to save error message:', e)
    }

    return NextResponse.json(
      { error: 'Failed to generate AI response', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
