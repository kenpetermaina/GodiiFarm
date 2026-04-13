-- Create tables for GodiiFarm application
-- Enable Row Level Security
-- Enable UUID extension

-- Create cows table
CREATE TABLE IF NOT EXISTS cows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tag TEXT NOT NULL,
  name TEXT NOT NULL,
  breed TEXT,
  age INTEGER DEFAULT 0,
  weight DECIMAL(5,2) DEFAULT 0,
  health TEXT CHECK (health IN ('Healthy', 'Monitoring', 'Sick')) DEFAULT 'Healthy',
  last_checkup DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create milk_records table
CREATE TABLE IF NOT EXISTS milk_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  cow_id UUID REFERENCES cows(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  amount DECIMAL(5,2) NOT NULL,
  session TEXT CHECK (session IN ('Morning', 'Lunch', 'Evening')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create feed_records table
CREATE TABLE IF NOT EXISTS feed_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  cow_id UUID REFERENCES cows(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  feed_type TEXT NOT NULL,
  quantity TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create health_records table
CREATE TABLE IF NOT EXISTS health_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  cow_id UUID REFERENCES cows(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  status TEXT NOT NULL,
  symptoms TEXT,
  treatment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  cow_id UUID REFERENCES cows(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create breeding_records table
CREATE TABLE IF NOT EXISTS breeding_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  cow_id UUID REFERENCES cows(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cows_user_id ON cows(user_id);
CREATE INDEX IF NOT EXISTS idx_milk_records_user_id ON milk_records(user_id);
CREATE INDEX IF NOT EXISTS idx_milk_records_cow_id ON milk_records(cow_id);
CREATE INDEX IF NOT EXISTS idx_milk_records_date ON milk_records(date);
CREATE INDEX IF NOT EXISTS idx_feed_records_user_id ON feed_records(user_id);
CREATE INDEX IF NOT EXISTS idx_feed_records_cow_id ON feed_records(cow_id);
CREATE INDEX IF NOT EXISTS idx_health_records_user_id ON health_records(user_id);
CREATE INDEX IF NOT EXISTS idx_health_records_cow_id ON health_records(cow_id);
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_cow_id ON notes(cow_id);
CREATE INDEX IF NOT EXISTS idx_breeding_records_user_id ON breeding_records(user_id);
CREATE INDEX IF NOT EXISTS idx_breeding_records_cow_id ON breeding_records(cow_id);

-- Enable Row Level Security
ALTER TABLE cows ENABLE ROW LEVEL SECURITY;
ALTER TABLE milk_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE breeding_records ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (users can only access their own data)
CREATE POLICY "Users can view own cows" ON cows FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own cows" ON cows FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cows" ON cows FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own cows" ON cows FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own milk records" ON milk_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own milk records" ON milk_records FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own milk records" ON milk_records FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own milk records" ON milk_records FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own feed records" ON feed_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own feed records" ON feed_records FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own feed records" ON feed_records FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own feed records" ON feed_records FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own health records" ON health_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own health records" ON health_records FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own health records" ON health_records FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own health records" ON health_records FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own notes" ON notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notes" ON notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notes" ON notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notes" ON notes FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own breeding records" ON breeding_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own breeding records" ON breeding_records FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own breeding records" ON breeding_records FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own breeding records" ON breeding_records FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_cows_updated_at BEFORE UPDATE ON cows FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_milk_records_updated_at BEFORE UPDATE ON milk_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_feed_records_updated_at BEFORE UPDATE ON feed_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_health_records_updated_at BEFORE UPDATE ON health_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_breeding_records_updated_at BEFORE UPDATE ON breeding_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();