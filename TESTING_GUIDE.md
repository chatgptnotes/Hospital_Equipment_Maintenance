# 🧪 Testing Guide - Issue Reporting System

## ✅ Database Setup Complete!

Your equipment data is now in Supabase. Let's test the complete flow.

---

## 🚀 Step 1: Start the Application

```bash
cd /Users/murali/hospital-maintenance-app
npm run dev
```

Application will open at: http://localhost:5173

---

## 🎯 Step 2: Test Issue Reporting

### Test Case 1: Report Issue for Hope Hospital Equipment

1. **Open Hope Hospital Tab**
2. **Find Equipment: EQ-002 (Air Compressor)**
3. **Click "Report Issue" button**
4. **Fill the form:**
   ```
   Equipment ID: EQ-002
   Issue Description: Compressor making unusual noise and vibrating
   Reported By: Aman
   Severity: Moderate
   ```
5. **Click Submit**
6. **Expected Result:**
   - Success message: "Issue reported successfully!"
   - Equipment status updates in UI
   - Issue appears in the equipment card

### Test Case 2: Report Critical Issue

1. **Find Equipment: EQ-007 (Cathlab)**
2. **Click "Report Issue"**
3. **Fill the form:**
   ```
   Equipment ID: EQ-007
   Issue Description: System not powering on - urgent repair needed
   Reported By: Sachin
   Severity: Critical
   ```
4. **Click Submit**
5. **Expected Result:**
   - Equipment status changes to "Needs Repair"
   - Red badge appears on equipment card

### Test Case 3: Report Issue for Ayushman Hospital

1. **Switch to Ayushman Hospital Tab**
2. **Find Equipment: EQ-013 (Lift)**
3. **Report Issue:**
   ```
   Equipment ID: EQ-013
   Issue Description: Lift door not closing properly
   Reported By: Kashish
   Severity: Major
   ```

---

## 🔍 Step 3: Verify in Supabase

After reporting issues, verify in Supabase:

### Check Issues Table

1. Go to Supabase Dashboard → Table Editor
2. Open **`issues`** table
3. You should see new records with:
   - ✅ Equipment ID (UUID)
   - ✅ Title
   - ✅ Description
   - ✅ Severity
   - ✅ Status: 'reported'
   - ✅ Reported By
   - ✅ Created timestamp

### Run Verification Query

```sql
-- View all issues with equipment details
SELECT
    i.id,
    i.title,
    i.description,
    i.severity,
    i.status,
    i.reported_by,
    e.equipment_id,
    e.name as equipment_name,
    l.name as hospital_name,
    i.created_at
FROM issues i
JOIN equipment e ON i.equipment_id = e.id
JOIN locations l ON e.location_id = l.id
ORDER BY i.created_at DESC;
```

---

## 📊 Step 4: Check Activity Log

```sql
-- View recent activities
SELECT
    al.activity_type,
    al.title,
    al.description,
    al.performed_by,
    e.equipment_id,
    e.name as equipment_name,
    al.created_at
FROM activity_log al
JOIN equipment e ON al.equipment_id = e.id
ORDER BY al.created_at DESC
LIMIT 10;
```

---

## 🎨 Step 5: UI Features to Test

### Equipment Cards
- ✅ Status badge colors (Green = Operational, Red = Needs Repair)
- ✅ Category tags
- ✅ Last maintenance date
- ✅ Issue description display
- ✅ Reported by name

### Filters
- ✅ Filter by Status
- ✅ Filter by Category
- ✅ Search by equipment name

### Issue Report Modal
- ✅ Equipment ID auto-fill
- ✅ Staff member dropdown
- ✅ Severity selection
- ✅ Issue description textarea
- ✅ Submit button

### Real-time Updates
- ✅ Equipment status updates after issue submission
- ✅ Issue details appear on equipment card
- ✅ Activity log updates

---

## 🔧 Expected Data Flow

```
User Reports Issue
      ↓
Frontend (App.jsx)
      ↓
issueReportSimple.service.ts
      ↓
Supabase Database
      ↓
3 Database Operations:
  1. Insert into 'issues' table
  2. Update 'equipment' status
  3. Insert into 'activity_log'
      ↓
UI Updates with new data
```

---

## 📈 Check Dashboard Statistics

In your application dashboard, you should see:

**Hope Hospital:**
- Total Equipment: 15
- Operational: Will decrease as you report issues
- Needs Repair: Will increase

**Ayushman Hospital:**
- Total Equipment: 12
- Already has 2 items in repair (EQ-003, EQ-004)

---

## 🐛 Troubleshooting

### Issue: "Equipment not found"
**Solution:** Equipment ID mismatch
```sql
-- Check if equipment exists
SELECT equipment_id, name FROM equipment
WHERE equipment_id = 'EQ-002';
```

### Issue: "Failed to submit"
**Check:**
1. Browser console for error messages
2. Network tab for API responses
3. Supabase logs in Dashboard

### Issue: "RLS Policy Error"
**Solution:** Run COMPLETE_RLS_FIX.sql again
```sql
ALTER TABLE public.issues DISABLE ROW LEVEL SECURITY;
```

---

## ✅ Success Checklist

After testing, verify:

- [ ] 27 equipment records in database
- [ ] Can report issues for Hope Hospital equipment
- [ ] Can report issues for Ayushman Hospital equipment
- [ ] Equipment status updates after issue report
- [ ] Issues appear in Supabase `issues` table
- [ ] Activity log records are created
- [ ] UI shows updated equipment status
- [ ] Mock data still displays in UI
- [ ] Hospital tabs switch correctly

---

## 🎯 Next Steps (Optional Enhancements)

1. **Photo Upload:**
   - Create Supabase Storage bucket: `equipment-photos`
   - Enable public access
   - Update issue report to include photos

2. **Issue Resolution:**
   - Add "Mark as Resolved" button
   - Update issue status
   - Log resolution in activity log

3. **Maintenance Scheduling:**
   - Auto-schedule maintenance based on last maintenance date
   - Send notifications for upcoming maintenance

4. **Reports & Analytics:**
   - Generate maintenance reports
   - Equipment downtime tracking
   - Category-wise issue statistics

---

## 📞 Support

If you encounter any issues:

1. **Check Browser Console** (F12 → Console tab)
2. **Check Supabase Logs** (Dashboard → Logs)
3. **Verify .env file** has correct credentials
4. **Check Network requests** (F12 → Network tab)

---

**Everything is set up! Start testing now! 🚀**

Run: `npm run dev`
