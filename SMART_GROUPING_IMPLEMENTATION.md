# Smart Date-Based Grouping Implementation Guide

## Overview
This document describes the refactored Dashboard for Fady's Vaccines app, implementing smart date-based grouping logic that groups vaccines scheduled for the same date into a cohesive "Visit Package."

---

## Key Features Implemented

### 1. **Smart Date-Based Grouping Logic**
- **File**: `/lib/utils/vaccineGrouping.js`
- **What it does**: Groups all vaccines scheduled for the same date
- **Functions**:
  - `parseArabicDate()` - Parses Arabic and standard date strings
  - `normalizeDateForComparison()` - Normalizes dates to YYYY-MM-DD format for accurate comparison
  - `createVisitPackage()` - Groups vaccines by date and creates a visit package object
  - `calculateDaysRemaining()` - Calculates days remaining until the visit

**Example**:
If "تحليل الغدة", "الدرن (BCG)", and "الصفرية" all fall on 2026-02-03, they're displayed as one unified visit package.

---

### 2. **New Component: SmartVisitPackageCard**
- **File**: `/components/cards/SmartVisitPackageCard.js`
- **Purpose**: Displays a grouped visit package on the Dashboard
- **Features**:
  - Shows visit date and day prominently at the top
  - Lists all vaccines scheduled for that date as sub-items
  - Displays advice/instructions from the primary vaccine
  - **Critical Red Warning** for unavailable vaccines (especially BCG - الدرن)
  - Interactive vaccine buttons that can show detailed information
  - Shows office location if available
  - Displays days remaining countdown

**Visual Hierarchy**:
```
┌─────────────────────────────────────────┐
│  حزمة الزيارة القادمة                    │
│  4 تطعيمات معاً                          │
│  للطفل: محمد                              │
├─────────────────────────────────────────┤
│  📅 الموعد: 2026-02-03 (الثلاثاء)        │
│  ⏱️  متبقي: 5 أيام                       │
├─────────────────────────────────────────┤
│  النصائح:                                 │
│  [نص النصيحة الرئيسية]                    │
├─────────────────────────────────────────┤
│  ⚠️ تحذير: تطعيم الدرن غير متوفر حالياً  │
├─────────────────────────────────────────┤
│  التطعيمات المجدولة:                      │
│  ✓ تحليل الغدة                           │
│  ✓ الصفرية                               │
│  ❌ الدرن (غير متوفر)                     │
└─────────────────────────────────────────┘
```

---

### 3. **Updated Dashboard Page**
- **File**: `/app/dashboard/page.js`
- **Changes**:
  - Imports the new `SmartVisitPackageCard` component
  - Uses `createVisitPackage()` to group vaccines before displaying
  - Fetches both `nextTask` and `nextVaccines` array from the API
  - Processes the data to identify vaccines on the same date
  - Passes the grouped `visitPackage` object to the smart card component

**Fetch Logic**:
```javascript
const visitPackage = createVisitPackage(
  earliest.nextVaccines,  // All upcoming vaccines
  earliest.nextTask       // Primary next vaccine
);
```

---

### 4. **Enhanced Next-Vaccine Detail Page**
- **File**: `/app/next-vaccine/page.js`
- **Improvements**:
  - Uses the smart grouping utility to organize concurrent vaccines
  - Displays all vaccines in the visit package with merged information
  - **Shows warnings for unavailable vaccines** with red alert styling
  - Displays a dedicated "حزمة الزيارة الموحدة" (Unified Visit Package) section
  - Lists each vaccine in the group with availability status
  - Merges medical tips and advice from all vaccines in the group

**Detail Display**:
- Vaccine titles are combined (e.g., "تحليل الغدة + الدرن + الصفرية")
- Medical tips from all vaccines are merged and deduplicated
- Unavailable vaccines are highlighted with orange/red warnings
- Shows which vaccines are available and which are not

---

## Conditional Warning Logic

### BCG Warning System
The implementation includes critical warning logic for the BCG vaccine (الدرن):

**Trigger**: If any vaccine in the visit package has `isAvailable: false`

**Warnings Displayed**:
1. **Dashboard Card**: Red animated warning banner
   - Located below the visit date information
   - Uses pulsing animation to draw attention
   - Shows the specific warning text from the vaccine data

2. **Detail Page**: Orange warning cards for each unavailable vaccine
   - Shows below the main danger zone warnings
   - Lists each unavailable vaccine individually
   - Displays the warning text provided in the JSON

**Example JSON Structure**:
```json
{
  "title": "الدرن - BCG",
  "isAvailable": false,
  "warning": "تطعيم الدرن غير متوفر حالياً في مكتب سعد",
  "date": "2026-02-03",
  "day": "الثلاثاء"
}
```

---

## UI Rendering Details

### Dashboard View
✅ Date and day displayed prominently
✅ List of grouped vaccine titles as sub-tasks
✅ Primary advice/instruction from the nextTask
✅ Visual indicators for unavailable vaccines (❌ emoji prefix)
✅ Office location if available
✅ Days remaining countdown
✅ Click-through to detailed page

### Detail View
✅ All vaccines in the group displayed
✅ Merged advice and medical tips
✅ Individual vaccine warnings for unavailable items
✅ Color-coded availability (green for available, red for unavailable)
✅ Grouped vaccines section showing the visit package
✅ Multiple warning alerts if needed

---

## Detail Handling

When a user clicks on any vaccine in the grouped list:

1. **From Dashboard Card**: Links to `/next-vaccine?childId={childId}`
2. **On Detail Page**: Shows complete information for all vaccines in the visit
3. **Modal/Details**: Each vaccine's specific data is merged and displayed:
   - Medical tips from all vaccines
   - Documents required (merged from all vaccines)
   - Important notes (merged from all vaccines)
   - Nutrition information (merged from all vaccines)
   - Specific warnings for each vaccine

---

## Data Structure

### Visit Package Object
```javascript
{
  date: "2026-02-03",              // Scheduled date
  day: "الثلاثاء",                  // Day of week
  vaccineTitles: [...],            // Array of vaccine titles
  vaccineCount: 4,                 // Number of vaccines in package
  advice: "string",                // Primary advice
  warning: "string",               // General warning
  unavailableVaccines: [...],      // Vaccines with isAvailable: false
  bcgWarning: "string",            // Specific BCG warning if available
  allVaccines: [...],              // Full vaccine objects
  office: "string",                // Office location
  childId: "id",                   // Child ID
  childName: "name",               // Child name
  daysRemaining: 5                 // Days until visit
}
```

---

## Backward Compatibility

- Falls back to single vaccine display if only one vaccine on the date
- Works with existing API response structure
- No breaking changes to other components
- Dashboard page gracefully handles missing data

---

## Future Enhancements

1. **Modals for Grouped Vaccines**: Add a modal to select which vaccine details to view
2. **Color-Coded Availability**: Different card backgrounds for fully available vs. partially available visits
3. **Rescheduling Logic**: Suggest rescheduling if a critical vaccine is unavailable
4. **Multi-Child View**: Compare visit schedules across multiple children
5. **Notification System**: Alerts for unavailable vaccines at least 48 hours before the visit

---

## Testing Checklist

- [ ] Dashboard displays grouped vaccines correctly
- [ ] BCG warning appears when `isAvailable: false`
- [ ] Detail page shows all grouped vaccines
- [ ] Date normalization works for Arabic dates
- [ ] Unavailable vaccine warnings are highlighted
- [ ] Multiple warnings display correctly
- [ ] Click through to detail page works
- [ ] Navigation back from detail page works
- [ ] Days remaining calculation is accurate
- [ ] Office location displays correctly
