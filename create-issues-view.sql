-- Create View for Issues with Complete Details
-- This view joins issues, equipment, locations, and categories tables
-- to show complete information including hospital name

-- =============================================
-- ISSUES WITH DETAILS VIEW
-- =============================================

CREATE OR REPLACE VIEW issues_with_details AS
SELECT
    -- Issue fields
    i.id,
    i.equipment_id,
    i.title,
    i.description,
    i.severity,
    i.status,
    i.reported_by,
    i.reported_at,
    i.assigned_to,
    i.acknowledged_at,
    i.resolved_at,
    i.closed_at,
    i.resolution_notes,
    i.attachments,
    i.created_at,
    i.updated_at,

    -- Equipment details
    e.equipment_id as equipment_code,
    e.name as equipment_name,
    e.status as equipment_status,
    e.manufacturer,
    e.model_number,
    e.serial_number,
    e.last_maintenance_date,
    e.next_maintenance_date,

    -- Location details
    l.id as location_id,
    l.name as hospital_name,
    l.address as hospital_address,
    l.contact_number as hospital_contact,

    -- Category details
    c.id as category_id,
    c.name as category_name,
    c.color as category_color

FROM issues i
LEFT JOIN equipment e ON i.equipment_id = e.id
LEFT JOIN locations l ON e.location_id = l.id
LEFT JOIN categories c ON e.category_id = c.id
ORDER BY i.created_at DESC;

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON VIEW issues_with_details IS 'Complete view of issues with equipment, location, and category details';

-- =============================================
-- USAGE EXAMPLES
-- =============================================

-- Example 1: Get all issues with hospital information
-- SELECT * FROM issues_with_details;

-- Example 2: Get issues for a specific hospital
-- SELECT * FROM issues_with_details WHERE hospital_name = 'Hope Hospital';

-- Example 3: Get open issues by hospital
-- SELECT
--     hospital_name,
--     COUNT(*) as open_issues_count
-- FROM issues_with_details
-- WHERE status IN ('reported', 'acknowledged', 'in_progress')
-- GROUP BY hospital_name;

-- Example 4: Get critical issues
-- SELECT * FROM issues_with_details
-- WHERE severity = 'critical'
-- AND status != 'closed';

-- Example 5: Get issues by category and hospital
-- SELECT
--     hospital_name,
--     category_name,
--     COUNT(*) as issue_count
-- FROM issues_with_details
-- GROUP BY hospital_name, category_name
-- ORDER BY hospital_name, issue_count DESC;

-- =============================================
-- GRANT PERMISSIONS (if needed)
-- =============================================

-- Grant SELECT permission to authenticated users
-- GRANT SELECT ON issues_with_details TO authenticated;

-- Grant SELECT permission to anon users (if you want public access)
-- GRANT SELECT ON issues_with_details TO anon;
