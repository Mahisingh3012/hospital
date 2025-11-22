# Debugging Guide: Appwrite Appointment Fetch Issues

## Step-by-Step Debugging Checklist

### 1. ✅ Check Environment Variables

**Problem**: Environment variables might not be loading in Next.js server components.

**Solution**:
```bash
# Check your .env.local file has these (NO NEXT_PUBLIC_ prefix for server-side):
ENDPOINT=https://cloud.appwrite.io/v1
PROJECT_ID=your-project-id
API_KEY=your-api-key
DATABASE_ID=your-database-id
APPOINTMENT_TABLE_ID=your-table-id
```

**Verify in code**:
- Check server logs when the app starts - you should see `[Appwrite Config] ✓ Configuration loaded successfully`
- The logs will show which variables are missing

**Common mistakes**:
- ❌ Using `NEXT_PUBLIC_ENDPOINT` in server code (should be `ENDPOINT`)
- ❌ Variables in `.env` instead of `.env.local`
- ❌ Forgetting to restart Next.js dev server after changing `.env.local`

---

### 2. ✅ Check Appwrite API Key Permissions

**Problem**: API key doesn't have read permissions for the database.

**Steps**:
1. Go to Appwrite Console → Settings → API Keys
2. Find your API key (or create a new one)
3. **Required scopes**:
   - `databases.read` ✅
   - `databases.write` ✅ (if creating appointments)
4. **Required resources**:
   - Your Database ID ✅
   - Your Collection ID (APPOINTMENT_TABLE_ID) ✅

**Test**:
```bash
# In your terminal, test the API key:
curl -X GET "https://cloud.appwrite.io/v1/databases/{DATABASE_ID}/collections/{APPOINTMENT_TABLE_ID}/documents/{DOCUMENT_ID}" \
  -H "X-Appwrite-Project: {PROJECT_ID}" \
  -H "X-Appwrite-Key: {API_KEY}"
```

---

### 3. ✅ Check Collection Permissions

**Problem**: Collection-level permissions are blocking reads.

**Steps**:
1. Go to Appwrite Console → Databases → Your Database → Your Collection
2. Click "Settings" → "Permissions"
3. **For server-side API key access**:
   - You can use "Any" role OR
   - Create a role with "read" permission
4. **Important**: If using API key, you might need to set permissions to allow "Any" or create a specific role

**Common mistake**: Permissions set to "Users" only, but API key doesn't have user context.

---

### 4. ✅ Verify Document ID Format

**Problem**: The ID in URL doesn't match Appwrite's format.

**Check**:
- Appwrite document IDs are usually 24-character hex strings (e.g., `667b0c4b002cdbc645dd`)
- Check for:
  - Extra whitespace (now trimmed in code)
  - URL encoding issues
  - Copy-paste errors

**Test in code**:
```javascript
console.log("ID from URL:", appointmentId);
console.log("ID length:", appointmentId.length);
console.log("ID matches pattern:", /^[a-f0-9]{24}$/i.test(appointmentId));
```

---

### 5. ✅ Check Database and Collection IDs

**Problem**: Wrong DATABASE_ID or APPOINTMENT_TABLE_ID.

**Verify**:
1. Go to Appwrite Console → Databases
2. Copy the exact Database ID (not the name)
3. Go to your Collection → Settings
4. Copy the exact Collection ID (not the name)
5. Compare with your `.env.local` values

**Common mistakes**:
- Using collection name instead of ID
- Using database name instead of ID
- Typos in environment variables

---

### 6. ✅ Test with Manual API Call

**Create a test script** (`test-appwrite.js`):

```javascript
const { Client, Databases } = require('node-appwrite');

const client = new Client()
    .setEndpoint(process.env.ENDPOINT)
    .setProject(process.env.PROJECT_ID)
    .setKey(process.env.API_KEY);

const databases = new Databases(client);

async function testFetch() {
    try {
        const doc = await databases.getDocument(
            process.env.DATABASE_ID,
            process.env.APPOINTMENT_TABLE_ID,
            'YOUR_APPOINTMENT_ID_HERE' // Replace with actual ID
        );
        console.log('✅ Success:', doc);
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Code:', error.code);
    }
}

testFetch();
```

Run: `node test-appwrite.js`

---

### 7. ✅ Check Server Logs

**What to look for**:

1. **On app startup**:
   ```
   [Appwrite Config] ✓ Configuration loaded successfully
   [Appwrite Config] ENDPOINT: https://cloud.appwrite.io/v1
   [Appwrite Config] DATABASE_ID: your-db-id
   ```

2. **When fetching**:
   ```
   [getAppointment] Starting fetch...
   [getAppointment] appointmentId: 667b0c4b002cdbc645dd
   [getAppointment] ✅ Successfully fetched appointment
   ```

3. **If error**:
   ```
   [getAppointment] ❌ Error fetching appointment:
   [getAppointment] Error code: 404
   [getAppointment] Document not found - check if ID exists in Appwrite
   ```

---

### 8. ✅ Common Error Codes

| Code | Meaning | Solution |
|------|---------|----------|
| 404 | Document not found | Check ID exists, verify collection ID |
| 401 | Unauthorized | Check API key is correct |
| 403 | Forbidden | Check API key permissions |
| 400 | Bad request | Check ID format, verify database/collection IDs |

---

### 9. ✅ Next.js Specific Issues

**Server Components**:
- ✅ `getAppointment` is marked `'use server'` - correct
- ✅ Called from server component - correct
- ❌ Don't call from client components directly

**Environment Variables**:
- Server-side: Use `process.env.VARIABLE_NAME` (no `NEXT_PUBLIC_`)
- Client-side: Use `process.env.NEXT_PUBLIC_VARIABLE_NAME`
- Restart dev server after changing `.env.local`

**Caching**:
- Next.js might cache the error response
- Try hard refresh (Ctrl+Shift+R)
- Clear `.next` folder: `rm -rf .next`

---

### 10. ✅ Quick Verification Checklist

Run through this checklist:

- [ ] `.env.local` exists in project root
- [ ] All variables are set (no `undefined` in logs)
- [ ] Dev server restarted after changing `.env.local`
- [ ] API key has `databases.read` scope
- [ ] API key has access to your database/collection
- [ ] Collection permissions allow API key access
- [ ] Document ID matches exactly (24 chars, hex)
- [ ] DATABASE_ID matches Appwrite console
- [ ] APPOINTMENT_TABLE_ID matches Appwrite console
- [ ] Check server logs for detailed error messages

---

## Quick Fix Commands

```bash
# 1. Verify env vars are loaded
npm run dev
# Check console for [Appwrite Config] logs

# 2. Test with a known good ID
# Use an ID you created manually in Appwrite console

# 3. Clear Next.js cache
rm -rf .next
npm run dev

# 4. Check if document exists
# Go to Appwrite Console → Databases → Your Collection
# Verify the document with that ID exists
```

---

## Still Not Working?

1. **Share the server logs** - Look for `[getAppointment]` and `[Appwrite Config]` messages
2. **Test API key manually** - Use the curl command above
3. **Create a new test document** - Use Appwrite console, then try fetching it
4. **Check Appwrite status** - Make sure Appwrite service is up

