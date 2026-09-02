
-- 1. Salons table
CREATE TABLE IF NOT EXISTS salons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  rating NUMERIC DEFAULT 0
);

-- 2. Services table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "salonId" UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
  "serviceName" TEXT NOT NULL,
  price NUMERIC NOT NULL,
  duration TEXT,
  "isAvailable" BOOLEAN DEFAULT true
);

-- 3. Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

-- Disable Row Level Security (RLS) so the Express backend can perform insert/update/delete operations freely
ALTER TABLE salons DISABLE ROW LEVEL SECURITY;
ALTER TABLE services DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

