# Prerequisites

- Docker installed and running  
- Node.js and npm  
- Google Cloud Console account  
- Git  

---

### 1. Install Supabase CLI

**Using Homebrew (macOS):**

```bash
brew install supabase/tap/supabase
```
### 2. Initialize Local Supabase Project

```
supabase start
```
This will create:

Local PostgreSQL database

GoTrue auth server

Realtime server

Storage server

REST API

Dashboard at http://localhost:54323

### 3. Set Up Database Schema

```
-- Create user_progress table
CREATE TABLE user_progress (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  kanji_id INTEGER NOT NULL,
  progress_level INTEGER NOT NULL DEFAULT 0,
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, kanji_id)
);

-- Create kanji_notes table
CREATE TABLE kanji_notes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  kanji_id INTEGER NOT NULL,
  kanji_character TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE kanji_notes ENABLE ROW LEVEL SECURITY;

-- Create policies for user_progress
CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress" ON user_progress
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for kanji_notes
CREATE POLICY "Users can view own notes" ON kanji_notes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notes" ON kanji_notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notes" ON kanji_notes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notes" ON kanji_notes
  FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_user_progress_updated_at
BEFORE UPDATE ON user_progress
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kanji_notes_updated_at
BEFORE UPDATE ON kanji_notes
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

Save this as supabase/migrations/001_initial_schema.sql and run:

supabase db reset

### 4. Google OAuth Setup
4.1 Google Cloud Console Configuration

Step 1: Create/Select Project

Go to Google Cloud Console

Create a new project or select existing one

Enable the Google+ API and Google Identity Service

Step 2: Create OAuth 2.0 Credentials

Go to APIs & Services → Credentials

Click Create Credentials → OAuth 2.0 Client IDs

Choose Web application

Add authorized redirect URIs:

http://localhost:54321/auth/v1/callback

https://your-project.supabase.co/auth/v1/callback

Note your Client ID and Client Secret

4.2 Configure Local Supabase Auth

Edit supabase/config.toml:
```
[auth]
enabled = true
site_url = "http://localhost:3000"
additional_redirect_urls = ["http://localhost:3000"]

[auth.external.google]
enabled = true
client_id = "your-google-client-id"
secret = "your-google-client-secret"
redirect_uri = "http://localhost:54321/auth/v1/callback"
```


5. Update Your Codebase
5.1 Environment Variables

Update .env.local:
```
# Local Supabase (for development)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-local-anon-key

# Production Supabase (for deployment)
# NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key

# Google OAuth (same for both local and production)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id

```
Get local keys: 
```
supabase status

```
src/app/auth/callback/page.tsx
src/hooks/useAuth.ts

### 6 Development Workflow
6.1 Start Development
# Terminal 1: Start Supabase
supabase start

# Terminal 2: Start Next.js
npm run dev

6.2 Access Local Services

App: http://localhost:3000

Supabase Dashboard: http://localhost:54323

Database: http://localhost:54323/project/default/editor

Auth: http://localhost:54323/project/default/auth/users

6.3 Testing Flow

Visit http://localhost:3000

Click Sign in with Google

Complete Google OAuth flow

Redirect to http://localhost:3000/progress

Test progress tracking and data persistence

### 7. Database Management
7.1 Create Migration
supabase migration new add_new_feature

7.2 Apply Migrations
supabase db reset

7.3 Generate Types
supabase gen types typescript --local > src/types/database.types.ts

