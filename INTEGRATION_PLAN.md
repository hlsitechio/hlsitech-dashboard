# HLSitech Dashboard Integration Plan

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        hlsitech.com                              │
│  ┌────────────────┐              ┌──────────────────┐           │
│  │  Public Site   │              │  Chat Widget     │           │
│  │  (Vite/React)  │              │  (Gemini 2.5)    │           │
│  └────────────────┘              └──────────────────┘           │
│         │                                 │                      │
│         │                                 ▼                      │
│         │                    ┌────────────────────┐             │
│         │                    │  Netlify Edge      │             │
│         │                    │  Functions         │             │
│         │                    │  /gemini-chat      │             │
│         │                    └────────────────────┘             │
│         │                                 │                      │
└─────────┼─────────────────────────────────┼──────────────────────┘
          │                                 │
          │                                 ▼
          │                    ┌────────────────────┐
          │                    │    Supabase Pro    │
          │                    │   (PostgreSQL)     │
          │                    │  - conversations   │
          │                    │  - messages        │
          │                    │  - users           │
          │                    │  - ai_interactions │
          │                    └────────────────────┘
          │                                 ▲
          │                                 │
          ▼                                 │
┌─────────────────────────────────────────────┐
│     dashboard.hlsitech.com (Private)        │
│  ┌──────────────────────────────────────┐  │
│  │   Customer Support Dashboard          │  │
│  │   (Next.js 15 - Netlify)             │  │
│  │                                       │  │
│  │  - Live Chat Management              │  │
│  │  - Conversation History              │  │
│  │  - AI Performance Metrics            │  │
│  │  - Knowledge Base Editor             │  │
│  │                                       │  │
│  │  Protected by: Netlify Auth          │  │
│  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────┐
│         External Services                   │
│  - Resend (Email notifications)            │
│  - Google Gemini 2.5 Pro (AI)              │
│  - Google Analytics (Website metrics)      │
└─────────────────────────────────────────────┘
```

---

## Deployment Options

### Option 1: Separate Netlify Site (Recommended)
**URL:** `dashboard.hlsitech.com` or `support.hlsitech.com`

**Pros:**
- Completely isolated from public site
- Independent deployments
- Easier to secure
- Better performance
- Can use Netlify Auth

**Cons:**
- Need to configure custom subdomain
- Separate site management

### Option 2: Integrated Path
**URL:** `hlsitech.com/dashboard`

**Pros:**
- Single domain
- Unified deployment

**Cons:**
- More complex routing
- Harder to secure
- May conflict with public site

**Recommendation:** Use Option 1 (separate subdomain)

---

## Step-by-Step Integration Guide

## Phase 1: Prepare Dashboard for Deployment

### 1.1 Add Netlify Configuration

Create `netlify.toml` in dashboard directory:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "20"

# Redirect all requests to Next.js
[[redirects]]
  from = "/*"
  to = "/.netlify/functions/___netlify-handler"
  status = 200

# Security headers
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

### 1.2 Update next.config.js for Netlify

Add to `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['ggppnyylqpjqutzbdhmm.supabase.co'],
    unoptimized: process.env.NODE_ENV === 'production',
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['hlsitech.com', 'dashboard.hlsitech.com']
    }
  }
}

module.exports = nextConfig
```

### 1.3 Create .gitignore

Ensure sensitive files are not committed:

```
.env*.local
.env.production
.next/
node_modules/
.DS_Store
*.log
```

---

## Phase 2: Netlify Deployment

### 2.1 Create New Netlify Site

```bash
# Using Netlify CLI
netlify init

# Or manual steps:
# 1. Go to Netlify dashboard
# 2. Click "Add new site" → "Import an existing project"
# 3. Connect to GitHub repo
# 4. Select G:\hlsitechbusinesscard\dashboard
```

### 2.2 Configure Environment Variables in Netlify

Go to Site Settings → Environment Variables and add:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ggppnyylqpjqutzbdhmm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SUPABASE_STORAGE_URL=https://ggppnyylqpjqutzbdhmm.storage.supabase.co/storage/v1/s3
NEXT_PUBLIC_SUPABASE_REGION=ca-central-1
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_S3_ACCESS_KEY_ID=c035189dc6aab8a27ac9612615701d16
SUPABASE_S3_SECRET_ACCESS_KEY=e4e4b37baf70e49b86e6cdd586e97c135856a3ebb4fa65a09b774873a919d842
SUPABASE_ACCESS_TOKEN=sbp_92cc3fc10a6c84cebab2a5f8660f5c04a03211ee

# AI Configuration
GEMINI_API_KEY=AIzaSyBJ0MT3q-ro7JaXcWsll3C8SF0mbwSIois

# Email Configuration
RESEND_API_KEY=re_RhSExPm4_75mZUNFfD2Uw52jEwontYjH1
SUPPORT_EMAIL=hlarosesurprenant@gmail.com

# Application Configuration
NEXT_PUBLIC_APP_URL=https://dashboard.hlsitech.com
NODE_ENV=production
```

### 2.3 Configure Custom Domain

**In Netlify:**
1. Go to Site Settings → Domain Management
2. Click "Add custom domain"
3. Enter: `dashboard.hlsitech.com`
4. Netlify will provide DNS records

**In Your Domain Registrar:**
Add these DNS records:
```
Type: CNAME
Name: dashboard
Value: [your-site-name].netlify.app
TTL: 3600
```

### 2.4 Enable HTTPS

Netlify automatically provisions SSL certificates via Let's Encrypt.
- Enable "Force HTTPS" in Site Settings → Domain Management

---

## Phase 3: Dashboard Authentication (Private Access)

### Option A: Netlify Password Protection (Simplest)

**In Netlify Dashboard:**
1. Go to Site Settings → Visitor Access
2. Enable "Password Protection"
3. Set password for dashboard access
4. Only you will have the password

### Option B: Supabase Auth (More Robust)

**Implement email/password authentication:**

1. Enable Email Auth in Supabase Dashboard
2. Create auth pages in dashboard (`/login`, `/signup`)
3. Add Hubert's email to allowed users
4. Middleware to protect all routes

**Example middleware:**

```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Create Supabase client
  const response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options })
        },
      },
    }
  )

  // Check auth
  const { data: { user } } = await supabase.auth.getUser()

  // Redirect to login if not authenticated
  if (!user && !request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|login).*)']
}
```

**Recommendation:** Start with Netlify Password Protection, migrate to Supabase Auth later if needed.

---

## Phase 4: Connect Website Chatbot to Supabase

### 4.1 Update Netlify Edge Function

Modify existing `netlify/edge-functions/gemini-chat.ts` in hlsitech.com:

```typescript
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('NEXT_PUBLIC_SUPABASE_URL')!
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseKey)

export default async (request: Request) => {
  // Parse message from chat widget
  const { message, userId, conversationId, userName } = await request.json()

  try {
    // 1. Get or create user
    let user = await supabase
      .from('users')
      .select('*')
      .eq('email', userId)
      .single()

    if (!user.data) {
      const { data: newUser } = await supabase
        .from('users')
        .insert({ email: userId, name: userName })
        .select()
        .single()
      user = { data: newUser }
    }

    // 2. Get or create conversation
    let conversation
    if (conversationId) {
      conversation = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .single()
    } else {
      const { data: newConv } = await supabase
        .from('conversations')
        .insert({
          user_id: user.data.id,
          channel: 'chat',
          status: 'open'
        })
        .select()
        .single()
      conversation = { data: newConv }
    }

    // 3. Save user message
    await supabase
      .from('messages')
      .insert({
        conversation_id: conversation.data.id,
        sender_type: 'user',
        sender_id: user.data.id,
        content: message
      })

    // 4. Call Gemini AI
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${Deno.env.get('GEMINI_API_KEY')}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }]
        })
      }
    )

    const aiResponse = await geminiResponse.json()
    const reply = aiResponse.candidates[0].content.parts[0].text

    // 5. Save AI message
    const { data: aiMessage } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversation.data.id,
        sender_type: 'ai',
        content: reply,
        ai_model: 'gemini-2.0-flash-exp',
        ai_confidence: 0.95
      })
      .select()
      .single()

    // 6. Track AI interaction
    await supabase
      .from('ai_interactions')
      .insert({
        message_id: aiMessage.id,
        conversation_id: conversation.data.id,
        model_name: 'gemini-2.0-flash-exp',
        response_time_ms: 500, // Calculate actual time
        confidence_score: 0.95
      })

    // 7. Send email notification if escalation needed
    if (needsEscalation(message)) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'AI Assistant <ai@hlsitech.com>',
          to: 'hlarosesurprenant@gmail.com',
          subject: `New Support Request: ${userName}`,
          html: `<p>Message: ${message}</p><p>Reply: ${reply}</p>`
        })
      })
    }

    return new Response(JSON.stringify({
      reply,
      conversationId: conversation.data.id,
      messageId: aiMessage.id
    }), {
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

function needsEscalation(message: string): boolean {
  const escalationKeywords = ['urgent', 'emergency', 'critical', 'broken', 'not working']
  return escalationKeywords.some(keyword => message.toLowerCase().includes(keyword))
}
```

### 4.2 Add Environment Variables to hlsitech.com Netlify Site

In hlsitech.com Netlify settings, add:
```env
NEXT_PUBLIC_SUPABASE_URL=https://ggppnyylqpjqutzbdhmm.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Phase 5: Configure CORS and Security

### 5.1 Update Supabase CORS Settings

In Supabase Dashboard → Settings → API:

**Allowed Origins:**
```
https://hlsitech.com
https://dashboard.hlsitech.com
http://localhost:3000
```

### 5.2 Configure RLS Policies

Update Row Level Security policies in Supabase:

```sql
-- Allow public to insert users (from chat widget)
CREATE POLICY "Public can create users" ON public.users
  FOR INSERT WITH CHECK (true);

-- Allow public to insert conversations
CREATE POLICY "Public can create conversations" ON public.conversations
  FOR INSERT WITH CHECK (true);

-- Allow public to insert messages
CREATE POLICY "Public can create messages" ON public.messages
  FOR INSERT WITH CHECK (true);

-- Dashboard (authenticated users) can read everything
CREATE POLICY "Authenticated can read all" ON public.users
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can read conversations" ON public.conversations
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can read messages" ON public.messages
  FOR SELECT USING (auth.role() = 'authenticated');
```

---

## Phase 6: Deploy and Test

### 6.1 Deployment Checklist

Dashboard:
- [ ] Code pushed to GitHub
- [ ] Netlify site created
- [ ] Environment variables configured
- [ ] Custom domain configured (dashboard.hlsitech.com)
- [ ] HTTPS enabled
- [ ] Password protection enabled

Website:
- [ ] Edge function updated with Supabase integration
- [ ] Environment variables added
- [ ] Redeployed

Supabase:
- [ ] Database schema run
- [ ] Realtime enabled
- [ ] RLS policies configured
- [ ] CORS configured

### 6.2 Testing Flow

1. **Test Chat Widget → Supabase:**
   - Go to hlsitech.com
   - Send message in chat widget
   - Verify message appears in Supabase `messages` table
   - Verify conversation created in `conversations` table
   - Verify user created in `users` table

2. **Test Dashboard → Supabase:**
   - Go to dashboard.hlsitech.com
   - Login with password
   - Verify you can see conversations
   - Verify you can see messages in real-time
   - Test sending replies

3. **Test Real-time Updates:**
   - Open dashboard
   - Send message from website chat
   - Verify message appears instantly in dashboard

---

## Integration Benefits

Once integrated:

✅ **Unified Data:** All chat conversations stored in one place (Supabase)

✅ **Real-time Monitoring:** See customer messages instantly in dashboard

✅ **Historical Context:** View entire conversation history

✅ **AI Performance Tracking:** Monitor AI response quality and confidence

✅ **Quick Responses:** Reply to customers directly from dashboard

✅ **Analytics:** Track response times, resolution rates, customer satisfaction

✅ **Scalability:** Handle unlimited conversations with Supabase Pro

✅ **Security:** Private dashboard + RLS policies + password protection

---

## Cost Estimate

### Netlify
- Dashboard hosting: **Free** (Starter plan)
- Build minutes: **300/month free**
- Bandwidth: **100 GB/month free**

### Supabase Pro (Already have)
- Database: **Included**
- Storage: **100 GB included**
- Realtime: **Included**
- Bandwidth: **250 GB included**

### Total Additional Cost: **$0** (using existing resources)

---

## Next Steps

1. **Immediate:**
   - Run DATABASE_SCHEMA.sql in Supabase
   - Enable Realtime for messages, conversations, sessions

2. **Deploy Dashboard (1 hour):**
   - Create netlify.toml
   - Push to GitHub
   - Configure Netlify site
   - Set up custom domain

3. **Integrate Chatbot (30 minutes):**
   - Update edge function with Supabase code
   - Add environment variables
   - Redeploy hlsitech.com

4. **Test Integration (30 minutes):**
   - Send test messages
   - Verify real-time updates
   - Check database entries

**Total Time: ~2 hours to full integration**

---

## Support Resources

- [Netlify Next.js Deployment](https://docs.netlify.com/frameworks/next-js/)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)
- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/overview/)
- [Supabase RLS Policies](https://supabase.com/docs/guides/auth/row-level-security)
