-- =============================================
-- COMPLETE RLS FIX FOR HOSPITAL EQUIPMENT MAINTENANCE SYSTEM
-- Run this entire script in Supabase SQL Editor
-- =============================================

-- Step 1: DISABLE RLS on all tables
-- This allows unrestricted access for development/testing

ALTER TABLE public.locations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.issues DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff DISABLE ROW LEVEL SECURITY;

-- Step 2: DROP all existing policies (clean slate)

-- Locations policies
DROP POLICY IF EXISTS "Allow authenticated read access" ON public.locations;
DROP POLICY IF EXISTS "Allow authenticated write access" ON public.locations;
DROP POLICY IF EXISTS "Allow all operations" ON public.locations;

-- Categories policies
DROP POLICY IF EXISTS "Allow authenticated read access" ON public.categories;
DROP POLICY IF EXISTS "Allow authenticated write access" ON public.categories;
DROP POLICY IF EXISTS "Allow all operations" ON public.categories;

-- Equipment policies
DROP POLICY IF EXISTS "Allow authenticated read access" ON public.equipment;
DROP POLICY IF EXISTS "Allow authenticated write access" ON public.equipment;
DROP POLICY IF EXISTS "Allow all operations" ON public.equipment;

-- Maintenance policies
DROP POLICY IF EXISTS "Allow authenticated read access" ON public.maintenance_records;
DROP POLICY IF EXISTS "Allow authenticated write access" ON public.maintenance_records;
DROP POLICY IF EXISTS "Allow all operations" ON public.maintenance_records;

-- Issues policies
DROP POLICY IF EXISTS "Allow authenticated read access" ON public.issues;
DROP POLICY IF EXISTS "Allow authenticated write access" ON public.issues;
DROP POLICY IF EXISTS "Allow all operations" ON public.issues;

-- Activity log policies
DROP POLICY IF EXISTS "Allow authenticated read access" ON public.activity_log;
DROP POLICY IF EXISTS "Allow authenticated write access" ON public.activity_log;
DROP POLICY IF EXISTS "Allow all operations" ON public.activity_log;

-- Staff policies
DROP POLICY IF EXISTS "Allow authenticated read access" ON public.staff;
DROP POLICY IF EXISTS "Allow authenticated write access" ON public.staff;
DROP POLICY IF EXISTS "Allow all operations" ON public.staff;

-- =============================================
-- VERIFICATION QUERIES
-- Run these to verify RLS is disabled
-- =============================================

-- Check RLS status on all tables
SELECT
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN (
    'locations',
    'categories',
    'equipment',
    'maintenance_records',
    'issues',
    'activity_log',
    'staff'
)
ORDER BY tablename;

-- Expected output: All tables should show rls_enabled = false

-- =============================================
-- TEST QUERIES
-- Run these to verify data access works
-- =============================================

-- Test 1: Read equipment
SELECT COUNT(*) as equipment_count FROM public.equipment;

-- Test 2: Read issues
SELECT COUNT(*) as issues_count FROM public.issues;

-- Test 3: Read specific equipment
SELECT * FROM public.equipment WHERE equipment_id = 'EQ-001';

-- Test 4: Try to insert a test issue (will rollback)
BEGIN;
INSERT INTO public.issues (
    equipment_id,
    title,
    description,
    reported_by
) VALUES (
    (SELECT id FROM public.equipment WHERE equipment_id = 'EQ-001'),
    'Test Issue',
    'This is a test to verify insert permissions',
    'System Test'
);
ROLLBACK; -- Don't actually save, just test

-- =============================================
-- OPTIONAL: Enable RLS with permissive policies
-- Uncomment below if you want RLS enabled but allow all operations
-- =============================================

/*
-- Enable RLS
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

-- Create permissive policies (allow everything)
CREATE POLICY "Public access" ON public.locations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access" ON public.categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access" ON public.equipment FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access" ON public.maintenance_records FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access" ON public.issues FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access" ON public.activity_log FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access" ON public.staff FOR ALL USING (true) WITH CHECK (true);
*/

-- =============================================
-- COMMON ISSUES & SOLUTIONS
-- =============================================

-- Issue 1: 406 Error
-- Solution: RLS is blocking - Run the DISABLE commands above

-- Issue 2: "new row violates row-level security policy"
-- Solution: Run DROP POLICY commands or DISABLE RLS

-- Issue 3: "permission denied for table"
-- Solution: Check table ownership and grants

-- Issue 4: Can read but can't write
-- Solution: DISABLE RLS or add permissive INSERT/UPDATE policies

-- =============================================
-- SUCCESS INDICATORS
-- =============================================

-- After running this script, you should see:
-- ✅ All RLS disabled (rowsecurity = false)
-- ✅ No 406 errors when accessing data
-- ✅ Can INSERT into issues table
-- ✅ Can SELECT from all tables
-- ✅ Application works without authentication

COMMIT;
