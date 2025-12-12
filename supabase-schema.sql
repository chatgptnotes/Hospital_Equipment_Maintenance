    -- Hospital Equipment Maintenance System Database Schema
    -- Supabase PostgreSQL Schema

    -- Enable UUID extension
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    -- =============================================
    -- LOCATIONS TABLE
    -- =============================================
    CREATE TABLE locations (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL UNIQUE,
        address TEXT,
        contact_number VARCHAR(20),
        email VARCHAR(255),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- =============================================
    -- CATEGORIES TABLE
    -- =============================================
    CREATE TABLE categories (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        color VARCHAR(7), -- For UI color coding (e.g., #FF0000)
        icon VARCHAR(50),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- =============================================
    -- EQUIPMENT STATUS ENUM
    -- =============================================
    CREATE TYPE equipment_status AS ENUM ('operational', 'maintenance', 'out_of_service', 'repair');

    -- =============================================
    -- EQUIPMENT TABLE
    -- =============================================
    CREATE TABLE equipment (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        equipment_id VARCHAR(50) NOT NULL UNIQUE, -- e.g., EQ-001, EQ-020
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
        location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
        status equipment_status DEFAULT 'operational',
        manufacturer VARCHAR(255),
        model_number VARCHAR(100),
        serial_number VARCHAR(100),
        purchase_date DATE,
        warranty_expiry_date DATE,
        last_maintenance_date DATE,
        next_maintenance_date DATE,
        maintenance_frequency_days INTEGER DEFAULT 90, -- Default 90 days
        purchase_cost DECIMAL(12, 2),
        current_value DECIMAL(12, 2),
        notes TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- =============================================
    -- MAINTENANCE PRIORITY ENUM
    -- =============================================
    CREATE TYPE maintenance_priority AS ENUM ('low', 'medium', 'high', 'critical');

    -- =============================================
    -- MAINTENANCE STATUS ENUM
    -- =============================================
    CREATE TYPE maintenance_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled');

    -- =============================================
    -- MAINTENANCE RECORDS TABLE
    -- =============================================
    CREATE TABLE maintenance_records (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE,
        maintenance_type VARCHAR(100), -- e.g., 'Preventive', 'Corrective', 'Calibration'
        description TEXT NOT NULL,
        priority maintenance_priority DEFAULT 'medium',
        status maintenance_status DEFAULT 'scheduled',
        scheduled_date TIMESTAMP WITH TIME ZONE,
        started_at TIMESTAMP WITH TIME ZONE,
        completed_at TIMESTAMP WITH TIME ZONE,
        performed_by VARCHAR(255),
        technician_name VARCHAR(255),
        technician_contact VARCHAR(20),
        cost DECIMAL(10, 2),
        parts_replaced TEXT[],
        notes TEXT,
        next_maintenance_date DATE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- =============================================
    -- ISSUE SEVERITY ENUM
    -- =============================================
    CREATE TYPE issue_severity AS ENUM ('minor', 'moderate', 'major', 'critical');

    -- =============================================
    -- ISSUE STATUS ENUM
    -- =============================================
    CREATE TYPE issue_status AS ENUM ('reported', 'acknowledged', 'in_progress', 'resolved', 'closed');

    -- =============================================
    -- ISSUES TABLE
    -- =============================================
    CREATE TABLE issues (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        severity issue_severity DEFAULT 'moderate',
        status issue_status DEFAULT 'reported',
        reported_by VARCHAR(255) NOT NULL,
        reported_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        assigned_to VARCHAR(255),
        acknowledged_at TIMESTAMP WITH TIME ZONE,
        resolved_at TIMESTAMP WITH TIME ZONE,
        closed_at TIMESTAMP WITH TIME ZONE,
        resolution_notes TEXT,
        attachments TEXT[], -- Array of file URLs
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- =============================================
    -- ACTIVITY TYPE ENUM
    -- =============================================
    CREATE TYPE activity_type AS ENUM (
        'issue_reported',
        'issue_acknowledged',
        'issue_resolved',
        'maintenance_scheduled',
        'maintenance_completed',
        'equipment_added',
        'equipment_updated',
        'status_changed'
    );

    -- =============================================
    -- ACTIVITY LOG TABLE
    -- =============================================
    CREATE TABLE activity_log (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        activity_type activity_type NOT NULL,
        equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE,
        issue_id UUID REFERENCES issues(id) ON DELETE CASCADE,
        maintenance_id UUID REFERENCES maintenance_records(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        performed_by VARCHAR(255),
        metadata JSONB, -- Additional flexible data
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- =============================================
    -- USERS/STAFF TABLE (Optional - for authentication)
    -- =============================================
    CREATE TABLE staff (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) NOT NULL UNIQUE,
        full_name VARCHAR(255) NOT NULL,
        role VARCHAR(50), -- e.g., 'admin', 'technician', 'manager'
        phone VARCHAR(20),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- =============================================
    -- INDEXES FOR PERFORMANCE
    -- =============================================
    CREATE INDEX idx_equipment_location ON equipment(location_id);
    CREATE INDEX idx_equipment_category ON equipment(category_id);
    CREATE INDEX idx_equipment_status ON equipment(status);
    CREATE INDEX idx_equipment_next_maintenance ON equipment(next_maintenance_date);
    CREATE INDEX idx_maintenance_equipment ON maintenance_records(equipment_id);
    CREATE INDEX idx_maintenance_status ON maintenance_records(status);
    CREATE INDEX idx_issues_equipment ON issues(equipment_id);
    CREATE INDEX idx_issues_status ON issues(status);
    CREATE INDEX idx_activity_log_created ON activity_log(created_at DESC);
    CREATE INDEX idx_activity_log_equipment ON activity_log(equipment_id);

    -- =============================================
    -- UPDATED_AT TRIGGER FUNCTION
    -- =============================================
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    -- Apply updated_at trigger to all tables
    CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

    CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

    CREATE TRIGGER update_equipment_updated_at BEFORE UPDATE ON equipment
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

    CREATE TRIGGER update_maintenance_records_updated_at BEFORE UPDATE ON maintenance_records
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

    CREATE TRIGGER update_issues_updated_at BEFORE UPDATE ON issues
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

    CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON staff
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

    -- =============================================
    -- ROW LEVEL SECURITY (RLS) POLICIES
    -- =============================================
    -- Enable RLS on all tables
    ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
    ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
    ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
    ALTER TABLE maintenance_records ENABLE ROW LEVEL SECURITY;
    ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
    ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
    ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

    -- Create policies (Example - adjust based on your auth requirements)
    -- Allow authenticated users to read all data
    CREATE POLICY "Allow authenticated read access" ON locations FOR SELECT USING (auth.role() = 'authenticated');
    CREATE POLICY "Allow authenticated read access" ON categories FOR SELECT USING (auth.role() = 'authenticated');
    CREATE POLICY "Allow authenticated read access" ON equipment FOR SELECT USING (auth.role() = 'authenticated');
    CREATE POLICY "Allow authenticated read access" ON maintenance_records FOR SELECT USING (auth.role() = 'authenticated');
    CREATE POLICY "Allow authenticated read access" ON issues FOR SELECT USING (auth.role() = 'authenticated');
    CREATE POLICY "Allow authenticated read access" ON activity_log FOR SELECT USING (auth.role() = 'authenticated');
    CREATE POLICY "Allow authenticated read access" ON staff FOR SELECT USING (auth.role() = 'authenticated');

    -- Allow authenticated users to insert/update (adjust as needed)
    CREATE POLICY "Allow authenticated write access" ON equipment FOR ALL USING (auth.role() = 'authenticated');
    CREATE POLICY "Allow authenticated write access" ON maintenance_records FOR ALL USING (auth.role() = 'authenticated');
    CREATE POLICY "Allow authenticated write access" ON issues FOR ALL USING (auth.role() = 'authenticated');
    CREATE POLICY "Allow authenticated write access" ON activity_log FOR ALL USING (auth.role() = 'authenticated');

    -- =============================================
    -- SEED DATA
    -- =============================================

    -- Insert Locations
    INSERT INTO locations (name, address, contact_number) VALUES
    ('Hope Hospital', '123 Medical Center Drive', '+91-9876543210'),
    ('Ayushman Hospital', '456 Healthcare Avenue', '+91-9876543211');

    -- Insert Categories
    INSERT INTO categories (name, description, color) VALUES
    ('ICU', 'Intensive Care Unit Equipment', '#9333EA'),
    ('OT', 'Operation Theatre Equipment', '#3B82F6'),
    ('Lab', 'Laboratory Equipment', '#10B981'),
    ('Physiotherapy', 'Physiotherapy Department Equipment', '#F59E0B'),
    ('Ward', 'General Ward Equipment', '#EF4444'),
    ('General', 'General Hospital Equipment', '#6B7280');

    -- Insert Sample Equipment
    INSERT INTO equipment (equipment_id, name, category_id, location_id, status, last_maintenance_date, next_maintenance_date) VALUES
    ('EQ-001', 'Suction Machine', (SELECT id FROM categories WHERE name = 'ICU'), (SELECT id FROM locations WHERE name = 'Hope Hospital'), 'operational', '2024-11-15', '2025-02-15'),
    ('EQ-020', 'Patient Monitor', (SELECT id FROM categories WHERE name = 'ICU'), (SELECT id FROM locations WHERE name = 'Hope Hospital'), 'operational', '2024-11-23', '2025-02-23'),
    ('EQ-021', 'Ventilator', (SELECT id FROM categories WHERE name = 'ICU'), (SELECT id FROM locations WHERE name = 'Hope Hospital'), 'operational', '2024-11-26', '2025-02-26');

    -- Insert Sample Activity Log
    INSERT INTO activity_log (activity_type, equipment_id, title, description, created_at) VALUES
    ('issue_reported', (SELECT id FROM equipment WHERE equipment_id = 'EQ-001'), 'Issue Reported', 'Equipment maintenance issue reported', '2024-11-10 10:30:00+00');

    -- =============================================
    -- HELPFUL VIEWS
    -- =============================================

    -- View for equipment with location and category names
    CREATE VIEW equipment_details AS
    SELECT
        e.id,
        e.equipment_id,
        e.name,
        e.status,
        c.name AS category_name,
        l.name AS location_name,
        e.last_maintenance_date,
        e.next_maintenance_date,
        e.manufacturer,
        e.model_number,
        e.created_at,
        e.updated_at
    FROM equipment e
    LEFT JOIN categories c ON e.category_id = c.id
    LEFT JOIN locations l ON e.location_id = l.id
    WHERE e.is_active = true;

    -- View for recent activity
    CREATE VIEW recent_activity AS
    SELECT
        al.id,
        al.activity_type,
        al.title,
        al.description,
        al.performed_by,
        e.name AS equipment_name,
        e.equipment_id,
        al.created_at
    FROM activity_log al
    LEFT JOIN equipment e ON al.equipment_id = e.id
    ORDER BY al.created_at DESC;

    -- View for upcoming maintenance
    CREATE VIEW upcoming_maintenance AS
    SELECT
        e.id,
        e.equipment_id,
        e.name AS equipment_name,
        c.name AS category_name,
        l.name AS location_name,
        e.next_maintenance_date,
        e.last_maintenance_date,
        e.status
    FROM equipment e
    LEFT JOIN categories c ON e.category_id = c.id
    LEFT JOIN locations l ON e.location_id = l.id
    WHERE e.next_maintenance_date IS NOT NULL
    AND e.is_active = true
    ORDER BY e.next_maintenance_date ASC;
