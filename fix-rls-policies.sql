-- Fix RLS Policies for Hospital Equipment Maintenance System
-- Run this in Supabase SQL Editor

-- =============================================
-- DISABLE RLS TEMPORARILY FOR TESTING
-- (You can enable it later with proper auth)
-- =============================================

-- Option 1: Disable RLS completely (easiest for testing)
ALTER TABLE locations DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE equipment DISABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE issues DISABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log DISABLE ROW LEVEL SECURITY;
ALTER TABLE staff DISABLE ROW LEVEL SECURITY;

-- =============================================
-- OR Option 2: Keep RLS but allow all operations
-- (Uncomment below if you want to keep RLS enabled)
-- =============================================

/*
-- Drop existing policies first
DROP POLICY IF EXISTS "Allow authenticated read access" ON locations;
DROP POLICY IF EXISTS "Allow authenticated read access" ON categories;
DROP POLICY IF EXISTS "Allow authenticated read access" ON equipment;
DROP POLICY IF EXISTS "Allow authenticated read access" ON maintenance_records;
DROP POLICY IF EXISTS "Allow authenticated read access" ON issues;
DROP POLICY IF EXISTS "Allow authenticated read access" ON activity_log;
DROP POLICY IF EXISTS "Allow authenticated read access" ON staff;
DROP POLICY IF EXISTS "Allow authenticated write access" ON equipment;
DROP POLICY IF EXISTS "Allow authenticated write access" ON maintenance_records;
DROP POLICY IF EXISTS "Allow authenticated write access" ON issues;
DROP POLICY IF EXISTS "Allow authenticated write access" ON activity_log;

-- Create new permissive policies (allow all for now)
CREATE POLICY "Allow all operations" ON locations FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON categories FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON equipment FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON maintenance_records FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON issues FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON activity_log FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON staff FOR ALL USING (true);
*/

-- =============================================
-- TEST QUERY - Run this to verify it works
-- =============================================

-- Try inserting a test issue (should work now)
-- INSERT INTO issues (equipment_id, title, description, reported_by)
-- VALUES (
--   (SELECT id FROM equipment WHERE equipment_id = 'EQ-001'),
--   'Test Issue',
--   'This is a test issue to verify RLS is working',
--   'System Test'
-- );

-- Check if it was inserted
-- SELECT * FROM issues ORDER BY created_at DESC LIMIT 1;
