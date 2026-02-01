# Independent Vaccine Recording - Interaction Flow

## 1. Visual Card Layout

```
┌─────────────────────────────────────────────────┐
│  حزمة الزيارة القادمة                           │
│  3 تطعيمات معاً                        📦       │
│  للطفل: محمد                                    │
│  📍 مكتب الصحة المركزي                         │
├─────────────────────────────────────────────────┤
│  الموعد المحدد                                  │
│  ← الخميس (2024-02-15) → 15 فبراير              │
│  5 أيام متبقية                                 │
├─────────────────────────────────────────────────┤
│  💡 يرجى شرب الماء بكثرة بعد التطعيم            │
├─────────────────────────────────────────────────┤
│  تسجيل التطعيمات:                               │
│  ┌──────────────────────────────────────────┐  │
│  │ ☐ الحقنة الثلاثية     [⏱ تم]          │  │
│  │   Click for form      Submit → API       │  │
│  ├──────────────────────────────────────────┤  │
│  │ ☐ الشلل               [⏱ تم]          │  │
│  │   Click for form      Submit → API       │  │
│  ├──────────────────────────────────────────┤  │
│  │ ❌ الدرن (غير متوفر)  [❌ غير متاح]    │  │
│  │    تحذير: غير متوفر      Disabled       │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘

LEGEND:
☐ = Available for recording
❌ = Unavailable (disabled)
✓ = Already recorded (green, disabled)
```

---

## 2. State Machine

```
┌─────────────────────────────────────────────────────────────┐
│                      VACCINE ROW STATE                       │
└─────────────────────────────────────────────────────────────┘

                    INITIAL STATE
                         │
                         ▼
         ┌───────────────────────────────────┐
         │      IS VACCINE AVAILABLE?        │
         └───────────────────────────────────┘
              ├─── NO ─────┬─── YES ───┐
              │            │           │
              ▼            ▼           ▼
      [UNAVAILABLE]  [AVAILABLE]  [RECORDED]
      ────────────   ──────────   ──────────
      • Red button   • Blue/White • Green btn
      • ❌ Icon      • ⏱ Icon     • ✓ Icon
      • Disabled     • Click opens • Disabled
      • Warning txt    modal

                    ┌──────────────────┐
                    │  USER CLICKS TEM  │
                    └──────────────────┘
                         │
              ┌──────────┴──────────┐
              │                     │
              ▼                     ▼
      ┌──────────────────┐  ┌──────────────────┐
      │  MODAL OPENS     │  │ ALREADY RECORDED │
      │  Form fills in   │  │ Show toast info  │
      │  For THIS vaccine│  │ Return to card   │
      └──────────────────┘  └──────────────────┘
              │
              ▼
      ┌──────────────────┐
      │ USER SUBMITS     │
      │ API CALL:        │
      │ POST /recordVax  │
      │ scheduleId: X    │
      └──────────────────┘
              │
      ┌───────┴───────┐
      │               │
      ▼               ▼
   SUCCESS         ERROR
   ────────        ─────
   • Set state     • Toast
   • Show toast    • Keep btn
   • Disable btn     available
   • Mark recorded
```

---

## 3. Component Interaction Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                       DASHBOARD                              │
│  (Fetches vaccine data and groups by date)                  │
└─────────────────────────────────────────────────────────────┐
                         │
                         │ Passes visitPackage
                         │ with allVaccines[]
                         ▼
        ┌────────────────────────────────────────┐
        │  SmartVisitPackageCard Component       │
        ├────────────────────────────────────────┤
        │ State:                                 │
        │  • recordedVaccines = {}               │
        │  • showRecordModal = false             │
        │  • selectedVaccineForRecord = null     │
        │                                        │
        │ Renders: {allVaccines.map(...)}        │
        └────────────────────────────────────────┘
                         │
          ┌──────────────┼──────────────┐
          │              │              │
          ▼              ▼              ▼
     [Vaccine 1]  [Vaccine 2]  [Vaccine 3]
      Ghada        Shallal      BCG
      Available    Available    Unavailable
     
     Each renders:
     ┌─────────────────────────────────┐
     │ [Vaccine Title] [تم Button]     │
     │ onClick: handleOpenRecordModal() │
     └─────────────────────────────────┘
              │
              ▼
     ┌─────────────────────────────────┐
     │ RecordVaccineModal Component    │
     ├─────────────────────────────────┤
     │ Props:                          │
     │  • isOpen: boolean              │
     │  • childId: string              │
     │  • scheduleId: string ⭐        │
     │  • vaccineName: string          │
     │  • onSuccess: callback          │
     │                                 │
     │ Inside Modal:                   │
     │  1. Date input (auto-filled)    │
     │  2. Office dropdown             │
     │  3. "تأكيد" button              │
     │       │                         │
     │       ▼                         │
     │ handleSubmit():                 │
     │  • Validate childId             │
     │  • Validate scheduleId          │
     │  • Call API with ONLY this      │
     │    vaccine's scheduleId         │
     │                                 │
     │  On Success:                    │
     │  • Call onSuccess()             │
     │  • Close modal                  │
     │                                 │
     │  On Error:                      │
     │  • Show error toast             │
     │  • Keep modal open              │
     └─────────────────────────────────┘
              │ onSuccess()
              ▼
     ┌─────────────────────────────────┐
     │ handleRecordSuccess()           │
     ├─────────────────────────────────┤
     │ • Update recordedVaccines state │
     │   recordedVaccines[scheduleId]  │
     │      = true                     │
     │                                 │
     │ • Show success toast            │
     │ • Close modal                   │
     │ • Clear selected vaccine        │
     │                                 │
     │ Component RERENDERS with:       │
     │ • That vaccine button GREEN     │
     │ • Button now DISABLED           │
     │ • Shows "✓ تم التسجيل"        │
     │ • OTHER vaccines still BLUE     │
     │ • Can click next vaccine        │
     └─────────────────────────────────┘
```

---

## 4. API Call Sequence

```
Timeline of API Calls for Recording 3 Vaccines on Same Date:

TIME    COMPONENT              ACTION                    PAYLOAD
────────────────────────────────────────────────────────────────────

T0      Dashboard            fetches nextVaccines[]
        ↓
        [API] GET /getNextVaccine
        ← Returns: [{scheduleId: 1, title: Ghada}, ...]

T1      SmartVisitPackageCard renders
        allVaccines = [
          {scheduleId: 1, title: "Ghada", available: true},
          {scheduleId: 2, title: "Shallal", available: true},
          {scheduleId: 3, title: "BCG", available: false}
        ]

T2      User clicks "تم" for Vaccine 1
        handleOpenRecordModal({scheduleId: 1, title: "Ghada"})
        ↓
        showRecordModal = true
        selectedVaccineForRecord = vaccine1

T3      RecordVaccineModal opens
        Form shows: "تسجيل تطعيم: Ghada"

T4      User clicks "تأكيد"
        handleSubmit() called
        ↓
        [API] POST /childs/recordVaccine
        {
          childId: "child123",
          scheduleId: 1,              ⭐ ONLY vaccine #1
          actualDate: "2024-02-15",
          office: "مكتب الصحة"
        }

T5      API Response
        ← {success: true, message: "..."}
        ↓
        onSuccess() callback
        ↓
        handleRecordSuccess()
        recordedVaccines[1] = true
        showToast.success("تم تسجيل الحقنة الثلاثية بنجاح ✅")
        Modal closes
        ↓
        Component rerenders:
        • Vaccine 1 button: GREEN ✓ تم التسجيل (disabled)
        • Vaccine 2 button: BLUE ⏱ تم (clickable)
        • Vaccine 3 button: RED ❌ غير متاح (disabled)

T6      User clicks "تم" for Vaccine 2
        (SAME PROCESS)
        ↓
        [API] POST /childs/recordVaccine
        {
          childId: "child123",
          scheduleId: 2,              ⭐ DIFFERENT ID
          actualDate: "2024-02-15",
          office: "مكتب الصحة"
        }

T7      API Response
        ← Success
        recordedVaccines[2] = true
        ↓
        Component rerenders:
        • Vaccine 1 button: GREEN ✓ تم التسجيل (disabled)
        • Vaccine 2 button: GREEN ✓ تم التسجيل (disabled)  ⭐ NOW GREEN
        • Vaccine 3 button: RED ❌ غير متاح (disabled)

T8      User tries to click Vaccine 3
        handleOpenRecordModal({scheduleId: 3, isAvailable: false})
        ↓
        if (vaccine.isAvailable === false) {
          showToast.warning("BCG غير متوفر في الوقت الحالي")
          return;  // Don't open modal
        }

T9      Dashboard shows FINAL STATE:
        ✓ Vaccine 1 - RECORDED
        ✓ Vaccine 2 - RECORDED
        ❌ Vaccine 3 - UNAVAILABLE
```

---

## 5. Data Flow: Single Vaccine Recording

```
Input Data (from API):
{
  scheduleId: "ghada-001",
  title: "الحقنة الثلاثية",
  date: "2024-02-15",
  isAvailable: true,
  warning: null
}

        ↓ User clicks button
        
SmartVisitPackageCard State Update:
{
  selectedVaccineForRecord: {
    scheduleId: "ghada-001",
    title: "الحقنة الثلاثية",
    ...
  },
  showRecordModal: true
}

        ↓ Modal Form Submission
        
API Call Payload:
{
  childId: "child123",
  scheduleId: "ghada-001",      ⭐ KEY FIELD
  actualDate: "2024-02-15",
  office: "مكتب الصحة المركزي"
}

        ↓ API Response
        
Backend Response:
{
  success: true,
  vaccine: {
    scheduleId: "ghada-001",
    status: "recorded",
    recordedAt: "2024-02-15T14:30:00Z"
  }
}

        ↓ onSuccess Callback
        
Update Component State:
{
  recordedVaccines: {
    "ghada-001": true  ⭐ MARKS THIS VACCINE AS RECORDED
  },
  showRecordModal: false,
  selectedVaccineForRecord: null
}

        ↓ Component Rerender
        
UI Update:
Button for "ghada-001" changes:
  FROM: [⏱ تم] (blue, clickable)
  TO:   [✓ تم التسجيل] (green, disabled)

Other vaccines:
  [⏱ تم] (still blue, still clickable)
```

---

## 6. Error Handling Flow

```
User Clicks "تم"
      │
      ▼
Modal Opens
      │
      ▼
User Fills Form & Submits
      │
      ├─────────────────────────────────┐
      │                                 │
      ▼                                 ▼
   SUCCESS                            ERROR
   
   ├─ 200 OK                          ├─ 400 Bad Request
   │  ├─ Update state                 │  └─ Show: "بيانات غير صحيحة"
   │  ├─ Success toast                │
   │  ├─ Close modal                  ├─ 401 Unauthorized
   │  └─ Rerender card                │  └─ Show: "يجب تسجيل الدخول"
   │                                  │
   │                                  ├─ 404 Not Found
   │                                  │  └─ Show: "التطعيم غير موجود"
   │                                  │
   │                                  ├─ 500 Server Error
   │                                  │  └─ Show: "خطأ في الخادم"
   │                                  │
   │                                  └─ Network Error
   │                                     └─ Show: "فشل الاتصال"
   │
   ▼
User can record next vaccine immediately
```

---

## 7. Button State Transitions

```
┌─────────────────────────────────────────────────────────────┐
│                    BUTTON STATE MACHINE                      │
└─────────────────────────────────────────────────────────────┘

Initial State Tree:
├─ isAvailable === true
│  └─ recordedVaccines[scheduleId] === undefined
│     └─ STATE: AVAILABLE ✅
│        • Button Text: "⏱ تم"
│        • Button Color: Blue/White
│        • Disabled: false
│        • onClick: Opens modal
│
├─ isAvailable === true
│  └─ recordedVaccines[scheduleId] === true
│     └─ STATE: RECORDED ✅
│        • Button Text: "✓ تم التسجيل"
│        • Button Color: Green
│        • Disabled: true
│        • onClick: Toast info "مسبقاً"
│
└─ isAvailable === false
   ├─ Any recorded state
   └─ STATE: UNAVAILABLE ❌
      • Button Text: "❌ غير متاح"
      • Button Color: Red
      • Disabled: true
      • onClick: Toast warning "غير متوفر"


State Transitions:
────────────────

AVAILABLE ──[User clicks]─→ MODAL OPENS
   │
   │                         │
   │         [User submits]  │
   │             │           │
   │             ▼           │
   │         API CALL        │
   │             │           │
   │       ┌─────┴─────┐     │
   │       │           │     │
   │     SUCCESS     FAILURE │
   │       │           │     │
   │       ▼           ▼     │
   │     RECORDED    AVAILABLE ◄────┘
   │       │           │
   │       │           └─ Show error toast
   │       │              User can retry
   │       │
   │       └─ Green button, disabled
   │          "✓ تم التسجيل"
   │
   └─ User cannot click again
```

---

## 8. Complete Sequence Diagram (Mermaid-style)

```
PARTICIPANT: Mother
PARTICIPANT: SmartVisitPackageCard
PARTICIPANT: RecordVaccineModal
PARTICIPANT: API Server
PARTICIPANT: Dashboard

Mother → SmartVisitPackageCard: Sees 3 vaccines grouped
SmartVisitPackageCard → Mother: Shows card with 3 rows

Mother → SmartVisitPackageCard: Clicks "تم" for Vaccine 1
SmartVisitPackageCard → RecordVaccineModal: Open with vaccine 1 data
RecordVaccineModal → Mother: Shows form (date, office)

Mother → RecordVaccineModal: Fills date, selects office, clicks تأكيد
RecordVaccineModal → API Server: POST /recordVaccine {scheduleId: 1, ...}
API Server → RecordVaccineModal: 200 OK {success: true}

RecordVaccineModal → SmartVisitPackageCard: onSuccess() callback
SmartVisitPackageCard → SmartVisitPackageCard: recordedVaccines[1] = true
SmartVisitPackageCard → Mother: Toast "تم التسجيل بنجاح"
SmartVisitPackageCard → Mother: Update vaccine 1 button to GREEN ✓

Mother → SmartVisitPackageCard: Sees vaccine 1 marked, vaccine 2 still blue
Mother → SmartVisitPackageCard: Clicks "تم" for Vaccine 2
SmartVisitPackageCard → RecordVaccineModal: Open with vaccine 2 data
RecordVaccineModal → Mother: Shows form

Mother → RecordVaccineModal: Fills and submits
RecordVaccineModal → API Server: POST /recordVaccine {scheduleId: 2, ...}
API Server → RecordVaccineModal: 200 OK

RecordVaccineModal → SmartVisitPackageCard: onSuccess()
SmartVisitPackageCard → SmartVisitPackageCard: recordedVaccines[2] = true
SmartVisitPackageCard → Mother: Toast "تم التسجيل بنجاح"
SmartVisitPackageCard → Mother: Vaccine 2 button now GREEN ✓

Mother → SmartVisitPackageCard: Tries to click "تم" for Vaccine 3 (unavailable)
SmartVisitPackageCard → Mother: Toast "BCG غير متوفر في الوقت الحالي"
SmartVisitPackageCard → Mother: Button remains RED ❌, disabled

Mother → Dashboard: Final state shows 2 vaccinated, 1 unavailable
```
