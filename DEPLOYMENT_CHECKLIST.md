# Independent Vaccine Recording - Deployment Checklist

## Pre-Deployment Tasks

### Code Review
- [ ] SmartVisitPackageCard component properly imports RecordVaccineModal
- [ ] RecordVaccineModal receives scheduleId prop
- [ ] Each vaccine object in allVaccines has scheduleId field
- [ ] vaccineGrouping utility assigns scheduleId to all vaccines
- [ ] No console.log debug statements in production code
- [ ] Error handling covers all edge cases

### Data Structure Verification
- [ ] Each vaccine has unique scheduleId (not null/undefined)
- [ ] scheduleId is passed correctly through entire chain:
  - [ ] API returns scheduleId in vaccine object
  - [ ] createVisitPackage preserves scheduleId
  - [ ] SmartVisitPackageCard receives it in allVaccines
  - [ ] RecordVaccineModal receives it as prop
- [ ] Visit package groups vaccines by date correctly
- [ ] Only vaccines on same date are grouped together

### API Endpoint Verification
- [ ] Backend `/childs/recordVaccine` endpoint is ready
- [ ] Endpoint accepts single scheduleId (not array)
- [ ] Endpoint properly validates childId + scheduleId combination
- [ ] Endpoint prevents duplicate recordings
- [ ] Error responses include meaningful messages
- [ ] Success response includes vaccine details
- [ ] Endpoint logs each recording for audit trail

### Testing Checklist

#### Scenario: Record First Vaccine
- [ ] Dashboard loads vaccine list
- [ ] Vaccine appears in SmartVisitPackageCard
- [ ] "تم" button is visible and clickable
- [ ] Click button opens RecordVaccineModal
- [ ] Modal shows correct vaccine name
- [ ] Date field has today's date pre-filled
- [ ] Office dropdown has options
- [ ] Click "تأكيد" submits form
- [ ] API call includes correct scheduleId
- [ ] Success toast appears: "تم تسجيل... بنجاح ✅"
- [ ] Button changes to green "✓ تم التسجيل"
- [ ] Button becomes disabled
- [ ] Modal closes automatically

#### Scenario: Record Multiple Vaccines
- [ ] First vaccine recorded (see above)
- [ ] Second vaccine still has blue "تم" button
- [ ] Click second vaccine's button
- [ ] Modal opens with different vaccine name
- [ ] API call sends different scheduleId
- [ ] Second vaccine button turns green
- [ ] Both vaccines now show as recorded
- [ ] User can't click recorded vaccines again

#### Scenario: Unavailable Vaccine
- [ ] Vaccine marked as isAvailable: false
- [ ] Button shows red "❌ غير متاح"
- [ ] Button appears disabled
- [ ] Click button shows warning toast
- [ ] Modal never opens
- [ ] Button stays red
- [ ] No API call is made

#### Scenario: Error Handling
- [ ] Invalid childId: Error toast appears
- [ ] Invalid scheduleId: Error toast appears
- [ ] Network error: Error toast appears
- [ ] Backend error: Error message displayed
- [ ] Modal stays open on error (user can retry)
- [ ] User can correct and resubmit

#### Scenario: Browser Back/Refresh
- [ ] Recording persists after page refresh
- [ ] Recorded vaccines still show as green
- [ ] Can still record other vaccines
- [ ] No duplicate recordings

#### Scenario: Multiple Children
- [ ] Correct childId sent in API call
- [ ] Recording only affects that child's vaccines
- [ ] Other children's vaccines unaffected

### UI/UX Verification
- [ ] Visit date displayed prominently
- [ ] Days remaining countdown accurate
- [ ] Office location shown
- [ ] Child name displayed
- [ ] Vaccine titles accurate
- [ ] Icons clear (✓ ❌ ⏱)
- [ ] Colors distinguish states (green/red/blue)
- [ ] Buttons accessible on mobile
- [ ] Text is readable (contrast, size)
- [ ] Animations smooth, not jarring
- [ ] Toast notifications position well
- [ ] No overlapping elements

### Performance Checks
- [ ] Component renders without lag
- [ ] Modal opens instantly
- [ ] Form submission doesn't freeze UI
- [ ] No unnecessary re-renders
- [ ] Bundle size acceptable
- [ ] No memory leaks on repeated use

### Accessibility Verification
- [ ] Buttons have proper aria labels
- [ ] Form inputs have associated labels
- [ ] Color not only indicator of state
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Text contrast meets WCAG standards

## Deployment Steps

### 1. Prepare Environment
```bash
# Ensure all environment variables set
- [ ] NEXT_PUBLIC_API_URL set correctly
- [ ] API_KEY set for backend authentication
- [ ] Database migrations applied
```

### 2. Build & Test
```bash
# Build the application
npm run build
- [ ] Build succeeds without errors
- [ ] No console warnings in build output

# Run tests if applicable
npm run test
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] Component tests pass
```

### 3. Manual QA in Staging
```
- [ ] Deploy to staging environment
- [ ] Test all scenarios from testing checklist
- [ ] Test with real backend API
- [ ] Verify API response formats
- [ ] Check error handling
- [ ] Test on mobile browsers (iOS Safari, Chrome)
- [ ] Test on desktop browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test with slow network (throttle to 3G)
- [ ] Test with offline then online
```

### 4. Load Testing (if applicable)
```
- [ ] Test with multiple concurrent users
- [ ] Monitor API response times
- [ ] Check for race conditions
- [ ] Verify no duplicate recordings under load
```

### 5. Security Review
- [ ] Verify scheduleId can't be guessed/enumerated
- [ ] Check childId validation prevents unauthorized access
- [ ] Ensure no sensitive data in logs
- [ ] Verify HTTPS in use
- [ ] Check for XSS vulnerabilities
- [ ] Validate input sanitization

### 6. Production Deployment
```bash
# Backup current version
- [ ] Database backed up
- [ ] Current code version tagged in git

# Deploy new version
- [ ] Code deployed to production
- [ ] Health checks pass
- [ ] Monitoring alerts active
```

### 7. Post-Deployment Verification
- [ ] Application loads without errors
- [ ] Can record vaccines successfully
- [ ] API calls show in backend logs
- [ ] Toast notifications appear correctly
- [ ] No error logs
- [ ] Performance metrics normal
- [ ] Real users testing (select group)

### 8. Monitoring Setup
- [ ] API response time alerts
- [ ] Error rate alerts
- [ ] Failed recording alerts
- [ ] User engagement metrics
- [ ] Performance degradation alerts

## Rollback Plan

If issues occur:

```
SEVERITY: Critical (app broken)
- [ ] Rollback to previous version immediately
- [ ] Notify users of outage
- [ ] Investigate root cause

SEVERITY: Major (recording not working)
- [ ] Check API endpoint logs
- [ ] Verify database connection
- [ ] Check if scheduleId exists
- [ ] Verify backend accepts single scheduleId

SEVERITY: Minor (UI glitch)
- [ ] Patch in next release
- [ ] Document workaround for users if needed

ROLLBACK STEPS:
1. [ ] Identify last known good version
2. [ ] Revert to previous release
3. [ ] Clear browser cache (if client-side)
4. [ ] Verify functionality restored
5. [ ] Post-mortem analysis
6. [ ] Ticket created for fix
```

## Post-Launch Support

### First Week
- [ ] Daily monitoring of error logs
- [ ] Check user feedback channels
- [ ] Monitor API performance
- [ ] Verify no duplicate recordings
- [ ] Check vaccine recording accuracy

### Ongoing
- [ ] Weekly dashboard review
- [ ] Monthly performance review
- [ ] Quarterly user satisfaction survey
- [ ] Maintenance and updates as needed

## Success Metrics

Track these after launch:

| Metric | Target | Current |
|--------|--------|---------|
| Recording success rate | >99% | ___ |
| Average form submission time | <2s | ___ |
| API response time (p95) | <500ms | ___ |
| Error rate | <0.1% | ___ |
| User satisfaction | >4/5 | ___ |
| Page load time | <3s | ___ |
| Mobile load time | <5s | ___ |

## Communication Plan

### To Development Team
- [ ] Code walkthrough scheduled
- [ ] Documentation shared
- [ ] Support procedures documented
- [ ] On-call rotation updated

### To QA Team
- [ ] Test scenarios provided
- [ ] Staging environment access given
- [ ] Expected outcomes documented
- [ ] Regression testing list prepared

### To Product/Stakeholders
- [ ] Feature is ready
- [ ] Timeline confirmed
- [ ] Success criteria defined
- [ ] Post-launch plan shared

### To Users
- [ ] Feature announcement scheduled
- [ ] Tutorial/help documentation ready
- [ ] Support contact info provided
- [ ] Feedback channel established

## Documentation

Before deployment, ensure:
- [ ] IMPLEMENTATION_SUMMARY.md is accurate
- [ ] VACCINE_RECORDING_FLOW.md reflects actual implementation
- [ ] COMPONENT_STRUCTURE.md matches code structure
- [ ] API documentation updated
- [ ] User guide updated
- [ ] Admin guide updated (if applicable)

## Database Backup

```bash
# Before deployment
- [ ] Production database backed up
- [ ] Backup verified (tested restore)
- [ ] Backup stored securely
- [ ] Backup schedule reviewed
```

## Final Sign-Off

- [ ] Tech Lead approved
- [ ] Product Manager approved
- [ ] QA Lead approved
- [ ] Security Lead approved
- [ ] DevOps Lead approved

## Deployment Status

| Phase | Status | Date | Notes |
|-------|--------|------|-------|
| Code Review | ⏳ | ___ | ___ |
| Testing | ⏳ | ___ | ___ |
| Staging Deploy | ⏳ | ___ | ___ |
| QA Sign-Off | ⏳ | ___ | ___ |
| Prod Deploy | ⏳ | ___ | ___ |
| Post-Launch | ⏳ | ___ | ___ |

## Quick Reference During Deployment

### If Something Goes Wrong
1. Check `/childs/recordVaccine` endpoint logs
2. Verify scheduleId in allVaccines array
3. Check browser console for errors
4. Monitor API response times
5. Check for database connection issues
6. Verify environment variables set

### Emergency Contacts
- Backend Engineer: _______
- Frontend Engineer: _______
- DevOps: _______
- Product Manager: _______
- QA Lead: _______

### Rollback Command (if needed)
```bash
git revert <commit-hash>
npm run build
npm run deploy:prod
```

---

**Deployment Sign-Off Date:** _______

**Deployed By:** _______

**Verified By:** _______
