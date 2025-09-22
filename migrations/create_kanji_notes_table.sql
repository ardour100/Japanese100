-- Create kanji_notes table for storing user notes about kanji characters
CREATE TABLE IF NOT EXISTS kanji_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kanji_id INTEGER NOT NULL,
  kanji_character TEXT NOT NULL,
  content TEXT NOT NULL CHECK (length(content) <= 5000),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_kanji_notes_user_id ON kanji_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_kanji_notes_kanji_id ON kanji_notes(kanji_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_kanji_notes_user_kanji ON kanji_notes(user_id, kanji_id);

-- Create RLS (Row Level Security) policies
ALTER TABLE kanji_notes ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own notes
CREATE POLICY "Users can view own notes" ON kanji_notes
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can only insert their own notes
CREATE POLICY "Users can insert own notes" ON kanji_notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only update their own notes
CREATE POLICY "Users can update own notes" ON kanji_notes
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can only delete their own notes
CREATE POLICY "Users can delete own notes" ON kanji_notes
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at on row update
CREATE TRIGGER update_kanji_notes_updated_at
  BEFORE UPDATE ON kanji_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();