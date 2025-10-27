# Pre-Deployment Setup Guide for HLS iTech Dashboard

## Overview
This guide walks you through setting up your Supabase database and Netlify environment before testing the live chat integration.

---

## ✅ Step 1: Execute Database Schema

### Instructions:
1. Go to: https://supabase.com/dashboard/project/ggppnyylqpjqutzbdhmm/sql/new
2. Open the file `DATABASE_SCHEMA.sql` in this directory
3. Copy the entire contents
4. Paste into the Supabase SQL Editor
5. Click **Run** to execute

### What this creates:
- ✅ 10 database tables: users, agents, conversations, messages, sessions, tickets, knowledge_base, canned_responses, analytics_events, ai_interactions
- ✅ Row-Level Security (RLS) policies
- ✅ Indexes for performance
- ✅ Triggers for updated_at timestamps
- ✅ Default agents (HLS iTech Support, AI Assistant)

### Expected result:
You should see "Success. No rows returned" if everything is created successfully.

---

## ✅ Step 2: Execute Storage Buckets Setup

### Instructions:
1. Stay in the SQL Editor at: https://supabase.com/dashboard/project/ggppnyylqpjqutzbdhmm/sql/new
2. Open the file `STORAGE_BUCKETS.sql` in this directory
3. Copy the entire contents
4. Paste into a new SQL query
5. Click **Run** to execute

### What this creates:
- ✅ **chat-attachments** bucket (private, 10MB limit) - for chat files
- ✅ **avatars** bucket (public, 2MB limit) - for profile pictures
- ✅ **knowledge-base** bucket (public, 50MB limit) - for help articles
- ✅ **dashboard-images** bucket (public, 10MB limit) - for dashboard assets

### Verify buckets:
1. Go to: https://supabase.com/dashboard/project/ggppnyylqpjqutzbdhmm/storage/buckets
2. You should see all 4 buckets listed

---

## ✅ Step 3: Enable Supabase Realtime

Real-time subscriptions allow the dashboard to receive live updates when new messages arrive.

### Instructions:
1. Go to: https://supabase.com/dashboard/project/ggppnyylqpjqutzbdhmm/database/replication
2. Find the following tables and enable replication for each:
   - ✅ **conversations**
   - ✅ **messages**
   - ✅ **sessions**
3. Click **Save** after enabling each table

### Why this is needed:
Real-time replication allows the dashboard to subscribe to database changes and update the UI instantly when:
- New conversations are created
- New messages are sent
- Conversation status changes

---

## ✅ Step 4: Create Admin User

### Instructions:
1. Go to: https://supabase.com/dashboard/project/ggppnyylqpjqutzbdhmm/auth/users
2. Click **Add user** → **Create new user**
3. Fill in the form:
   - **Email:** `info@hlsitech.com`
   - **Password:** `Wintersun6?6`
   - **✅ Check "Auto Confirm User"** (important!)
4. Click **Create user**

### Verify:
You should see the user listed with status "Confirmed" and a green checkmark.

---

## ✅ Step 5: Configure Netlify Environment Variables (Website)

The website chat uses a Netlify Edge Function that needs Supabase credentials.

### Instructions:
1. Go to: https://app.netlify.com/sites/hlsitech/settings/env
2. Add the following environment variables:

| Variable Name | Value | Context |
|--------------|-------|---------|
| `SUPABASE_URL` | `https://ggppnyylqpjqutzbdhmm.supabase.co` | All |
| `SUPABASE_SERVICE_ROLE_KEY` | (copy from `.env.local`) | All |
| `GEMINI_API_KEY` | (copy from `.env.local`) | All |
| `RESEND_API_KEY` | (copy from `.env.local`) | All |

3. Click **Save** after adding each variable

### Get values from:
- Open `dashboard/.env.local` to find all the keys

### Verify:
After adding, you should see all 4 variables listed.

---

## ✅ Step 6: Redeploy Website (if needed)

If you added new environment variables in Step 5, redeploy the website to apply them.

### Instructions:
```bash
cd G:\hlsitechbusinesscard\hlsitech.com
git add .
git commit -m "Add Netlify environment variables"
git push origin main2
```

Alternatively, trigger a manual deploy:
1. Go to: https://app.netlify.com/sites/hlsitech/deploys
2. Click **Trigger deploy** → **Deploy site**

---

## 🧪 Testing Checklist

Once all setup steps are complete, proceed with testing:

### Test 1: Dashboard Login
1. Go to: https://hlsitech-dashboard.netlify.app/login
2. Login with:
   - Email: `info@hlsitech.com`
   - Password: `Wintersun6?6`
3. ✅ Expected: Successfully login and see the dashboard

### Test 2: Live Chat Tab Access
1. Click **Live Chat** in the sidebar
2. ✅ Expected: See empty conversation list with message "No conversations yet"

### Test 3: Website Chat → Database Flow
1. Open website: https://hlsitech.com
2. Click the blue chat bubble in bottom-right corner
3. Send a test message: "Hello, I need help with my computer"
4. Wait for AI response
5. Go back to dashboard Live Chat tab
6. ✅ Expected: See the new conversation appear in the list

### Test 4: Dashboard Response → Website Flow
1. In dashboard, click on the conversation
2. Type a response: "Hi! I'm here to help. What seems to be the issue?"
3. Click Send
4. Go back to website chat
5. ✅ Expected: See your response appear in the chat widget

### Test 5: Real-Time Updates
1. Have dashboard Live Chat open
2. In another browser tab/window, send a message from the website
3. ✅ Expected: Message appears instantly in dashboard without refresh

---

## 📊 Monitoring

### View Conversations in Database:
```sql
SELECT * FROM conversations ORDER BY created_at DESC;
```

### View Messages:
```sql
SELECT m.*, c.subject, u.name as user_name
FROM messages m
JOIN conversations c ON m.conversation_id = c.id
JOIN users u ON c.user_id = u.id
ORDER BY m.created_at DESC
LIMIT 20;
```

### View AI Interactions:
```sql
SELECT * FROM ai_interactions ORDER BY created_at DESC LIMIT 10;
```

---

## 🚨 Troubleshooting

### Issue: Can't login to dashboard
- **Check:** Did you create the user with "Auto Confirm User" checked?
- **Check:** Is the email exactly `info@hlsitech.com`?
- **Check:** Try resetting the password in Supabase Auth Users

### Issue: No conversations appearing in dashboard
- **Check:** Did you execute DATABASE_SCHEMA.sql?
- **Check:** Is Realtime replication enabled for conversations table?
- **Check:** Open browser console (F12) and check for errors

### Issue: Website chat not saving to database
- **Check:** Are Netlify environment variables configured for hlsitech.com site?
- **Check:** Did you redeploy after adding env variables?
- **Check:** Check Edge Function logs in Netlify

### Issue: Real-time updates not working
- **Check:** Is Realtime replication enabled for messages and conversations?
- **Check:** Check browser console for WebSocket errors
- **Check:** Verify Supabase project is not paused

---

## ✅ Setup Complete!

Once you've completed all steps and verified all tests pass, your live chat system is ready for production use!

**Next steps:**
1. Monitor email notifications at info@hlsitech.com
2. Test AI escalation by asking complex questions
3. Test file uploads (when implemented)
4. Invite team members if needed

**Production URLs:**
- Dashboard: https://hlsitech-dashboard.netlify.app
- Website: https://hlsitech.com
- Supabase: https://supabase.com/dashboard/project/ggppnyylqpjqutzbdhmm
