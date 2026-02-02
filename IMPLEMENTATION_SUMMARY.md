# Independent Vaccine Recording - Quick Reference

## What Changed?

### Old Behavior ❌
```
SmartVisitPackageCard
  ↓
  Link to /next-vaccine
  ↓
  Shows all vaccine details
  ↓
  Single "Done" button for entire visit
```

### New Behavior ✅
```
SmartVisitPackageCard
  ↓
  Each vaccine has independent row
  ↓
  Each row has individual "تم" button
  ↓
  Click button → Modal opens
  ↓
  Fill form & submit → API call with ONLY that vaccine's scheduleId
  ↓
  Button changes to green "✓ تم التسجيل"
  ↓
  Other vaccines remain clickable for recording
```

---

## Files Modified

| File | Changes | Impact |
|------|---------|--------|
| `/components/cards/SmartVisitPackageCard.js` | Complete refactor: <br>- Added state for recording <br>- Added button handlers <br>- Integrated RecordVaccineModal <br>- New checklist-style layout | **BREAKING CHANGE** - Component now handles recording inline |
| `/components/child/RecordVaccineModal.js` | Enhanced: <br>- Added validation for scheduleId <br>- Better error handling <br>- Validation logs | **Backward Compatible** - Modal still works independently |
| `/lib/utils/vaccineGrouping.js` | Updated: <br>- Added scheduleId to all vaccines <br>- Fallback to id/_id | **Backward Compatible** - Ensures each vaccine has ID |
| `/app/dashboard/page.js` | Updated imports | **No functional change** |
| `/app/next-vaccine/page.js` | Updated imports | **No functional change** |

---

## Key Features

### 1. Independent Buttons
- Each vaccine has its own "تم" button
- Each button controls ONLY that vaccine
- No shared "Done" button for the visit

### 2. State Tracking
- `recordedVaccines`: Object tracking recorded vaccine scheduleIDs
- `selectedVaccineForRecord`: Currently recording vaccine
- `showRecordModal`: Modal visibility

### 3. Button States
| State | Icon | Color | Clickable | Shows |
|-------|------|-------|-----------|-------|
| Available | ⏱ | Blue/White | ✅ | "تم" |
| Recorded | ✓ | Green | ❌ | "تم التسجيل" |
| Unavailable | ❌ | Red | ❌ | "غير متاح" |

### 4. API Integration
```javascript
// Single vaccine recording (not batch)
POST /childs/recordVaccine
{
  childId: "child-123",
  scheduleId: "vaccine-001",    // ⭐ ONLY this vaccine
  actualDate: "2024-02-15",
  office: "مكتب الصحة"
}
```

---

## How It Works

### Step 1: Card Renders
```jsx
<SmartVisitPackageCard
  visitPackage={{
    allVaccines: [
      { scheduleId: "1", title: "Ghada", isAvailable: true },
      { scheduleId: "2", title: "Shallal", isAvailable: true },
      { scheduleId: "3", title: "BCG", isAvailable: false }
    ]
  }}
/>
```

### Step 2: Each Vaccine Row
```jsx
<div>
  <p>{vaccine.title}</p>
  <button onClick={() => handleOpenRecordModal(vaccine)}>
    {recordedVaccines[vaccine.scheduleId] ? "✓ تم" : "⏱ تم"}
  </button>
</div>
```

### Step 3: User Clicks Button
```javascript
handleOpenRecordModal(vaccine)
  ├─ Check if already recorded
  ├─ Check if available
  └─ Open modal with this vaccine only
```

### Step 4: Modal Submission
```javascript
await api.post('/childs/recordVaccine', {
  childId,
  scheduleId,  // ⭐ Important: Only THIS vaccine's ID
  actualDate,
  office
})
```

### Step 5: Success Handler
```javascript
handleRecordSuccess()
  ├─ Update recordedVaccines[scheduleId] = true
  ├─ Show toast success
  └─ Close modal
```

### Step 6: Card Rerenders
- That vaccine button turns green ✓
- Button becomes disabled
- Other vaccines stay blue and clickable

---

## Usage Example

### Dashboard Usage
```jsx
import { SmartVisitPackageCard } from '@/components/cards/SmartVisitPackageCard';

export default function Dashboard() {
  const [visitPackage, setVisitPackage] = useState(null);
  
  useEffect(() => {
    const data = await fetchNextVaccine(children);
    setVisitPackage(data);
  }, []);
  
  return (
    <SmartVisitPackageCard
      visitPackage={visitPackage}
      onRecordSuccess={(vaccine) => {
        console.log(`Recorded: ${vaccine.title}`);
        // Optional: Refresh data
      }}
    />
  );
}
```

---

## Testing Scenarios

### Scenario 1: Record First Vaccine
```
1. Dashboard shows 3 vaccines
2. Click first "تم" button
3. Modal opens with "Vaccine 1" selected
4. User fills date/office and submits
5. API called: POST with scheduleId=1
6. Success: First button turns green ✓
7. Other buttons stay blue
8. User can click second vaccine now
```

### Scenario 2: Record Multiple in Sequence
```
1. Record vaccine 1 → ✓ Green
2. Record vaccine 2 → ✓ Green
3. Both marked, neither clickable again
4. Vaccine 3 stays red (unavailable)
```

### Scenario 3: Unavailable Vaccine
```
1. User clicks unavailable vaccine button
2. Toast appears: "BCG غير متوفر في الوقت الحالي"
3. Button stays red, disabled
4. Modal never opens
```

### Scenario 4: Already Recorded
```
1. User clicks recorded vaccine button again
2. Toast appears: "تم تسجيل ... مسبقاً"
3. Modal doesn't open
4. Button stays green
```

---

## API Requirements

Your backend **MUST**:

1. **Accept single scheduleId per call**
   ```javascript
   // ✅ Correct: One vaccine per request
   POST /childs/recordVaccine
   { childId, scheduleId, actualDate, office }
   
   // ❌ Wrong: Multiple vaccines would break this
   ```

2. **Support all 3 fields**
   - `childId` - Which child
   - `scheduleId` - Which vaccine (IMPORTANT)
   - `actualDate` - When given
   - `office` - Where given

3. **Return success response**
   ```json
   {
     "success": true,
     "message": "تم تسجيل التطعيم بنجاح",
     "vaccine": {
       "scheduleId": "...",
       "status": "recorded"
     }
   }
   ```

4. **Handle errors gracefully**
   - Invalid childId → 400 error
   - Invalid scheduleId → 400 error
   - Already recorded → 409 conflict or 200 with flag
   - Server error → 500 error

---

## Debug Tips

### Check If Vaccine Has scheduleId
```javascript
// In browser console
console.log(visitPackage.allVaccines[0]);
// Should have: { scheduleId: "...", title: "...", ... }
```

### Monitor API Calls
```javascript
// In RecordVaccineModal, API call logs the payload
console.log({
  childId,
  scheduleId,  // This should be different for each vaccine
  actualDate,
  office
});
```

### Check Button State
```javascript
// In SmartVisitPackageCard component
console.log(recordedVaccines);
// Should update like: { "schedule-1": true }
```

---

## Migration Notes

If you had previous code that:
- Used `<Link href="/next-vaccine">` → Now uses modal
- Had a single "Done" button → Now has per-vaccine buttons
- Called API with batch IDs → Now calls per vaccine

### Update Your Code
```javascript
// OLD WAY (Not recommended)
<Link href={`/next-vaccine?childId=${childId}`}>
  Show details
</Link>

// NEW WAY (Recommended)
<SmartVisitPackageCard
  visitPackage={visitPackage}
  onRecordSuccess={handleRecordSuccess}
/>
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Modal doesn't open | Check if `scheduleId` exists on vaccine object |
| API call fails | Verify backend expects single `scheduleId`, not array |
| Button doesn't change to green | Check `onSuccess` callback is called correctly |
| Multiple vaccines recorded together | Verify only one `scheduleId` is sent per API call |
| Unavailable vaccine button clickable | Check `isAvailable === false` on vaccine object |

---

## Next Steps

1. **Test in development**
   - Record one vaccine completely
   - Record a second vaccine
   - Try unavailable vaccine

2. **Verify backend**
   - Check API logs
   - Confirm each call has only one scheduleId
   - Verify recording is saved correctly

3. **Deploy to production**
   - Test with real users
   - Monitor error rates
   - Gather feedback

4. **Optional enhancements**
   - Batch recording mode
   - Receipt generation
   - Offline queue support
