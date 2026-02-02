# Independent Vaccine Recording Feature
## Backend Requirements Implementation

### Overview
This implementation refactors the **SmartVisitPackageCard** component to support **independent recording of each vaccine** within a grouped visit package. Each vaccine has its own "تم" (Record) button that calls the API with only that vaccine's `scheduleId`.

---

## Architecture

### 1. **Data Flow**

```
Dashboard
  ↓
fetchNextVaccine()
  ↓
createVisitPackage() [Groups vaccines by date]
  ↓
SmartVisitPackageCard [Renders independent buttons per vaccine]
  ↓
RecordVaccineModal [Handles individual vaccine recording]
  ↓
recordVaccine API [Backend processes ONE scheduleId at a time]
```

### 2. **Component Structure**

#### SmartVisitPackageCard
- **Purpose**: Display all vaccines scheduled for the same date
- **Key Feature**: Each vaccine row has an independent "تم" button
- **State Management**:
  - `recordedVaccines`: Tracks which vaccines have been recorded via scheduleId
  - `selectedVaccineForRecord`: Current vaccine being recorded
  - `showRecordModal`: Controls modal visibility

#### RecordVaccineModal
- **Enhanced with validation** for childId and scheduleId
- **Sends ONLY one vaccine's scheduleId** per API call
- **Success handler** updates the card to mark that specific vaccine as recorded

---

## Key Implementation Details

### Independent Recording Buttons

Each vaccine is now rendered as a checklist row with:

```jsx
<button
  onClick={() => handleOpenRecordModal(vaccine)}
  disabled={isButtonDisabled}
  className={...styling based on state...}
>
  {isRecorded ? (
    <> <Check className="w-3.5 h-3.5" /> تم التسجيل </>
  ) : isUnavailable ? (
    <> <AlertCircle className="w-3.5 h-3.5" /> غير متاح </>
  ) : (
    <> <Clock className="w-3.5 h-3.5" /> تم </>
  )}
</button>
```

### Button States

| State | Appearance | Behavior |
|-------|-----------|----------|
| Available | White/Blue button, "تم" text | Clickable → Opens modal |
| Recording | Loading state | Disabled during API call |
| Recorded | Green background, "✓ تم التسجيل" | Disabled, shows success state |
| Unavailable | Red background, "❌ غير متاح" | Disabled, shows warning |

### API Call Pattern

When user clicks "تم" for a specific vaccine:

```javascript
const handleOpenRecordModal = (vaccine) => {
  // Validation
  if (vaccine.isAvailable === false) {
    showToast.warning(`${vaccine.title} غير متوفر في الوقت الحالي`);
    return;
  }
  
  if (recordedVaccines[vaccine.scheduleId]) {
    showToast.info(`تم تسجيل ${vaccine.title} مسبقاً`);
    return;
  }

  // Open modal with only THIS vaccine's data
  setSelectedVaccineForRecord(vaccine);
  setShowRecordModal(true);
};
```

Modal then calls:

```javascript
await api.post('/childs/recordVaccine', {
  childId,           // The child receiving the vaccine
  scheduleId,        // ONLY this specific vaccine's ID
  actualDate: date,  // When it was actually given
  office             // Health office where it was given
});
```

### Success Handling

After successful recording:

```javascript
const handleRecordSuccess = () => {
  // Mark only THIS vaccine as recorded
  setRecordedVaccines(prev => ({
    ...prev,
    [selectedVaccineForRecord.scheduleId]: true
  }));
  
  showToast.success(`تم تسجيل ${selectedVaccineForRecord.title} بنجاح ✅`);
  
  // Other vaccines remain available for recording
  setShowRecordModal(false);
  setSelectedVaccineForRecord(null);
};
```

---

## Data Structure

### Vaccine Object with Recording Fields

```javascript
{
  scheduleId: "abc123",        // REQUIRED - Unique vaccine schedule ID
  title: "الحقنة الثلاثية",     // Vaccine name
  date: "2024-02-15",          // Scheduled date
  day: "الخميس",               // Day of week
  office: "مكتب الصحة المركزي", // Health office
  isAvailable: true,           // Can be recorded
  warning: null,               // Warning message if unavailable
  advice: "شرب الماء...",      // Medical advice
  childId: "child123",         // Child receiving vaccine
  childName: "محمد",           // Child name
  daysRemaining: 5             // Days until appointment
}
```

### Visit Package Structure

```javascript
{
  date: "2024-02-15",
  day: "الخميس",
  vaccineTitles: ["الحقنة الثلاثية", "الشلل", "الكبد"],
  vaccineCount: 3,
  advice: "...",
  warning: null,
  bcgWarning: null,
  allVaccines: [...enriched vaccine objects with scheduleId],
  unavailableVaccines: [...],
  office: "...",
  childId: "child123",
  childName: "محمد",
  daysRemaining: 5
}
```

---

## UI/UX Features

### Visual Grouping by Date
- Visit date and day displayed at the top
- Days remaining countdown
- Office location shown
- Child name displayed

### Checklist-Style Layout
- Each vaccine is a separate row
- Icon indicates vaccine status (check, alert, clock)
- Button clearly shows action needed
- Red warnings for unavailable items (BCG)

### Real-time Feedback
- Toast notifications on success/error
- Button state updates immediately after recording
- Other vaccines remain interactive
- User can record multiple vaccines in sequence

---

## Example User Flow

1. **Mother sees Dashboard**
   - Shows visit package: "3 تطعيمات معاً" for Feb 15
   - Date: "الخميس 2024-02-15"
   - Days remaining: "5"

2. **Vaccines Listed**
   ```
   ☐ الحقنة الثلاثية      [تم]
   ☐ الشلل               [تم]
   ❌ الدرن (غير متوفر)   [غير متاح]
   ```

3. **Mother clicks first "تم" button**
   - Modal opens: "تسجيل التطعيم"
   - Shows vaccine name
   - Date field (auto-filled today)
   - Office dropdown
   - Confirm button

4. **Mother fills form and taps "تأكيد"**
   - API call: `POST /childs/recordVaccine` with scheduleId for vaccine #1
   - Success: "تم تسجيل الحقنة الثلاثية بنجاح ✅"
   - First button changes: "✓ تم التسجيل" (disabled, green)
   - Other buttons remain clickable

5. **Mother clicks second "تم" button**
   - Same modal opens, but for second vaccine
   - API call with DIFFERENT scheduleId
   - Success: Now two vaccines marked as recorded

---

## Backend Integration Points

### Required API Endpoint
```
POST /childs/recordVaccine
{
  childId: string,      // Child ID
  scheduleId: string,   // ONLY this vaccine's schedule ID
  actualDate: string,   // Date given (YYYY-MM-DD)
  office: string        // Health office
}
```

### Response Expected
```json
{
  "success": true,
  "message": "تم تسجيل التطعيم بنجاح",
  "vaccine": {
    "scheduleId": "abc123",
    "title": "الحقنة الثلاثية",
    "recordedAt": "2024-02-15"
  }
}
```

### Error Handling
- Invalid scheduleId → Show error toast
- Missing childId → Show error toast
- API timeout → Show error toast
- User can retry immediately

---

## Files Modified

1. **`/components/cards/SmartVisitPackageCard.js`**
   - Added independent button state management
   - Added RecordVaccineModal integration
   - Changed from Link-based to button-based interaction
   - Added `recordedVaccines` state for tracking

2. **`/components/child/RecordVaccineModal.js`**
   - Added validation for scheduleId
   - Added error handling and debugging logs
   - Enhanced async/await error handling

3. **`/lib/utils/vaccineGrouping.js`**
   - Ensured each vaccine has `scheduleId`
   - Fallback to `id` or `_id` if scheduleId not provided

---

## Testing Checklist

- [ ] Click first vaccine "تم" button → Modal opens with correct vaccine
- [ ] Fill form and submit → API called with correct scheduleId
- [ ] First vaccine button changes to green "✓ تم التسجيل"
- [ ] Other vaccines still have "تم" button available
- [ ] Click second vaccine "تم" button → Different vaccine, different scheduleId
- [ ] Both are recorded independently
- [ ] Click unavailable vaccine → Toast shows warning, button disabled
- [ ] Visit page again → Same recorded state persists
- [ ] Error handling: Invalid data → Proper toast message

---

## Future Enhancements

- [ ] Batch recording UI (select multiple vaccines, record together)
- [ ] Offline support (queue recordings when offline)
- [ ] Receipt generation (PDF) after recording
- [ ] Parent/guardian role distinction
- [ ] Appointment scheduling changes mid-visit
