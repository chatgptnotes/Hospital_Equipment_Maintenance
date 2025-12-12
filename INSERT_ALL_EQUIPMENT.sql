-- =============================================
-- INSERT ALL EQUIPMENT DATA TO SUPABASE
-- This matches the mock data in App.jsx
-- Run this in Supabase SQL Editor
-- =============================================

-- First, get location and category IDs
DO $$
DECLARE
    hope_hospital_id UUID;
    ayushman_hospital_id UUID;
    icu_id UUID;
    ot_id UUID;
    lab_id UUID;
    general_id UUID;
    ward_id UUID;
    physio_id UUID;
BEGIN
    -- Get location IDs
    SELECT id INTO hope_hospital_id FROM locations WHERE name = 'Hope Hospital';
    SELECT id INTO ayushman_hospital_id FROM locations WHERE name = 'Ayushman Hospital';

    -- Get category IDs
    SELECT id INTO icu_id FROM categories WHERE name = 'ICU';
    SELECT id INTO ot_id FROM categories WHERE name = 'OT';
    SELECT id INTO lab_id FROM categories WHERE name = 'Lab';
    SELECT id INTO general_id FROM categories WHERE name = 'General';
    SELECT id INTO ward_id FROM categories WHERE name = 'Ward';
    SELECT id INTO physio_id FROM categories WHERE name = 'Physiotherapy';

    -- Insert all equipment (matching App.jsx mock data)
    INSERT INTO equipment (equipment_id, name, location_id, category_id, status, last_maintenance_date, next_maintenance_date)
    VALUES
        -- Hope Hospital Equipment
        ('EQ-001', 'Suction Machine', hope_hospital_id, icu_id, 'operational', '2024-11-15', '2025-02-15'),
        ('EQ-002', 'Air Compressor', hope_hospital_id, general_id, 'operational', '2024-11-20', '2025-02-20'),
        ('EQ-005', 'Lift', hope_hospital_id, general_id, 'operational', '2024-11-10', '2025-02-10'),
        ('EQ-006', 'O2 Plant', hope_hospital_id, general_id, 'operational', '2024-11-25', '2025-02-25'),
        ('EQ-007', 'Cathlab', hope_hospital_id, ot_id, 'repair', '2024-11-01', '2025-02-01'),
        ('EQ-008', 'Generator', hope_hospital_id, general_id, 'operational', '2024-11-22', '2025-02-22'),
        ('EQ-009', 'Lab Equipment', hope_hospital_id, lab_id, 'operational', '2024-11-12', '2025-02-12'),
        ('EQ-010', 'C-arm', hope_hospital_id, ot_id, 'operational', '2024-11-08', '2025-02-08'),
        ('EQ-011', 'X-Ray', hope_hospital_id, lab_id, 'operational', '2024-11-05', '2025-02-05'),
        ('EQ-012', 'Ultrasound', hope_hospital_id, lab_id, 'operational', '2024-11-14', '2025-02-14'),
        ('EQ-020', 'Patient Monitor', hope_hospital_id, icu_id, 'operational', '2024-11-23', '2025-02-23'),
        ('EQ-021', 'Ventilator', hope_hospital_id, icu_id, 'operational', '2024-11-26', '2025-02-26'),
        ('EQ-022', 'OT Table', hope_hospital_id, ot_id, 'operational', '2024-11-18', '2025-02-18'),
        ('EQ-024', 'TENS Unit', hope_hospital_id, physio_id, 'operational', '2024-11-15', '2025-02-15'),
        ('EQ-026', 'Hospital Bed', hope_hospital_id, ward_id, 'operational', '2024-11-08', '2025-02-08'),

        -- Ayushman Hospital Equipment
        ('EQ-003', 'Suction Machine', ayushman_hospital_id, icu_id, 'repair', '2024-10-10', '2025-01-10'),
        ('EQ-004', 'Air Compressor', ayushman_hospital_id, general_id, 'repair', '2024-11-18', '2025-02-18'),
        ('EQ-013', 'Lift', ayushman_hospital_id, general_id, 'operational', '2024-11-12', '2025-02-12'),
        ('EQ-014', 'O2 Plant', ayushman_hospital_id, general_id, 'operational', '2024-11-28', '2025-02-28'),
        ('EQ-015', 'Generator', ayushman_hospital_id, general_id, 'operational', '2024-11-19', '2025-02-19'),
        ('EQ-016', 'Lab Equipment', ayushman_hospital_id, lab_id, 'operational', '2024-11-16', '2025-02-16'),
        ('EQ-017', 'X-Ray', ayushman_hospital_id, lab_id, 'operational', '2024-11-09', '2025-02-09'),
        ('EQ-018', 'Ultrasound', ayushman_hospital_id, lab_id, 'operational', '2024-11-17', '2025-02-17'),
        ('EQ-019', 'Dialysis Machine', ayushman_hospital_id, ward_id, 'operational', '2024-11-21', '2025-02-21'),
        ('EQ-023', 'Anesthesia Machine', ayushman_hospital_id, ot_id, 'operational', '2024-11-20', '2025-02-20'),
        ('EQ-025', 'Treadmill', ayushman_hospital_id, physio_id, 'operational', '2024-11-10', '2025-02-10'),
        ('EQ-027', 'IV Stand', ayushman_hospital_id, ward_id, 'operational', '2024-11-12', '2025-02-12')
    ON CONFLICT (equipment_id) DO UPDATE SET
        name = EXCLUDED.name,
        location_id = EXCLUDED.location_id,
        category_id = EXCLUDED.category_id,
        status = EXCLUDED.status,
        last_maintenance_date = EXCLUDED.last_maintenance_date,
        next_maintenance_date = EXCLUDED.next_maintenance_date;

    RAISE NOTICE 'Equipment data inserted successfully!';
END $$;

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Check how many equipment records we have
SELECT COUNT(*) as total_equipment FROM equipment;

-- List all equipment by location
SELECT
    l.name as hospital,
    COUNT(*) as equipment_count
FROM equipment e
JOIN locations l ON e.location_id = l.id
GROUP BY l.name
ORDER BY l.name;

-- Verify specific equipment IDs exist
SELECT
    equipment_id,
    name,
    l.name as location,
    c.name as category,
    status
FROM equipment e
LEFT JOIN locations l ON e.location_id = l.id
LEFT JOIN categories c ON e.category_id = c.id
WHERE equipment_id IN ('EQ-001', 'EQ-002', 'EQ-003', 'EQ-020', 'EQ-021')
ORDER BY equipment_id;

-- Expected output:
-- total_equipment: 27
-- Hope Hospital: 15
-- Ayushman Hospital: 12
-- All EQ-001 through EQ-027 should be present

-- =============================================
-- TEST QUERY
-- Run this to test if EQ-002 exists now
-- =============================================
SELECT * FROM equipment WHERE equipment_id = 'EQ-002';

-- Should return:
-- equipment_id: EQ-002
-- name: Air Compressor
-- location: Hope Hospital
-- category: General
-- status: operational
