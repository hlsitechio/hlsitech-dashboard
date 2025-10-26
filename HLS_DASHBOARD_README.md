# HLS iTech Customer Support Dashboard

## Project Overview
Custom customer support dashboard for hlsitech.com with real-time chat, AI chatbot management, and agent takeover capabilities.

## Tech Stack

### Foundation (Already Configured)
- **Framework:** Next.js 15.2.3 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** TailAdmin (pre-built admin components)
- **React:** v19

### To Be Added
- **Real-time Communication:** Socket.io
- **Database:** PostgreSQL (Supabase or Neon)
- **Authentication:** NextAuth.js
- **State Management:** React Context + Hooks
- **API Integration:** REST API for hlsitech.com chatbot

## Current Features (TailAdmin Base)
✅ Modern admin dashboard layout
✅ Responsive sidebar navigation
✅ Pre-built components: Tables, Forms, Charts, Buttons, Modals
✅ Authentication UI (Sign in/Sign up pages)
✅ Dark mode support
✅ Calendar component
✅ Profile pages
✅ E-commerce templates

## Features To Build

### Phase 1: Database & Authentication (Week 1)
- [ ] Set up PostgreSQL database (Supabase)
- [ ] Create database schema:
  - `customers` table
  - `conversations` table
  - `messages` table
  - `agents` table
- [ ] Implement NextAuth authentication
- [ ] Create login system for support agents

### Phase 2: Real-time Chat (Week 1-2)
- [ ] Install and configure Socket.io
- [ ] Build customer conversation list
- [ ] Build real-time chat interface
- [ ] Implement message history
- [ ] Add typing indicators
- [ ] Add online/offline status

### Phase 3: Chatbot Integration (Week 2)
- [ ] Connect to hlsitech.com chatbot API
- [ ] Display customer-AI conversations
- [ ] Show AI-generated responses
- [ ] Track conversation metadata

### Phase 4: AI Control Panel (Week 3)
- [ ] AI toggle (enable/disable AI responses)
- [ ] Agent takeover button
- [ ] Canned responses
- [ ] Conversation assignment
- [ ] Email notification integration

### Phase 5: Polish & Deploy (Week 3-4)
- [ ] Mobile responsive design
- [ ] Performance optimization
- [ ] Deploy to Netlify/Vercel
- [ ] Set up production database
- [ ] Configure environment variables

## Project Structure
```
dashboard/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (admin)/           # Admin dashboard routes
│   │   └── (full-width-pages)/ # Auth & error pages
│   ├── components/            # Reusable components
│   │   ├── auth/             # Authentication components
│   │   ├── charts/           # Chart components
│   │   ├── common/           # Shared components
│   │   ├── form/             # Form components
│   │   ├── tables/           # Table components
│   │   └── ui/               # UI elements
│   ├── context/              # React Context providers
│   ├── hooks/                # Custom React hooks
│   ├── layout/               # Layout components
│   └── icons/                # SVG icons
├── public/                    # Static assets
└── package.json
```

## Getting Started

### Install Dependencies
```bash
cd G:\hlsitechbusinesscard\dashboard
npm install
```

### Run Development Server
```bash
npm run dev
```

Dashboard will be available at: **http://localhost:3000**

### Build for Production
```bash
npm run build
npm start
```

## Environment Variables (To Be Added)
Create `.env.local` file:
```env
# Database
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# hlsitech.com Integration
HLSITECH_API_URL=https://hlsitech.com/api
GEMINI_API_KEY=AIzaSyBJ0MT3q-ro7JaXcWsll3C8SF0mbwSIois

# Email Notifications
RESEND_API_KEY=re_RhSExPm4_75mZUNFfD2Uw52jEwontYjH1
NOTIFICATION_EMAIL=hlarosesurprenant@gmail.com

# Socket.io (Production)
SOCKET_URL=wss://your-socket-server.com
```

## Integration with hlsitech.com

### Current hlsitech.com Setup
- **Live chatbot:** https://hlsitech.com
- **AI Model:** Google Gemini 2.5 Pro
- **Edge Function:** `netlify/edge-functions/gemini-chat.ts`
- **Email Notifications:** Resend API

### Dashboard Integration Points
1. **Webhook Endpoint:** Dashboard will expose `/api/chatbot-webhook` to receive new customer chats
2. **Message Sync:** Real-time sync between website chat and dashboard
3. **Agent Responses:** Messages sent from dashboard appear in website chat
4. **Session Management:** Unique session IDs for each customer

## Database Schema (Planned)

### Customers Table
```sql
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  first_contact_at TIMESTAMP DEFAULT NOW(),
  last_message_at TIMESTAMP,
  total_conversations INT DEFAULT 0,
  metadata JSONB
);
```

### Conversations Table
```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id),
  status VARCHAR(50) DEFAULT 'active', -- active, resolved, waiting
  assigned_agent_id UUID,
  ai_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  metadata JSONB
);
```

### Messages Table
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id),
  sender_type VARCHAR(50) NOT NULL, -- customer, ai, agent
  sender_name VARCHAR(255),
  content TEXT NOT NULL,
  sent_at TIMESTAMP DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE,
  metadata JSONB
);
```

## Next Steps
1. ✅ Clone TailAdmin template
2. ✅ Install dependencies
3. ✅ Verify dashboard runs locally
4. 📝 Set up PostgreSQL database (Supabase)
5. 📝 Create database tables
6. 📝 Add Socket.io for real-time chat
7. 📝 Build conversation list page
8. 📝 Build chat interface
9. 📝 Integrate with hlsitech.com

## Developer Notes
- **Port:** Dashboard runs on port 3000
- **hlsitech.com:** Runs on Netlify
- **Database:** Will use Supabase for PostgreSQL + real-time subscriptions
- **Deployment:** Netlify or Vercel for Next.js hosting

---

**Created:** 2025-10-25
**Developer:** Claude Code + Hubert
**Company:** HLS iTech
