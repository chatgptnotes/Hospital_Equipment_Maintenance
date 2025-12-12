# Supabase Data Viewing Guide
## Hospital Equipment Maintenance System

---

## 📊 Overview

Yeh guide aapko batata hai ki Supabase mein stored data kaise dekhen, especially:
- **Issues** (Equipment problems)
- **Hospital information** (Hope Hospital vs Ayushman Hospital)
- **Equipment details**
- **Statistics aur reports**

---

## 🗂️ Database Structure

```
issues table
    ↓ (equipment_id)
equipment table
    ↓ (location_id)
locations table
    → "Hope Hospital" / "Ayushman Hospital"
```

---

## 🔍 Method 1: Supabase Dashboard (Simple)

### Step 1: Open Table Editor
1. Supabase Dashboard kholen: https://urllzokfeyuledjcwgfc.supabase.co
2. Left sidebar → **Table Editor**

### Step 2: View Issues
3. **issues** table select karein
4. Aapko dikhai dega:
   - ✅ Issue title, description
   - ✅ Reported by, status
   - ✅ `equipment_id` (UUID format)
   - ❌ Hospital name directly nahi dikhega

### Step 3: View Complete Details (With View)
3. **issues_with_details** view select karein (agar create kar chuke hain)
4. Aapko dikhai dega:
   - ✅ Issue details
   - ✅ Equipment name (e.g., "Suction Machine")
   - ✅ **Hospital name** (e.g., "Hope Hospital")
   - ✅ Category (e.g., "ICU")
   - ✅ Equipment code (e.g., "EQ-001")

---

## 💻 Method 2: SQL Queries (Powerful)

### Query 1: All Issues with Hospital Information

```sql
SELECT
    i.title as issue_title,
    i.description,
    i.severity,
    i.status,
    i.reported_by,
    i.created_at,
    e.equipment_id,
    e.name as equipment_name,
    l.name as hospital_name,
    c.name as category
FROM issues i
JOIN equipment e ON i.equipment_id = e.id
JOIN locations l ON e.location_id = l.id
LEFT JOIN categories c ON e.category_id = c.id
ORDER BY i.created_at DESC;
```

**Output Example:**
```
issue_title              | hospital_name      | equipment_name  | status
-------------------------|-------------------|-----------------|----------
Motor not starting       | Hope Hospital     | Suction Machine | reported
Pressure gauge broken    | Ayushman Hospital | Air Compressor  | in_progress
```

---

### Query 2: Issues Filtered by Hospital

**Hope Hospital ke issues:**
```sql
SELECT
    i.title,
    i.severity,
    i.status,
    e.name as equipment_name,
    i.created_at
FROM issues i
JOIN equipment e ON i.equipment_id = e.id
JOIN locations l ON e.location_id = l.id
WHERE l.name = 'Hope Hospital'
ORDER BY i.created_at DESC;
```

**Ayushman Hospital ke issues:**
```sql
-- Same query, replace with 'Ayushman Hospital'
WHERE l.name = 'Ayushman Hospital'
```

---

### Query 3: Open Issues Count by Hospital

```sql
SELECT
    l.name as hospital_name,
    COUNT(*) as open_issues_count
FROM issues i
JOIN equipment e ON i.equipment_id = e.id
JOIN locations l ON e.location_id = l.id
WHERE i.status IN ('reported', 'acknowledged', 'in_progress')
GROUP BY l.name
ORDER BY open_issues_count DESC;
```

**Output:**
```
hospital_name      | open_issues_count
-------------------|------------------
Hope Hospital      | 5
Ayushman Hospital  | 3
```

---

### Query 4: Issues by Severity and Hospital

```sql
SELECT
    l.name as hospital_name,
    i.severity,
    COUNT(*) as count
FROM issues i
JOIN equipment e ON i.equipment_id = e.id
JOIN locations l ON e.location_id = l.id
GROUP BY l.name, i.severity
ORDER BY l.name,
    CASE i.severity
        WHEN 'critical' THEN 1
        WHEN 'major' THEN 2
        WHEN 'moderate' THEN 3
        WHEN 'minor' THEN 4
    END;
```

---

### Query 5: Recent Issues (Last 7 Days) by Hospital

```sql
SELECT
    l.name as hospital_name,
    i.title,
    i.severity,
    e.name as equipment_name,
    i.created_at
FROM issues i
JOIN equipment e ON i.equipment_id = e.id
JOIN locations l ON e.location_id = l.id
WHERE i.created_at >= NOW() - INTERVAL '7 days'
ORDER BY i.created_at DESC;
```

---

## 🎯 Method 3: Using the View (Easiest)

### Step 1: Create the View
Pehle `create-issues-view.sql` file run karein SQL Editor mein.

### Step 2: Use the View

**All issues with complete details:**
```sql
SELECT * FROM issues_with_details;
```

**Hope Hospital ke issues:**
```sql
SELECT * FROM issues_with_details
WHERE hospital_name = 'Hope Hospital';
```

**Ayushman Hospital ke critical issues:**
```sql
SELECT * FROM issues_with_details
WHERE hospital_name = 'Ayushman Hospital'
AND severity = 'critical';
```

**Open issues grouped by hospital:**
```sql
SELECT
    hospital_name,
    COUNT(*) as count
FROM issues_with_details
WHERE status IN ('reported', 'acknowledged', 'in_progress')
GROUP BY hospital_name;
```

---

## 📱 Method 4: Using API/Service (In Code)

### Example 1: Get All Issues with Hospital Details

```typescript
import { issueReportSimpleService } from './services/issueReportSimple.service';

// Get all issues with hospital name
const issues = await issueReportSimpleService.getAllIssuesWithHospitalDetails();

console.log(issues);
// Output: Array of issues with hospital_name, equipment_name, etc.
```

### Example 2: Get Issues for Specific Hospital

```typescript
// Hope Hospital issues
const hopeIssues = await issueReportSimpleService.getIssuesByHospital('Hope Hospital');

// Ayushman Hospital issues
const ayushmanIssues = await issueReportSimpleService.getIssuesByHospital('Ayushman Hospital');
```

### Example 3: Get Issue Statistics

```typescript
const stats = await issueReportSimpleService.getIssueStatsByHospital();

console.log(stats);
/*
{
  "Hope Hospital": {
    total: 10,
    open: 5,
    resolved: 3,
    closed: 2,
    critical: 1,
    major: 2,
    moderate: 5,
    minor: 2
  },
  "Ayushman Hospital": {
    ...
  }
}
*/
```

---

## 🔧 Quick Actions in Supabase Dashboard

### Export Data to CSV
1. Table Editor → **issues_with_details** view
2. Click **Export** button (top right)
3. Select **CSV** format
4. Download karein

### Filter in Dashboard
1. Table Editor → **issues_with_details**
2. Column header par click karein
3. Filter icon use karein
4. Hospital name filter karein: `hospital_name = "Hope Hospital"`

### Sort Data
1. Column header par click karein
2. Ascending/Descending sort karein

---

## 📋 Common Use Cases

### Use Case 1: Daily Report - Hospital wise Issues

```sql
-- Today's issues by hospital
SELECT
    hospital_name,
    equipment_name,
    title,
    severity,
    reported_by,
    created_at
FROM issues_with_details
WHERE DATE(created_at) = CURRENT_DATE
ORDER BY hospital_name, severity DESC;
```

### Use Case 2: Critical Issues Alert

```sql
-- All critical issues that are still open
SELECT
    hospital_name,
    equipment_code,
    equipment_name,
    title,
    reported_by,
    created_at
FROM issues_with_details
WHERE severity = 'critical'
AND status NOT IN ('resolved', 'closed')
ORDER BY created_at DESC;
```

### Use Case 3: Equipment Maintenance Report

```sql
-- Issues by equipment type and hospital
SELECT
    hospital_name,
    category_name,
    COUNT(*) as issue_count,
    COUNT(CASE WHEN status IN ('reported', 'in_progress') THEN 1 END) as open_count
FROM issues_with_details
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY hospital_name, category_name
ORDER BY hospital_name, issue_count DESC;
```

---

## 🎨 Visualization Ideas

### Dashboard Queries

**1. Hospital-wise Issue Count (Pie Chart)**
```sql
SELECT hospital_name, COUNT(*) as count
FROM issues_with_details
GROUP BY hospital_name;
```

**2. Issues Trend (Line Chart)**
```sql
SELECT
    DATE(created_at) as date,
    hospital_name,
    COUNT(*) as count
FROM issues_with_details
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at), hospital_name
ORDER BY date;
```

**3. Severity Distribution (Bar Chart)**
```sql
SELECT
    hospital_name,
    severity,
    COUNT(*) as count
FROM issues_with_details
GROUP BY hospital_name, severity;
```

---

## 🚨 Troubleshooting

### Problem: View not showing data

**Solution:**
```sql
-- Check if view exists
SELECT * FROM pg_views WHERE viewname = 'issues_with_details';

-- Recreate view
DROP VIEW IF EXISTS issues_with_details;
-- Then run create-issues-view.sql again
```

### Problem: Hospital name showing NULL

**Reason:** Equipment record mein `location_id` NULL hai

**Check:**
```sql
SELECT * FROM equipment WHERE location_id IS NULL;
```

**Fix:**
```sql
UPDATE equipment
SET location_id = (SELECT id FROM locations WHERE name = 'Hope Hospital')
WHERE equipment_id = 'EQ-001';
```

---

## 📞 Support Queries

### Get all equipment without location
```sql
SELECT equipment_id, name
FROM equipment
WHERE location_id IS NULL;
```

### Get issues count per equipment
```sql
SELECT
    equipment_name,
    hospital_name,
    COUNT(*) as issue_count
FROM issues_with_details
GROUP BY equipment_name, hospital_name
ORDER BY issue_count DESC;
```

---

## ✅ Summary

| Method | Best For | Shows Hospital? |
|--------|----------|----------------|
| **Table Editor (issues table)** | Quick view | ❌ No |
| **Table Editor (issues_with_details)** | Complete info | ✅ Yes |
| **SQL Queries** | Custom reports | ✅ Yes |
| **API/Service** | In application | ✅ Yes |

**Recommendation:** Use `issues_with_details` view for easiest data viewing with hospital information! 🎯
