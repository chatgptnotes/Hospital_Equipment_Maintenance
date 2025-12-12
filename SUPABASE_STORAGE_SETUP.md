# Supabase Storage Setup Instructions

## Creating Storage Bucket for Equipment Photos

Follow these steps to set up the storage bucket for equipment photos in your Supabase project:

### Step 1: Go to Supabase Storage
1. Open your Supabase Dashboard: https://urllzokfeyuledjcwgfc.supabase.co
2. Click on **Storage** in the left sidebar
3. Click **New Bucket** button

### Step 2: Create the Bucket
1. **Name**: `equipment-photos`
2. **Public bucket**: ✅ Check this box (so photos can be viewed publicly)
3. Click **Create Bucket**

### Step 3: Set Bucket Policies (Optional - for security)

If you want to control who can upload/delete files, add these policies:

#### Go to Storage Policies:
1. Click on the `equipment-photos` bucket
2. Click on **Policies** tab
3. Click **New Policy**

#### Policy 1: Allow Authenticated Users to Upload
```sql
-- Policy name: Allow authenticated uploads
-- Allowed operation: INSERT
-- Policy definition:
(bucket_id = 'equipment-photos'::text) AND (auth.role() = 'authenticated'::text)
```

#### Policy 2: Allow Public Read Access
```sql
-- Policy name: Allow public read access
-- Allowed operation: SELECT
-- Policy definition:
(bucket_id = 'equipment-photos'::text)
```

#### Policy 3: Allow Authenticated Users to Delete (Optional)
```sql
-- Policy name: Allow authenticated delete
-- Allowed operation: DELETE
-- Policy definition:
(bucket_id = 'equipment-photos'::text) AND (auth.role() = 'authenticated'::text)
```

### Step 4: Configure CORS (if needed)

If you're accessing from different domains, configure CORS:

1. Go to **Project Settings** > **API**
2. Under **CORS Origins**, add your domain (e.g., `http://localhost:5174`)

### Step 5: Test the Setup

Run your application and try to:
1. Click "Report Issue" on any equipment
2. Upload a photo
3. Submit the form

The photo should upload successfully to Supabase Storage.

## File Structure in Bucket

Files will be organized like this:
```
equipment-photos/
├── EQ-001/
│   ├── 1670000000000.jpg
│   └── 1670000001000.png
├── EQ-002/
│   ├── 1670000002000.jpg
│   └── 1670000003000.jpg
└── ...
```

Each equipment gets its own folder, and files are named with timestamps.

## Viewing Uploaded Photos

You can view uploaded photos in the Supabase Dashboard:
1. Go to **Storage**
2. Click on `equipment-photos` bucket
3. Browse through the folders

## Public URL Format

Photos will have URLs like:
```
https://urllzokfeyuledjcwgfc.supabase.co/storage/v1/object/public/equipment-photos/EQ-001/1670000000000.jpg
```

These URLs can be shared and viewed by anyone.

## Security Notes

- ✅ The bucket is set to **public** for easy photo viewing
- ✅ Only authenticated users can upload (if you add the policy)
- ✅ Files are organized by equipment ID for easy management
- ✅ File names include timestamps to avoid conflicts

## Troubleshooting

### Error: "Bucket not found"
- Make sure the bucket name is exactly: `equipment-photos`
- Check that the bucket exists in your Supabase Storage

### Error: "Permission denied"
- Check that the bucket is set to **Public**
- Verify storage policies are correctly set

### Error: "CORS error"
- Add your application URL to CORS settings in Supabase

## Useful SQL Queries

### Check all uploaded photos:
```sql
SELECT * FROM storage.objects WHERE bucket_id = 'equipment-photos';
```

### Count photos per equipment:
```sql
SELECT
  split_part(name, '/', 1) as equipment_id,
  COUNT(*) as photo_count
FROM storage.objects
WHERE bucket_id = 'equipment-photos'
GROUP BY equipment_id;
```

### Delete all photos for an equipment:
```sql
DELETE FROM storage.objects
WHERE bucket_id = 'equipment-photos'
AND name LIKE 'EQ-001/%';
```
