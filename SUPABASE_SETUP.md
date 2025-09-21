# 🔐 Supabase + Google Auth Setup Guide

This guide will walk you through setting up Supabase with Google authentication for the Kanji Learning App.

## 📋 Prerequisites

- A Google account
- A Supabase account (free tier is sufficient)
- Your Kanji Learning App deployed or running locally

## 🚀 Step 1: Create Supabase Project

### 1.1 Sign up/Login to Supabase
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub/Google or create account
4. Create a new organization if needed

### 1.2 Create New Project
1. Click "New Project"
2. Choose your organization
3. Enter project details:
   - **Project name**: `kanji-learning-app` (or your preferred name)
   - **Database password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
4. Click "Create new project"
5. Wait 2-3 minutes for setup to complete

### 1.3 Get Project Credentials
1. Go to **Settings** → **API**
2. Copy and save these values:
   - **Project URL**: `https://your-project-ref.supabase.co`
   - **Project API keys** → **anon/public**: `eyJ...` (long string)

## 🗄️ Step 2: Set Up Database Schema

### 2.1 Create Tables
1. Go to **SQL Editor** in your Supabase dashboard
2. Click "New query"
3. Copy and paste this SQL:

```sql
-- Create user_progress table
CREATE TABLE user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  kanji_id INTEGER NOT NULL,
  progress_level INTEGER NOT NULL CHECK (progress_level IN (0, 20, 60, 80, 100)),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, kanji_id)
);

-- Enable RLS (Row Level Security)
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Create policies so users can only access their own progress
CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Create function to handle updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON user_progress
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();
```

4. Click "Run" to execute
5. You should see "Success. No rows returned" message

### 2.2 Verify Table Creation
1. Go to **Table Editor**
2. You should see `user_progress` table listed
3. Click on it to verify the schema

## 🔑 Step 3: Configure Google OAuth

### 3.1 Google Cloud Console Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one:
   - Click project dropdown → "New Project"
   - Name: `kanji-learning-auth` (or your choice)
   - Click "Create"

### 3.2 Enable Google+ API
1. In Google Cloud Console, go to **APIs & Services** → **Library**
2. Search for "Google+ API"
3. Click on it and press "Enable"

### 3.3 Create OAuth Credentials
1. Go to **APIs & Services** → **Credentials**
2. Click "Create Credentials" → "OAuth 2.0 Client ID"
3. If prompted, configure OAuth consent screen:
   - Choose "External" user type
   - Fill required fields:
     - **App name**: Kanji Learning App
     - **User support email**: Your email
     - **Developer contact email**: Your email
   - Save and continue through steps
4. Back to Create OAuth Client ID:
   - **Application type**: Web application
   - **Name**: Kanji Learning App
   - **Authorized redirect URIs**: Add these URLs:
     - `https://your-project-ref.supabase.co/auth/v1/callback`
     - `http://localhost:3000/auth/callback` (for local development)
5. Click "Create"
6. **SAVE YOUR CREDENTIALS**:
   - **Client ID**: `1234567890-abcdef...googleusercontent.com`
   - **Client Secret**: `GOCSPX-abcdef...`

### 3.4 Configure Supabase Auth
1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Find "Google" and click to configure
3. Enable the provider (toggle to ON)
4. Enter your Google credentials:
   - **Client ID**: (from step 3.3)
   - **Client Secret**: (from step 3.3)
5. Click "Save"

## 🔧 Step 4: Configure Your App

### 4.1 Environment Variables
1. In your project root, create `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

2. Replace the values with your actual Supabase credentials from Step 1.3

### 4.2 Update Google OAuth Redirect URLs
When you deploy your app, update the Google OAuth settings:

1. Go back to Google Cloud Console → Credentials
2. Edit your OAuth 2.0 Client ID
3. Add your production URL to **Authorized redirect URIs**:
   - `https://your-app-domain.com/auth/callback`
   - Keep the localhost URL for development

## ✅ Step 5: Test the Integration

### 5.1 Run Your App
```bash
npm run dev
```

### 5.2 Test Authentication Flow
1. Open your app in browser
2. Click "Sign in with Google" in header
3. You should be redirected to Google login
4. After successful login, you should be back to your app
5. Your profile should show in the header

### 5.3 Test Progress Saving
1. Go to any kanji detail page
2. Set a progress level using the ladder
3. Refresh the page - progress should persist
4. Check Supabase dashboard → Table Editor → user_progress
5. You should see your progress entry

## 🛠️ Troubleshooting

### Common Issues:

**1. "Invalid redirect URI" error**
- Check that your redirect URIs in Google Cloud Console exactly match
- For local: `http://localhost:3000/auth/callback`
- For production: `https://your-domain.com/auth/callback`

**2. Environment variables not working**
- Make sure `.env.local` is in project root
- Restart your development server after adding env vars
- Check that variable names start with `NEXT_PUBLIC_`

**3. Progress not saving**
- Check browser console for errors
- Verify RLS policies are set up correctly
- Ensure user is authenticated before trying to save

**4. Google OAuth not working**
- Verify Google+ API is enabled
- Check that Client ID and Secret are correctly copied
- Ensure OAuth consent screen is configured

### Debug Tools:

**Check Supabase logs:**
1. Go to Supabase Dashboard → Logs
2. Select "Auth" to see authentication logs

**Check browser console:**
- Open Developer Tools → Console
- Look for any error messages

**Verify database:**
1. Go to Supabase → Table Editor → user_progress
2. Check if data is being inserted

## 🎉 You're Done!

Your Kanji Learning App now has:
- ✅ Google authentication
- ✅ Persistent user progress
- ✅ Automatic progress migration from localStorage
- ✅ Secure data access with RLS

Users can now:
- Sign in with their Google account
- Have their progress saved permanently
- Access their progress from any device
- Keep their progress private and secure

## 🔐 Security Notes

- Never commit `.env.local` to version control
- RLS policies ensure users only see their own data
- OAuth provides secure authentication without storing passwords
- All communication with Supabase is over HTTPS

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Google OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)