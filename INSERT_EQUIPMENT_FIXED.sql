-- =============================================
-- EQUIPMENT INSERT - ENUM TYPE FIXED
-- This version properly casts status to equipment_status enum
-- =============================================

-- Insert all 27 equipment records with proper type casting
INSERT INTO equipment (
    equipment_id,
    name,
    location_id,
    category_id,
    status,
    last_maintenance_date,
    next_maintenance_date
)
VALUES
    -- Hope Hospital Equipment
    ('EQ-001', 'Suction Machine',
        (SELECT id FROM locations WHERE name = 'Hope Hospital'),
        (SELECT id FROM categories WHERE name = 'ICU'),
        'operational'::equipment_status, '2024-11-15'::date, '2025-02-15'::date),

    ('EQ-002', 'Air Compressor',
        (SELECT id FROM locations WHERE name = 'Hope Hospital'),
        (SELECT id FROM categories WHERE name = 'General'),
        'operational'::equipment_status, '2024-11-20'::date, '2025-02-20'::date),

    ('EQ-005', 'Lift',
        (SELECT id FROM locations WHERE name = 'Hope Hospital'),
        (SELECT id FROM categories WHERE name = 'General'),
        'operational'::equipment_status, '2024-11-10'::date, '2025-02-10'::date),

    ('EQ-006', 'O2 Plant',
        (SELECT id FROM locations WHERE name = 'Hope Hospital'),
        (SELECT id FROM categories WHERE name = 'General'),
        'operational'::equipment_status, '2024-11-25'::date, '2025-02-25'::date),

    ('EQ-007', 'Cathlab',
        (SELECT id FROM locations WHERE name = 'Hope Hospital'),
        (SELECT id FROM categories WHERE name = 'OT'),
        'repair'::equipment_status, '2024-11-01'::date, '2025-02-01'::date),

    ('EQ-008', 'Generator',
        (SELECT id FROM locations WHERE name = 'Hope Hospital'),
        (SELECT id FROM categories WHERE name = 'General'),
        'operational'::equipment_status, '2024-11-22'::date, '2025-02-22'::date),

    ('EQ-009', 'Lab Equipment',
        (SELECT id FROM locations WHERE name = 'Hope Hospital'),
        (SELECT id FROM categories WHERE name = 'Lab'),
        'operational'::equipment_status, '2024-11-12'::date, '2025-02-12'::date),

    ('EQ-010', 'C-arm',
        (SELECT id FROM locations WHERE name = 'Hope Hospital'),
        (SELECT id FROM categories WHERE name = 'OT'),
        'operational'::equipment_status, '2024-11-08'::date, '2025-02-08'::date),

    ('EQ-011', 'X-Ray',
        (SELECT id FROM locations WHERE name = 'Hope Hospital'),
        (SELECT id FROM categories WHERE name = 'Lab'),
        'operational'::equipment_status, '2024-11-05'::date, '2025-02-05'::date),

    ('EQ-012', 'Ultrasound',
        (SELECT id FROM locations WHERE name = 'Hope Hospital'),
        (SELECT id FROM categories WHERE name = 'Lab'),
        'operational'::equipment_status, '2024-11-14'::date, '2025-02-14'::date),

    ('EQ-020', 'Patient Monitor',
        (SELECT id FROM locations WHERE name = 'Hope Hospital'),
        (SELECT id FROM categories WHERE name = 'ICU'),
        'operational'::equipment_status, '2024-11-23'::date, '2025-02-23'::date),

    ('EQ-021', 'Ventilator',
        (SELECT id FROM locations WHERE name = 'Hope Hospital'),
        (SELECT id FROM categories WHERE name = 'ICU'),
        'operational'::equipment_status, '2024-11-26'::date, '2025-02-26'::date),

    ('EQ-022', 'OT Table',
        (SELECT id FROM locations WHERE name = 'Hope Hospital'),
        (SELECT id FROM categories WHERE name = 'OT'),
        'operational'::equipment_status, '2024-11-18'::date, '2025-02-18'::date),

    ('EQ-024', 'TENS Unit',
        (SELECT id FROM locations WHERE name = 'Hope Hospital'),
        (SELECT id FROM categories WHERE name = 'Physiotherapy'),
        'operational'::equipment_status, '2024-11-15'::date, '2025-02-15'::date),

    ('EQ-026', 'Hospital Bed',
        (SELECT id FROM locations WHERE name = 'Hope Hospital'),
        (SELECT id FROM categories WHERE name = 'Ward'),
        'operational'::equipment_status, '2024-11-08'::date, '2025-02-08'::date),

    -- Ayushman Hospital Equipment
    ('EQ-003', 'Suction Machine',
        (SELECT id FROM locations WHERE name = 'Ayushman Hospital'),
        (SELECT id FROM categories WHERE name = 'ICU'),
        'repair'::equipment_status, '2024-10-10'::date, '2025-01-10'::date),

    ('EQ-004', 'Air Compressor',
        (SELECT id FROM locations WHERE name = 'Ayushman Hospital'),
        (SELECT id FROM categories WHERE name = 'General'),
        'repair'::equipment_status, '2024-11-18'::date, '2025-02-18'::date),

    ('EQ-013', 'Lift',
        (SELECT id FROM locations WHERE name = 'Ayushman Hospital'),
        (SELECT id FROM categories WHERE name = 'General'),
        'operational'::equipment_status, '2024-11-12'::date, '2025-02-12'::date),

    ('EQ-014', 'O2 Plant',
        (SELECT id FROM locations WHERE name = 'Ayushman Hospital'),
        (SELECT id FROM categories WHERE name = 'General'),
        'operational'::equipment_status, '2024-11-28'::date, '2025-02-28'::date),

    ('EQ-015', 'Generator',
        (SELECT id FROM locations WHERE name = 'Ayushman Hospital'),
        (SELECT id FROM categories WHERE name = 'General'),
        'operational'::equipment_status, '2024-11-19'::date, '2025-02-19'::date),

    ('EQ-016', 'Lab Equipment',
        (SELECT id FROM locations WHERE name = 'Ayushman Hospital'),
        (SELECT id FROM categories WHERE name = 'Lab'),
        'operational'::equipment_status, '2024-11-16'::date, '2025-02-16'::date),

    ('EQ-017', 'X-Ray',
        (SELECT id FROM locations WHERE name = 'Ayushman Hospital'),
        (SELECT id FROM categories WHERE name = 'Lab'),
        'operational'::equipment_status, '2024-11-09'::date, '2025-02-09'::date),

    ('EQ-018', 'Ultrasound',
        (SELECT id FROM locations WHERE name = 'Ayushman Hospital'),
        (SELECT id FROM categories WHERE name = 'Lab'),
        'operational'::equipment_status, '2024-11-17'::date, '2025-02-17'::date),

    ('EQ-019', 'Dialysis Machine',
        (SELECT id FROM locations WHERE name = 'Ayushman Hospital'),
        (SELECT id FROM categories WHERE name = 'Ward'),
        'operational'::equipment_status, '2024-11-21'::date, '2025-02-21'::date),

    ('EQ-023', 'Anesthesia Machine',
        (SELECT id FROM locations WHERE name = 'Ayushman Hospital'),
        (SELECT id FROM categories WHERE name = 'OT'),
        'operational'::equipment_status, '2024-11-20'::date, '2025-02-20'::date),

    ('EQ-025', 'Treadmill',
        (SELECT id FROM locations WHERE name = 'Ayushman Hospital'),
        (SELECT id FROM categories WHERE name = 'Physiotherapy'),
        'operational'::equipment_status, '2024-11-10'::date, '2025-02-10'::date),

    ('EQ-027', 'IV Stand',
        (SELECT id FROM locations WHERE name = 'Ayushman Hospital'),
        (SELECT id FROM categories WHERE name = 'Ward'),
        'operational'::equipment_status, '2024-11-12'::date, '2025-02-12'::date)

ON CONFLICT (equipment_id)
DO UPDATE SET
    name = EXCLUDED.name,
    location_id = EXCLUDED.location_id,
    category_id = EXCLUDED.category_id,
    status = EXCLUDED.status,
    last_maintenance_date = EXCLUDED.last_maintenance_date,
    next_maintenance_date = EXCLUDED.next_maintenance_date;

-- Verify insertion
SELECT COUNT(*) as total_equipment FROM equipment;

-- Show sample data
SELECT
    equipment_id,
    name,
    status
FROM equipment
ORDER BY equipment_id
LIMIT 5;
