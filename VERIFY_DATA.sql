-- =============================================
-- VERIFICATION QUERIES
-- Run these to confirm everything is working
-- =============================================

-- 1. Check total equipment count (should be 27)
SELECT COUNT(*) as total_equipment FROM equipment;

-- 2. Check equipment by hospital
SELECT
    l.name as hospital,
    COUNT(*) as equipment_count
FROM equipment e
JOIN locations l ON e.location_id = l.id
GROUP BY l.name
ORDER BY l.name;

-- 3. Check equipment by status
SELECT
    status,
    COUNT(*) as count
FROM equipment
GROUP BY status
ORDER BY status;

-- 4. View all equipment with hospital and category
SELECT
    e.equipment_id,
    e.name as equipment_name,
    l.name as hospital,
    c.name as category,
    e.status,
    e.last_maintenance_date,
    e.next_maintenance_date
FROM equipment e
JOIN locations l ON e.location_id = l.id
JOIN categories c ON e.category_id = c.id
ORDER BY l.name, e.equipment_id;

-- 5. Check specific equipment (EQ-001, EQ-002, EQ-003)
SELECT
    e.equipment_id,
    e.name,
    l.name as hospital,
    c.name as category,
    e.status
FROM equipment e
JOIN locations l ON e.location_id = l.id
JOIN categories c ON e.category_id = c.id
WHERE e.equipment_id IN ('EQ-001', 'EQ-002', 'EQ-003')
ORDER BY e.equipment_id;

-- 6. Check equipment needing maintenance soon (next 30 days)
SELECT
    e.equipment_id,
    e.name,
    l.name as hospital,
    e.next_maintenance_date,
    (e.next_maintenance_date - CURRENT_DATE) as days_until_maintenance
FROM equipment e
JOIN locations l ON e.location_id = l.id
WHERE e.next_maintenance_date <= CURRENT_DATE + INTERVAL '30 days'
ORDER BY e.next_maintenance_date;

-- Expected Results:
-- total_equipment: 27
-- Hope Hospital: 15
-- Ayushman Hospital: 12
-- Operational: 24
-- Repair: 3
