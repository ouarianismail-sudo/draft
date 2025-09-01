/*
  # Initial Warehouse Management System Schema

  1. New Tables
    - `clients` - Customer/client information with contact details
    - `users` - System users with role-based access (Admin, Agriculteur)  
    - `stock_movements` - Inventory transactions (in/out) with detailed tracking
  
  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Admins can access all data
    - Agriculteurs can only access their own client data
  
  3. Features
    - User authentication with email/password
    - Client management with contact information
    - Stock movement tracking with box counting
    - Comment system for movements
    - Automatic timestamp tracking
*/

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  join_date date NOT NULL DEFAULT CURRENT_DATE,
  type text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  email text NOT NULL,
  comment text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('Admin', 'Agriculteur')),
  status text NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Suspended')),
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create stock movements table
CREATE TABLE IF NOT EXISTS stock_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('in', 'out')),
  product text NOT NULL,
  total_weight numeric NOT NULL,
  plastic_box_count integer DEFAULT 0,
  plastic_box_weight numeric DEFAULT 0,
  wood_box_count integer DEFAULT 0,
  wood_box_weight numeric DEFAULT 0,
  product_weight numeric NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  recorded_by_user_id uuid NOT NULL REFERENCES users(id),
  comment text,
  farmer_comment text,
  is_comment_read boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for clients
CREATE POLICY "Admins can manage all clients"
  ON clients
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'Admin'
    )
  );

CREATE POLICY "Agriculteurs can view their own client"
  ON clients
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.client_id = clients.id
    )
  );

-- RLS Policies for users
CREATE POLICY "Admins can manage all users"
  ON users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid() 
      AND u.role = 'Admin'
    )
  );

CREATE POLICY "Users can view their own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- RLS Policies for stock_movements
CREATE POLICY "Admins can manage all stock movements"
  ON stock_movements
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'Admin'
    )
  );

CREATE POLICY "Agriculteurs can view their client's movements"
  ON stock_movements
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.client_id = stock_movements.client_id
    )
  );

CREATE POLICY "Agriculteurs can update farmer comments"
  ON stock_movements
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.client_id = stock_movements.client_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.client_id = stock_movements.client_id
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_client_id ON users(client_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_client_id ON stock_movements(client_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_date ON stock_movements(date);
CREATE INDEX IF NOT EXISTS idx_stock_movements_type ON stock_movements(type);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stock_movements_updated_at BEFORE UPDATE ON stock_movements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();