# ✅ Final Setup Steps for HLS iTech Live Chat

## What's Already Complete:

✅ **Database Schema** - All 10 tables created in Supabase
✅ **Storage Buckets** - 4 buckets created (chat-attachments, avatars, knowledge-base, dashboard-images)
✅ **Admin User** - Created with email: info@hlsitech.com
✅ **Dashboard** - Built and deployed at https://hlsitech-dashboard.netlify.app
✅ **Website Chat Widget** - Updated with conversation persistence

---

## 📋 Remaining Steps (2 Quick Tasks):

### 1️⃣ Add Netlify Environment Variables (hlsitech.com website)

The website chat Edge Function needs Supabase credentials to save messages.

**Quick Method - Via Netlify Dashboard:**

1. Go to: https://app.netlify.com/sites/hlsitech/env
2. Click **Add a variable**
3. Add these 4 variables:

| Key | Value | Scopes |
|-----|-------|--------|
| `SUPABASE_URL` | Your Supabase project URL from dashboard | All scopes |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key from dashboard | All scopes |
| `GEMINI_API_KEY` | Your Google Gemini API key | All scopes |
| `RESEND_API_KEY` | Your Resend API key | All scopes |

**Note:** Get these values from:
- Supabase: https://supabase.com/dashboard/project/_/settings/api
- Gemini: https://aistudio.google.com/app/apikey
- Resend: https://resend.com/api-keys

4. Click **Save** after adding each one

**Then trigger a redeploy:**
- Go to: https://app.netlify.com/sites/hlsitech/deploys
- Click **Trigger deploy** → **Deploy site**

---

### 2️⃣ Enable Supabase Realtime Replication

This enables live message updates in the dashboard without refreshing.

1. Go to: https://supabase.com/dashboard/project/ggppnyylqpjqutzbdhmm/database/replication
2. Find these 3 tables and toggle **Enable** for each:
   - ✅ **conversations**
   - ✅ **messages**
   - ✅ **sessions**
3. Click **Save** (if prompted)

---

## 🧪 Testing Your Live Chat System

Once the above 2 steps are done:

### Test 1: Dashboard Login
1. Go to: https://hlsitech-dashboard.netlify.app/login
2. Login with:
   - **Email:** info@hlsitech.com
   - **Password:** Wintersun6?6
3. ✅ You should see the dashboard

### Test 2: Access Live Chat
1. Click **Live Chat** in the sidebar
2. ✅ You should see an empty conversation list (no conversations yet)

### Test 3: Send Message from Website
1. Open: https://hlsitech.com
2. Click the blue chat bubble in bottom-right
3. Start a conversation: "Hello, I need help with my computer"
4. Wait for AI response
5. ✅ The AI should respond with IT support help

### Test 4: See Conversation in Dashboard
1. Go back to dashboard Live Chat tab
2. Refresh if needed (or it should appear automatically)
3. ✅ You should see the new conversation in the list

### Test 5: Reply from Dashboard
1. Click on the conversation
2. Type: "Hi! What seems to be the problem?"
3. Click Send
4. Go back to website chat
5. ✅ Your message should appear in the chat widget

### Test 6: Real-Time Updates
1. Keep dashboard Live Chat open
2. In another browser/tab, send a message from website
3. ✅ Message should appear in dashboard instantly (no refresh)

---

## 🎉 You're Done!

Once these tests pass, your live chat system is fully operational:

- ✅ Customers can chat on hlsitech.com
- ✅ AI responds automatically with IT support
- ✅ Conversations save to database
- ✅ You see all chats in dashboard
- ✅ You can reply to customers from dashboard
- ✅ Real-time updates work
- ✅ Email notifications sent to info@hlsitech.com

---

## 📊 Your Login Credentials

**Dashboard:**
- URL: https://hlsitech-dashboard.netlify.app
- Email: info@hlsitech.com
- Password: Wintersun6?6

**Supabase:**
- URL: https://supabase.com/dashboard/project/ggppnyylqpjqutzbdhmm
- (Use your existing Supabase login)

---

## 🆘 Troubleshooting

### Website chat not working?
- Check Netlify env variables are set
- Check Edge Function logs: https://app.netlify.com/sites/hlsitech/logs/functions

### Dashboard not showing conversations?
- Check Realtime replication is enabled
- Check browser console (F12) for errors

### Can't login to dashboard?
- Double-check email: info@hlsitech.com
- Password: Wintersun6?6
- Try resetting password in Supabase if needed

---

**Need help?** Just ask me in Claude Code!
