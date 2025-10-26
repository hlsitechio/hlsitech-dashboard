# Supabase Setup Guide for HLSitech Dashboard

## Project Information
- **Project Name:** hlsitech.com
- **Project ID:** ggppnyylqpjqutzbdhmm
- **Project URL:** https://ggppnyylqpjqutzbdhmm.supabase.co

## Step 1: Run Database Schema

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/ggppnyylqpjqutzbdhmm)
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New query**
4. Copy the entire contents of `DATABASE_SCHEMA.sql`
5. Paste into the SQL editor
6. Click **Run** to execute the schema

This will create:
- 11 database tables (users, agents, conversations, messages, sessions, tickets, knowledge_base, canned_responses, analytics_events, ai_interactions)
- All necessary indexes for performance
- Row Level Security policies
- Automatic timestamp triggers
- Default agents (Hubert and AI Assistant)

## Step 2: Enable Realtime

For live chat functionality, enable Realtime for these tables:

1. Go to **Database** → **Replication** in Supabase Dashboard
2. Enable replication for:
   - `messages` (required for live chat)
   - `conversations` (required for conversation updates)
   - `sessions` (required for presence tracking)
   - `users` (optional, for user status updates)

## Step 3: Configure Environment Variables

Create `.env.local` in the dashboard directory with:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ggppnyylqpjqutzbdhmm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdncHBueXlscXBqcXV0emJkaG1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0Mzk1MzEsImV4cCI6MjA3NzAxNTUzMX0.qmxiSqpwJLJFuJ6ujo3eBTtVK9CI3kQv6jWYOJS2lZY

# Service Role Key (server-side only, never expose to client)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdncHBueXlscXBqcXV0emJkaG1tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTQzOTUzMSwiZXhwIjoyMDc3MDE1NTMxfQ.QJgPoyhoRNI2OZ0gCzfdCeV7cvlW7s3FuH_-4bIsdd8

# AI Configuration
GEMINI_API_KEY=AIzaSyBJ0MT3q-ro7JaXcWsll3C8SF0mbwSIois

# Email Configuration
RESEND_API_KEY=re_RhSExPm4_75mZUNFfD2Uw52jEwontYjH1
SUPPORT_EMAIL=hlarosesurprenant@gmail.com
```

## Step 4: Install Supabase Client

```bash
cd G:/hlsitechbusinesscard/dashboard
npm install @supabase/supabase-js @supabase/ssr
```

## Step 5: Authentication Setup (Optional)

For agent authentication (if you want to add login for support team):

1. Go to **Authentication** → **Providers** in Supabase Dashboard
2. Enable **Email** provider
3. Optionally enable **Google** or other OAuth providers
4. Configure email templates under **Authentication** → **Email Templates**

## Step 6: Storage Setup (Optional)

For file attachments in chat:

1. Go to **Storage** in Supabase Dashboard
2. Create a new bucket named `chat-attachments`
3. Set bucket policies:
   - Allow authenticated users to upload
   - Allow public read access (or implement custom policies)

## Step 7: Configure API Settings

1. Go to **Settings** → **API**
2. Verify these settings:
   - Auto-refresh tokens: Enabled
   - Additional redirect URLs: Add your production domain
   - JWT expiry: Default (3600 seconds)

## Supabase MCP Server Setup (Optional)

To enable Claude Code to manage your Supabase database:

1. Create a Personal Access Token:
   - Go to [Supabase Account Settings](https://supabase.com/dashboard/account/tokens)
   - Click "Generate new token"
   - Name it "Claude Code MCP"
   - Copy the token

2. Update `.claude.json` to include the token:
   ```json
   {
     "supabase": {
       "command": "cmd",
       "args": ["/c", "npx", "-y", "@supabase/mcp-server-supabase@latest"],
       "env": {
         "SUPABASE_ACCESS_TOKEN": "your-personal-access-token-here",
         "SUPABASE_PROJECT_REF": "ggppnyylqpjqutzbdhmm"
       }
     }
   }
   ```

3. Restart Claude Code to connect to Supabase MCP

## Testing Database

After running the schema, test the connection:

```bash
cd G:/hlsitechbusinesscard/dashboard
npm run dev
```

The dashboard should now be able to:
- Create and read conversations
- Send and receive messages in real-time
- Track user sessions
- Store analytics events
- Access knowledge base articles

## Next Steps

1. Run the database schema ✓
2. Enable Realtime for messages, conversations, sessions ✓
3. Install Supabase packages ✓
4. Create `.env.local` with credentials ✓
5. Implement Supabase client configuration
6. Build live chat components
7. Integrate with existing AI chatbot on hlsitech.com

## Troubleshooting

### Connection Issues
- Verify project ID matches: `ggppnyylqpjqutzbdhmm`
- Check API keys are correct
- Ensure RLS policies allow your operations

### Realtime Not Working
- Verify Realtime is enabled for the table
- Check browser console for WebSocket errors
- Confirm RLS policies allow realtime subscriptions

### Permission Errors
- Review RLS policies in SQL Editor
- Use service role key for admin operations
- Test with RLS disabled temporarily (not in production)

## Security Notes

⚠️ **Important Security Practices:**

1. Never commit `.env.local` to Git (already in `.gitignore`)
2. Use anon key only for client-side operations
3. Use service role key only in server-side API routes
4. Always validate and sanitize user input
5. Review and test RLS policies before going live
6. Enable MFA on your Supabase account
7. Regularly rotate API keys
8. Monitor database logs for suspicious activity

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Realtime Docs](https://supabase.com/docs/guides/realtime)
- [Next.js with Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [RLS Policies Guide](https://supabase.com/docs/guides/auth/row-level-security)
