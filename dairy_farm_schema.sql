-- Dairy Farm Management System Database Schema
-- PostgreSQL compatible

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (farm owners and staff)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) CHECK (role IN ('admin', 'worker')) DEFAULT 'worker',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Cows table
CREATE TABLE cows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tag_number VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255),
    breed VARCHAR(100),
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female')),
    status VARCHAR(50) CHECK (status IN ('healthy', 'sick', 'sold', 'dead')) DEFAULT 'healthy',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for cows table
CREATE INDEX idx_cows_tag_number ON cows(tag_number);
CREATE INDEX idx_cows_status ON cows(status);
CREATE INDEX idx_cows_breed ON cows(breed);

-- Milk Records table
CREATE TABLE milk_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cow_id UUID NOT NULL REFERENCES cows(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    amount_liters DECIMAL(8,2) NOT NULL CHECK (amount_liters >= 0),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for milk records
CREATE INDEX idx_milk_records_cow_id ON milk_records(cow_id);
CREATE INDEX idx_milk_records_date ON milk_records(date);
CREATE INDEX idx_milk_records_cow_date ON milk_records(cow_id, date);

-- Health Records table
CREATE TABLE health_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cow_id UUID NOT NULL REFERENCES cows(id) ON DELETE CASCADE,
    illness VARCHAR(255) NOT NULL,
    treatment TEXT,
    vet_name VARCHAR(255),
    visit_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for health records
CREATE INDEX idx_health_records_cow_id ON health_records(cow_id);
CREATE INDEX idx_health_records_visit_date ON health_records(visit_date);
CREATE INDEX idx_health_records_illness ON health_records(illness);

-- Feeding Records table
CREATE TABLE feeding_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cow_id UUID NOT NULL REFERENCES cows(id) ON DELETE CASCADE,
    feed_type VARCHAR(100) NOT NULL,
    quantity DECIMAL(8,2) NOT NULL CHECK (quantity >= 0),
    feeding_time TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for feeding records
CREATE INDEX idx_feeding_records_cow_id ON feeding_records(cow_id);
CREATE INDEX idx_feeding_records_feeding_time ON feeding_records(feeding_time);
CREATE INDEX idx_feeding_records_feed_type ON feeding_records(feed_type);

-- Expenses table
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category VARCHAR(50) CHECK (category IN ('feed', 'vet', 'transport', 'other')) NOT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
    description TEXT,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for expenses
CREATE INDEX idx_expenses_category ON expenses(category);
CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_expenses_category_date ON expenses(category, date);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cows_updated_at BEFORE UPDATE ON cows FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_milk_records_updated_at BEFORE UPDATE ON milk_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_health_records_updated_at BEFORE UPDATE ON health_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_feeding_records_updated_at BEFORE UPDATE ON feeding_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cows ENABLE ROW LEVEL SECURITY;
ALTER TABLE milk_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE feeding_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE breeding_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own data" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for cows table
CREATE POLICY "Users can view their own cows" ON cows
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cows" ON cows
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cows" ON cows
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cows" ON cows
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for milk_records table
CREATE POLICY "Users can view their own milk records" ON milk_records
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own milk records" ON milk_records
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own milk records" ON milk_records
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own milk records" ON milk_records
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for health_records table
CREATE POLICY "Users can view their own health records" ON health_records
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health records" ON health_records
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health records" ON health_records
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own health records" ON health_records
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for feeding_records table
CREATE POLICY "Users can view their own feeding records" ON feeding_records
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own feeding records" ON feeding_records
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own feeding records" ON feeding_records
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own feeding records" ON feeding_records
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for expenses table
CREATE POLICY "Users can view their own expenses" ON expenses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own expenses" ON expenses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own expenses" ON expenses
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own expenses" ON expenses
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for notes table
CREATE POLICY "Users can view their own notes" ON notes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notes" ON notes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes" ON notes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes" ON notes
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for breeding_records table
CREATE POLICY "Users can view their own breeding records" ON breeding_records
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own breeding records" ON breeding_records
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own breeding records" ON breeding_records
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own breeding records" ON breeding_records
    FOR DELETE USING (auth.uid() = user_id);