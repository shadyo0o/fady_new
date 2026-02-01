# Component Structure - Independent Vaccine Recording

## Component Hierarchy

```
Dashboard Page
  │
  ├─ Data Fetching
  │  ├─ Fetch children list
  │  ├─ Call fetchNextVaccine()
  │  │  ├─ Get nextVaccines array
  │  │  └─ Call createVisitPackage()
  │  └─ Set nextVaccineData state
  │
  └─ Render
     └─ SmartVisitPackageCard
        ├─ Props:
        │  ├─ visitPackage (object)
        │  ├─ onVaccineClick (optional callback)
        │  └─ onRecordSuccess (optional callback)
        │
        ├─ State:
        │  ├─ recordedVaccines (object) - tracks recorded vaccines
        │  ├─ selectedVaccineForRecord (object) - current vaccine
        │  └─ showRecordModal (boolean) - modal visibility
        │
        ├─ Render CardContent
        │  ├─ Header section
        │  ├─ Date display
        │  ├─ Days remaining
        │  ├─ Vaccine list
        │  │  └─ For each vaccine:
        │  │     ├─ Vaccine title row
        │  │     └─ Individual "تم" button
        │  └─ Warnings section
        │
        └─ Render RecordVaccineModal
           ├─ Props:
           │  ├─ isOpen
           │  ├─ onClose
           │  ├─ childId
           │  ├─ scheduleId ⭐ (from selectedVaccineForRecord)
           │  ├─ vaccineName
           │  └─ onSuccess
           │
           ├─ State:
           │  ├─ date (filled form)
           │  ├─ office (filled form)
           │  └─ loading (during submission)
           │
           └─ Handlers:
              └─ handleSubmit
                 ├─ Validate scheduleId
                 ├─ Call API with ONLY this vaccine's scheduleId
                 └─ Call onSuccess if successful
```

---

## SmartVisitPackageCard - Detailed Structure

```jsx
export const SmartVisitPackageCard = ({ visitPackage, onRecordSuccess }) => {
  // ═══════════════════════════════════════════════════════════
  // STATE MANAGEMENT
  // ═══════════════════════════════════════════════════════════
  const [recordedVaccines, setRecordedVaccines] = useState({});
  //     ↑ Tracks: { "scheduleId-1": true, "scheduleId-2": true }
  
  const [selectedVaccineForRecord, setSelectedVaccineForRecord] = useState(null);
  //     ↑ Current vaccine being recorded
  
  const [showRecordModal, setShowRecordModal] = useState(false);
  //     ↑ Controls modal visibility
  
  // ═══════════════════════════════════════════════════════════
  // DESTRUCTURING VISIT PACKAGE DATA
  // ═══════════════════════════════════════════════════════════
  const {
    date,              // "2024-02-15"
    day,               // "الخميس"
    vaccineTitles,     // ["Ghada", "Shallal", "BCG"]
    vaccineCount,      // 3
    advice,            // "Medical advice text"
    bcgWarning,        // Warning if BCG unavailable
    allVaccines,       // ⭐ Array of vaccine objects with scheduleId
    office,            // "مكتب الصحة"
    childId,           // "child-123"
    childName,         // "محمد"
    daysRemaining,     // 5
  } = visitPackage;
  
  // ═══════════════════════════════════════════════════════════
  // HANDLER: Open Record Modal for Specific Vaccine
  // ═══════════════════════════════════════════════════════════
  const handleOpenRecordModal = (vaccine) => {
    // Validation 1: Check if available
    if (vaccine.isAvailable === false) {
      showToast.warning(`${vaccine.title} غير متوفر`);
      return; // ❌ Don't open modal
    }
    
    // Validation 2: Check if already recorded
    if (recordedVaccines[vaccine.scheduleId]) {
      showToast.info(`تم تسجيل ${vaccine.title} مسبقاً`);
      return; // ❌ Don't open modal
    }

    // ✅ All validations passed, open modal with THIS vaccine
    setSelectedVaccineForRecord(vaccine);
    setShowRecordModal(true);
  };
  
  // ═══════════════════════════════════════════════════════════
  // HANDLER: After Successful Recording
  // ═══════════════════════════════════════════════════════════
  const handleRecordSuccess = () => {
    if (selectedVaccineForRecord) {
      // ⭐ MARK ONLY THIS VACCINE AS RECORDED
      setRecordedVaccines(prev => ({
        ...prev,
        [selectedVaccineForRecord.scheduleId]: true
      }));
      
      showToast.success(`تم تسجيل ${selectedVaccineForRecord.title} ✅`);
      
      // Reset modal state
      setShowRecordModal(false);
      setSelectedVaccineForRecord(null);
      
      // Optional: Call parent callback
      if (onRecordSuccess) {
        onRecordSuccess(selectedVaccineForRecord);
      }
    }
  };
  
  // ═══════════════════════════════════════════════════════════
  // RENDER: Card Content
  // ═══════════════════════════════════════════════════════════
  const CardContent = () => (
    <div className="bg-[#33AB98] rounded-2xl p-5 text-white shadow-lg">
      {/* Header, Date, Days remaining sections... */}
      
      {/* 🎯 MAIN: Vaccine Recording Checklist */}
      <div className="mt-4 pt-4 border-t border-white/10 relative z-10">
        <p className="text-xs text-blue-100 mb-3 font-medium">تسجيل التطعيمات:</p>
        
        <div className="space-y-2">
          {allVaccines.map((vaccine, idx) => {
            // ─────────────────────────────────────────────────
            // DETERMINE VACCINE STATUS
            // ─────────────────────────────────────────────────
            const isRecorded = recordedVaccines[vaccine.scheduleId];
            const isUnavailable = vaccine.isAvailable === false;
            const isButtonDisabled = isUnavailable || isRecorded;
            
            return (
              <div
                key={idx}
                className={`flex items-center justify-between px-3 py-2 rounded-lg border transition-all ${
                  isRecorded
                    ? 'bg-green-500/20 border-green-300/30'
                    : isUnavailable
                    ? 'bg-red-500/20 border-red-300/30'
                    : 'bg-white/10 border-white/20'
                }`}
              >
                {/* VACCINE TITLE & WARNING */}
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">
                    {isRecorded && '✓ '}
                    {isUnavailable && '❌ '}
                    {vaccine.title}
                  </p>
                  {isUnavailable && vaccine.warning && (
                    <p className="text-xs text-red-100 mt-1">
                      {vaccine.warning}
                    </p>
                  )}
                </div>
                
                {/* RECORD BUTTON - The Main Feature */}
                <button
                  onClick={() => handleOpenRecordModal(vaccine)}
                  disabled={isButtonDisabled}
                  className={`ml-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 ${
                    isRecorded
                      ? 'bg-green-500/40 text-green-50 border border-green-300/50 cursor-default'
                      : isUnavailable
                      ? 'bg-red-500/30 text-red-50 border border-red-300/50 cursor-not-allowed opacity-60'
                      : 'bg-white/20 text-white border border-white/30 hover:bg-white/30 active:bg-white/40'
                  }`}
                >
                  {isRecorded ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      تم التسجيل
                    </>
                  ) : isUnavailable ? (
                    <>
                      <AlertCircle className="w-3.5 h-3.5" />
                      غير متاح
                    </>
                  ) : (
                    <>
                      <Clock className="w-3.5 h-3.5" />
                      تم
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
  
  // ═══════════════════════════════════════════════════════════
  // RENDER: Full Component with Modal
  // ═══════════════════════════════════════════════════════════
  return (
    <>
      <CardContent />
      
      {/* MODAL: Record Individual Vaccine */}
      <RecordVaccineModal
        isOpen={showRecordModal}
        onClose={() => {
          setShowRecordModal(false);
          setSelectedVaccineForRecord(null);
        }}
        childId={childId}
        scheduleId={selectedVaccineForRecord?.scheduleId}  // ⭐ KEY
        vaccineName={selectedVaccineForRecord?.title}
        onSuccess={handleRecordSuccess}  // ⭐ Updates card state
      />
    </>
  );
};
```

---

## RecordVaccineModal - Detailed Structure

```jsx
export default function RecordVaccineModal({
  isOpen,
  onClose,
  childId,
  scheduleId,  // ⭐ ONLY this vaccine
  vaccineName,
  onSuccess
}) {
  // ═══════════════════════════════════════════════════════════
  // STATE FOR FORM
  // ═══════════════════════════════════════════════════════════
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [office, setOffice] = useState(HEALTH_OFFICES[0].value);
  const [loading, setLoading] = useState(false);

  // ═══════════════════════════════════════════════════════════
  // GUARD: Don't render if modal not open or no scheduleId
  // ═══════════════════════════════════════════════════════════
  if (!isOpen || !scheduleId) return null;
  
  // ═══════════════════════════════════════════════════════════
  // HANDLER: Form Submission
  // ═══════════════════════════════════════════════════════════
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!childId) {
      showToast.error('معرف الطفل مفقود');
      return;
    }
    if (!scheduleId) {
      showToast.error('معرف التطعيم المجدول مفقود');
      return;
    }

    setLoading(true);
    try {
      // ⭐ CRITICAL: Send ONLY this vaccine's scheduleId
      await api.post('/childs/recordVaccine', {
        childId,           // Which child
        scheduleId,        // ⭐ Which vaccine (SINGLE ID)
        actualDate: date,  // When given
        office             // Where given
      });
      
      showToast.success('تم تسجيل التطعيم بنجاح ✅');
      
      // ⭐ CALL PARENT CALLBACK TO UPDATE CARD
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess();
      }
      
      onClose();
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || 'فشل تسجيل التطعيم';
      showToast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ═══════════════════════════════════════════════════════════
  // RENDER: Modal Form
  // ═══════════════════════════════════════════════════════════
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">تسجيل تطعيم</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        
        <p className="text-sm text-gray-500 mb-4">
          أنت تقوم بتسجيل: <span className="font-bold text-[#33AB98]">{vaccineName}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="تاريخ التطعيم الفعلي"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">تم في مكتب:</label>
            <select
              className="p-3 border-2 border-gray-200 rounded-lg bg-white"
              value={office}
              onChange={(e) => setOffice(e.target.value)}
            >
              {HEALTH_OFFICES.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              إلغاء
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'جاري الحفظ...' : 'تأكيد'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

---

## Data Flow in Code

### 1. Input Data (from API)

```javascript
allVaccines = [
  {
    scheduleId: "vaccine-ghada-001",      // ⭐ UNIQUE ID
    title: "الحقنة الثلاثية",
    date: "2024-02-15",
    day: "الخميس",
    isAvailable: true,
    advice: "شرب الماء",
    warning: null,
    office: "مكتب الصحة",
    childId: "child-123",
    childName: "محمد"
  },
  {
    scheduleId: "vaccine-shallal-001",    // ⭐ DIFFERENT ID
    title: "الشلل",
    date: "2024-02-15",
    isAvailable: true,
    // ... same structure
  },
  {
    scheduleId: "vaccine-bcg-001",        // ⭐ DIFFERENT ID
    title: "الدرن",
    date: "2024-02-15",
    isAvailable: false,                   // ❌ UNAVAILABLE
    warning: "غير متوفر حالياً"
  }
]
```

### 2. State After Interactions

```javascript
// Initial
recordedVaccines = {}

// After recording first vaccine
recordedVaccines = {
  "vaccine-ghada-001": true  // ⭐ MARKED RECORDED
}

// After recording second vaccine
recordedVaccines = {
  "vaccine-ghada-001": true,
  "vaccine-shallal-001": true  // ⭐ BOTH RECORDED
}

// Third vaccine remains unavailable (not in recordedVaccines)
```

### 3. Button State for Each Vaccine

```javascript
// Vaccine 1: Ghada (recorded)
isRecorded = recordedVaccines["vaccine-ghada-001"] = true
isUnavailable = false
isButtonDisabled = true
→ Button: GREEN ✓ تم التسجيل (disabled)

// Vaccine 2: Shallal (recorded)
isRecorded = recordedVaccines["vaccine-shallal-001"] = true
isUnavailable = false
isButtonDisabled = true
→ Button: GREEN ✓ تم التسجيل (disabled)

// Vaccine 3: BCG (unavailable)
isRecorded = recordedVaccines["vaccine-bcg-001"] = false
isUnavailable = true
isButtonDisabled = true
→ Button: RED ❌ غير متاح (disabled)
```

---

## API Sequence Diagram

```
Step 1: Dashboard loads
  └─→ api.get('/getNextVaccine')
      ←─ [{ scheduleId: 1, ... }, { scheduleId: 2, ... }]

Step 2: createVisitPackage() runs
  ├─ Groups by date
  ├─ Ensures each has scheduleId
  └─ Returns visitPackage object

Step 3: SmartVisitPackageCard renders
  ├─ recordedVaccines = {}
  └─ Shows 3 vaccine rows with "تم" buttons

Step 4: User clicks first vaccine's "تم"
  ├─ Validation checks pass
  ├─ selectedVaccineForRecord = vaccine #1
  └─ showRecordModal = true

Step 5: Modal opens and user submits
  └─→ api.post('/recordVaccine', {
        childId: "123",
        scheduleId: "vaccine-1",  // ⭐ FIRST
        actualDate: "2024-02-15",
        office: "..."
      })
      ←─ { success: true }

Step 6: handleRecordSuccess() called
  ├─ recordedVaccines["vaccine-1"] = true
  ├─ Modal closes
  └─ Card rerenders: vaccine #1 button GREEN

Step 7: User clicks second vaccine's "تم"
  ├─ selectedVaccineForRecord = vaccine #2
  └─ showRecordModal = true

Step 8: Modal opens again, user submits
  └─→ api.post('/recordVaccine', {
        childId: "123",
        scheduleId: "vaccine-2",  // ⭐ DIFFERENT
        actualDate: "2024-02-15",
        office: "..."
      })
      ←─ { success: true }

Step 9: handleRecordSuccess() called again
  ├─ recordedVaccines["vaccine-2"] = true
  └─ Card rerenders: vaccine #2 button GREEN

Final State:
  ✓ Vaccine 1: GREEN (recorded)
  ✓ Vaccine 2: GREEN (recorded)
  ❌ Vaccine 3: RED (unavailable)
```

---

## Key Points Summary

| Aspect | Details |
|--------|---------|
| **Independent** | Each vaccine has own scheduleId, own button, own recording |
| **Sequential** | Users record one at a time, not batched |
| **Stateful** | Card tracks which vaccines recorded via `recordedVaccines` object |
| **Modal-based** | Recording happens in inline modal, not separate page |
| **Validated** | Checks for availability and prior recording |
| **API Per Vaccine** | Each button click = one API call with one scheduleId |
| **User Friendly** | Clear visual feedback (green ✓, red ❌, blue ⏱) |
| **Callback Driven** | Modal success calls parent handler to update card |

---

## Files Reference

```
components/
├── cards/
│   └── SmartVisitPackageCard.js     ⭐ Main component with recording
├── child/
│   └── RecordVaccineModal.js        ⭐ Modal for individual vaccines
└── ui/
    ├── Button.js
    ├── Input.js
    └── ...

lib/
├── utils/
│   └── vaccineGrouping.js           Ensures scheduleId in data
├── api/
│   └── client.js                    API calls
└── toast.js                         Notifications

app/
├── dashboard/
│   └── page.js                      Uses SmartVisitPackageCard
└── next-vaccine/
    └── page.js                      Detail page (backup)
```
