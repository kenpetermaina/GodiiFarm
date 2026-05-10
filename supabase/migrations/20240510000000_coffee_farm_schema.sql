-- Coffee Farm Management Tables Migration
-- Add coffee farm related tables to the existing dairy farm system

-- Create coffee_farms table
CREATE TABLE IF NOT EXISTS coffee_farms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  variety TEXT NOT NULL,
  size_acres DECIMAL(8,2) NOT NULL,
  number_of_trees INTEGER NOT NULL,
  planting_date DATE NOT NULL,
  soil_type TEXT,
  irrigation_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create coffee_trees table
CREATE TABLE IF NOT EXISTS coffee_trees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  farm_id UUID REFERENCES coffee_farms(id) ON DELETE CASCADE NOT NULL,
  tree_id TEXT NOT NULL,
  variety TEXT NOT NULL,
  planted_date DATE NOT NULL,
  age INTEGER GENERATED ALWAYS AS (EXTRACT(YEAR FROM AGE(CURRENT_DATE, planted_date))) STORED,
  health_status TEXT CHECK (health_status IN ('Healthy', 'Monitoring', 'Sick', 'Dead')) DEFAULT 'Healthy',
  production_rate TEXT CHECK (production_rate IN ('High', 'Medium', 'Low')) DEFAULT 'Medium',
  last_fertilized DATE,
  last_sprayed DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create coffee_harvests table
CREATE TABLE IF NOT EXISTS coffee_harvests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  harvest_date DATE NOT NULL,
  quantity_kg DECIMAL(8,2) NOT NULL,
  quality_grade TEXT CHECK (quality_grade IN ('Premium', 'Standard', 'Low')) DEFAULT 'Standard',
  collected_by TEXT NOT NULL,
  selling_price_per_kg DECIMAL(8,2) NOT NULL,
  buyer_name TEXT NOT NULL,
  total_earnings DECIMAL(10,2) GENERATED ALWAYS AS (quantity_kg * selling_price_per_kg) STORED,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create coffee_sales table
CREATE TABLE IF NOT EXISTS coffee_sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  buyer_name TEXT NOT NULL,
  quantity_sold_kg DECIMAL(8,2) NOT NULL,
  price_per_kg DECIMAL(8,2) NOT NULL,
  total_amount DECIMAL(10,2) GENERATED ALWAYS AS (quantity_sold_kg * price_per_kg) STORED,
  payment_status TEXT CHECK (payment_status IN ('Paid', 'Pending', 'Overdue')) DEFAULT 'Pending',
  sale_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create coffee_expenses table
CREATE TABLE IF NOT EXISTS coffee_expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category TEXT CHECK (category IN ('Fertilizer', 'Pesticides', 'Labor', 'Transport', 'Equipment', 'Irrigation', 'Other')) NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  expense_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create coffee_workers table
CREATE TABLE IF NOT EXISTS coffee_workers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  phone_number TEXT,
  assigned_task TEXT NOT NULL,
  daily_payment DECIMAL(8,2) NOT NULL,
  working_days INTEGER DEFAULT 0,
  total_earnings DECIMAL(10,2) GENERATED ALWAYS AS (daily_payment * working_days) STORED,
  employment_date DATE DEFAULT CURRENT_DATE,
  status TEXT CHECK (status IN ('Active', 'Inactive')) DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create coffee_inventory table
CREATE TABLE IF NOT EXISTS coffee_inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  item_name TEXT NOT NULL,
  category TEXT CHECK (category IN ('Fertilizer', 'Pesticide', 'Tool', 'Sack', 'Other')) NOT NULL,
  quantity DECIMAL(8,2) NOT NULL,
  unit TEXT DEFAULT 'kg',
  minimum_stock DECIMAL(8,2) DEFAULT 0,
  supplier TEXT,
  last_updated DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_coffee_farms_user_id ON coffee_farms(user_id);
CREATE INDEX IF NOT EXISTS idx_coffee_trees_user_id ON coffee_trees(user_id);
CREATE INDEX IF NOT EXISTS idx_coffee_trees_farm_id ON coffee_trees(farm_id);
CREATE INDEX IF NOT EXISTS idx_coffee_harvests_user_id ON coffee_harvests(user_id);
CREATE INDEX IF NOT EXISTS idx_coffee_harvests_date ON coffee_harvests(harvest_date);
CREATE INDEX IF NOT EXISTS idx_coffee_sales_user_id ON coffee_sales(user_id);
CREATE INDEX IF NOT EXISTS idx_coffee_sales_date ON coffee_sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_coffee_expenses_user_id ON coffee_expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_coffee_expenses_category ON coffee_expenses(category);
CREATE INDEX IF NOT EXISTS idx_coffee_expenses_date ON coffee_expenses(expense_date);
CREATE INDEX IF NOT EXISTS idx_coffee_workers_user_id ON coffee_workers(user_id);
CREATE INDEX IF NOT EXISTS idx_coffee_inventory_user_id ON coffee_inventory(user_id);
CREATE INDEX IF NOT EXISTS idx_coffee_inventory_category ON coffee_inventory(category);

-- Enable Row Level Security
ALTER TABLE coffee_farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE coffee_trees ENABLE ROW LEVEL SECURITY;
ALTER TABLE coffee_harvests ENABLE ROW LEVEL SECURITY;
ALTER TABLE coffee_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE coffee_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE coffee_workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE coffee_inventory ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (users can only access their own data)
CREATE POLICY "Users can view own coffee farms" ON coffee_farms FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own coffee farms" ON coffee_farms FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own coffee farms" ON coffee_farms FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own coffee farms" ON coffee_farms FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own coffee trees" ON coffee_trees FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own coffee trees" ON coffee_trees FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own coffee trees" ON coffee_trees FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own coffee trees" ON coffee_trees FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own coffee harvests" ON coffee_harvests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own coffee harvests" ON coffee_harvests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own coffee harvests" ON coffee_harvests FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own coffee harvests" ON coffee_harvests FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own coffee sales" ON coffee_sales FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own coffee sales" ON coffee_sales FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own coffee sales" ON coffee_sales FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own coffee sales" ON coffee_sales FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own coffee expenses" ON coffee_expenses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own coffee expenses" ON coffee_expenses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own coffee expenses" ON coffee_expenses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own coffee expenses" ON coffee_expenses FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own coffee workers" ON coffee_workers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own coffee workers" ON coffee_workers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own coffee workers" ON coffee_workers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own coffee workers" ON coffee_workers FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own coffee inventory" ON coffee_inventory FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own coffee inventory" ON coffee_inventory FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own coffee inventory" ON coffee_inventory FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own coffee inventory" ON coffee_inventory FOR DELETE USING (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_coffee_farms_updated_at BEFORE UPDATE ON coffee_farms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_coffee_trees_updated_at BEFORE UPDATE ON coffee_trees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_coffee_harvests_updated_at BEFORE UPDATE ON coffee_harvests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_coffee_sales_updated_at BEFORE UPDATE ON coffee_sales FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_coffee_expenses_updated_at BEFORE UPDATE ON coffee_expenses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_coffee_workers_updated_at BEFORE UPDATE ON coffee_workers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_coffee_inventory_updated_at BEFORE UPDATE ON coffee_inventory FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();