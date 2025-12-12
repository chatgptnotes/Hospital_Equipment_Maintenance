# Equipment Data Insertion Guide

## ✅ Status: INSERT_EQUIPMENT_FIXED.sql is Ready!

The ENUM type casting error has been fixed. Follow these steps:

---

## 📋 Step 1: Run INSERT_EQUIPMENT_FIXED.sql

1. Open Supabase Dashboard: https://urllzokfeyuledjcwgfc.supabase.co
2. Go to **SQL Editor** (left sidebar)
3. Click **"New Query"**
4. Open the file: `/Users/murali/hospital-maintenance-app/INSERT_EQUIPMENT_FIXED.sql`
5. Copy ALL content from the file
6. Paste into Supabase SQL Editor
7. Click **"Run"** button

---

## ✅ Expected Result

You should see:

```
total_equipment
27

equipment_id | name            | status
EQ-001       | Suction Machine | operational
EQ-002       | Air Compressor  | operational
EQ-005       | Lift           | operational
EQ-007       | Cathlab        | repair
EQ-010       | C-arm          | operational
```

---

## 🔍 Step 2: Verify Data

Run this query in SQL Editor:

```sql
-- Check total count
SELECT COUNT(*) as total_equipment FROM equipment;

-- Check by hospital
SELECT
    l.name as hospital,
    COUNT(*) as equipment_count
FROM equipment e
JOIN locations l ON e.location_id = l.id
GROUP BY l.name
ORDER BY l.name;

-- Expected output:
-- Hope Hospital: 15
-- Ayushman Hospital: 12
```

---

## 🧪 Step 3: Test Issue Reporting

1. Open your React application: `npm run dev`
2. Go to **Hope Hospital** tab
3. Find equipment **EQ-002** (Air Compressor)
4. Click **"Report Issue"** button
5. Fill in the form:
   - Equipment ID: `EQ-002`
   - Issue Description: `Test issue - compressor making noise`
   - Reported By: `Test User`
   - Severity: `Moderate`
6. Submit the form
7. Check the success message

---

## 🐛 If You Get Errors

### Error: "Equipment not found"
- Run the verification query in Step 2
- Make sure INSERT_EQUIPMENT_FIXED.sql completed successfully
- Check that `total_equipment = 27`

### Error: "Row Level Security"
- Make sure you ran COMPLETE_RLS_FIX.sql
- Verify RLS is disabled:
  ```sql
  SELECT tablename, rowsecurity
  FROM pg_tables
  WHERE schemaname = 'public';
  ```
  All tables should show `rowsecurity = false`

### Error: "Type mismatch"
- This should be fixed in INSERT_EQUIPMENT_FIXED.sql
- All status values now have proper casting: `'operational'::equipment_status`

---

## 📊 All Equipment IDs That Will Be Inserted

### Hope Hospital (15 items):
- EQ-001: Suction Machine (ICU)
- EQ-002: Air Compressor (General)
- EQ-005: Lift (General)
- EQ-006: O2 Plant (General)
- EQ-007: Cathlab (OT) - **Status: repair**
- EQ-008: Generator (General)
- EQ-009: Lab Equipment (Lab)
- EQ-010: C-arm (OT)
- EQ-011: X-Ray (Lab)
- EQ-012: Ultrasound (Lab)
- EQ-020: Patient Monitor (ICU)
- EQ-021: Ventilator (ICU)
- EQ-022: OT Table (OT)
- EQ-024: TENS Unit (Physiotherapy)
- EQ-026: Hospital Bed (Ward)

### Ayushman Hospital (12 items):
- EQ-003: Suction Machine (ICU) - **Status: repair**
- EQ-004: Air Compressor (General) - **Status: repair**
- EQ-013: Lift (General)
- EQ-014: O2 Plant (General)
- EQ-015: Generator (General)
- EQ-016: Lab Equipment (Lab)
- EQ-017: X-Ray (Lab)
- EQ-018: Ultrasound (Lab)
- EQ-019: Dialysis Machine (Ward)
- EQ-023: Anesthesia Machine (OT)
- EQ-025: Treadmill (Physiotherapy)
- EQ-027: IV Stand (Ward)

---

## ✨ Next Steps After Successful Insertion

1. ✅ All 27 equipment records inserted
2. ✅ Test issue reporting (Step 3)
3. ✅ Verify issues display in UI
4. ✅ Check that equipment status updates when issues are reported
5. ✅ View data in Supabase Table Editor

---

## 🎯 Key Points

- **Mock data is preserved** in App.jsx (as you requested!)
- Issue data comes from Supabase database
- Equipment list shows in UI from mock data
- When issue is reported, it merges with equipment display
- 27 equipment records match exactly with mock data structure

---

## 📞 Support

If you encounter any issues:
1. Check browser console for detailed error messages
2. Check Supabase logs in Dashboard
3. Verify all tables have data using Table Editor
4. Make sure .env file has correct credentials

---

**Ready to proceed? Run INSERT_EQUIPMENT_FIXED.sql now! 🚀**
