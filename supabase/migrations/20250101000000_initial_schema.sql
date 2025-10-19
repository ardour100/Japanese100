-- ========================================
-- Initial Schema for Kanji Learning App
-- ========================================
-- Creates user_progress and kanji_notes tables with RLS policies

-- ========================================
-- 1. USER_PROGRESS TABLE
-- ========================================
-- Stores user learning progress for each kanji character

CREATE TABLE IF NOT EXISTS user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kanji_id INTEGER NOT NULL,
  progress_level INTEGER NOT NULL DEFAULT 0 CHECK (progress_level IN (0, 20, 60, 80, 100)),
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, kanji_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_kanji_id ON user_progress(kanji_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_archived ON user_progress(is_archived) WHERE is_archived = true;

-- Enable Row Level Security
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own progress
CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress" ON user_progress
  FOR DELETE USING (auth.uid() = user_id);

-- ========================================
-- 2. KANJI_NOTES TABLE
-- ========================================
-- Stores user notes about kanji characters

CREATE TABLE IF NOT EXISTS kanji_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kanji_id INTEGER NOT NULL,
  kanji_character TEXT NOT NULL,
  content TEXT NOT NULL CHECK (length(content) <= 5000),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_kanji_notes_user_id ON kanji_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_kanji_notes_kanji_id ON kanji_notes(kanji_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_kanji_notes_user_kanji ON kanji_notes(user_id, kanji_id);

-- Enable Row Level Security
ALTER TABLE kanji_notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own notes
CREATE POLICY "Users can view own notes" ON kanji_notes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notes" ON kanji_notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notes" ON kanji_notes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notes" ON kanji_notes
  FOR DELETE USING (auth.uid() = user_id);

-- ========================================
-- 3. TRIGGERS FOR AUTOMATIC TIMESTAMPS
-- ========================================

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for user_progress table
CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON user_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for kanji_notes table
CREATE TRIGGER update_kanji_notes_updated_at
  BEFORE UPDATE ON kanji_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
