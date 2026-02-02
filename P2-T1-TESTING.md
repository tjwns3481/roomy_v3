# P2-T1 Testing Guide

## PhonePreview Drag-and-Drop Testing

### Test Environment
- **Dev Server:** http://localhost:3000
- **Test Route:** `/editor/[guideId]`
- **Build Status:** ✅ Successful
- **Date:** 2026-02-02

---

## Pre-Testing Setup

### 1. Start Dev Server
```bash
npm run dev
```

### 2. Create Test Guide
1. Navigate to `/dashboard`
2. Click "새 가이드 만들기"
3. Add 3-4 blocks of different types
4. Note the guide ID from URL

### 3. Open Browser DevTools
- Check Console for errors
- Monitor Network tab for API calls
- Observe Performance tab for jank

---

## Test Cases

### TC-01: Basic Drag Operation

**Objective:** Verify basic drag-and-drop works

**Steps:**
1. Navigate to `/editor/[guideId]`
2. Hover over the second block
3. Observe drag handle appears on left
4. Click and hold drag handle
5. Move mouse upward
6. Release above first block

**Expected:**
- ✅ Drag handle fades in on hover
- ✅ Cursor changes to grabbing
- ✅ Block becomes semi-transparent (50%)
- ✅ Overlay shows full preview
- ✅ Blocks smoothly reposition
- ✅ Block drops at new position
- ✅ Auto-save indicator shows "Saving..."
- ✅ Console shows no errors

**Screenshot:** `TC-01-basic-drag.png`

---

### TC-02: Drag Handle Appearance

**Objective:** Verify drag handle styling

**Steps:**
1. Hover over first block
2. Wait for drag handle to appear
3. Move mouse away
4. Observe handle disappears

**Expected:**
- ✅ Handle appears within 200ms
- ✅ Icon is `drag_indicator`
- ✅ Background is white with shadow
- ✅ Handle is left of block (-8px)
- ✅ Handle fades out on blur

**Screenshot:** `TC-02-drag-handle.png`

---

### TC-03: Selection State

**Objective:** Verify selection is maintained

**Steps:**
1. Click on third block (select it)
2. Observe blue ring appears
3. Drag second block up
4. Observe third block still selected

**Expected:**
- ✅ Selected block has primary ring
- ✅ Ring has offset (ring-offset-2)
- ✅ Selection persists during drag
- ✅ Selection persists after drop

**Screenshot:** `TC-03-selection-state.png`

---

### TC-04: Drag Overlay

**Objective:** Verify floating preview

**Steps:**
1. Start dragging a block
2. Observe floating overlay
3. Move mouse around
4. Observe overlay follows cursor

**Expected:**
- ✅ Overlay shows full block content
- ✅ Overlay has shadow-2xl
- ✅ Overlay has primary ring
- ✅ Overlay follows cursor smoothly
- ✅ Overlay opacity is 90%

**Screenshot:** `TC-04-drag-overlay.png`

---

### TC-05: Keyboard Navigation

**Objective:** Verify keyboard accessibility

**Steps:**
1. Click away from blocks
2. Press Tab until block is focused
3. Press Space (pick up)
4. Press Arrow Down twice
5. Press Space (drop)

**Expected:**
- ✅ Tab cycles through blocks
- ✅ Focus ring is visible
- ✅ Space picks up block
- ✅ Arrow keys move block
- ✅ Space drops block
- ✅ Escape cancels drag

**Screenshot:** `TC-05-keyboard-nav.png`

---

### TC-06: Touch Interaction (Mobile)

**Objective:** Verify mobile touch support

**Steps:**
1. Open DevTools mobile emulation
2. Select iPhone 12 Pro
3. Long press on block (500ms)
4. Drag finger up/down
5. Release finger

**Expected:**
- ✅ Long press activates drag
- ✅ Block follows finger
- ✅ Smooth scrolling
- ✅ Drop on release
- ✅ No scroll jank

**Screenshot:** `TC-06-mobile-touch.png`

---

### TC-07: Order Persistence

**Objective:** Verify order is saved

**Steps:**
1. Drag block to new position
2. Wait for auto-save (2 seconds)
3. Observe "Saved" indicator
4. Refresh page (Cmd+R)
5. Observe block order maintained

**Expected:**
- ✅ Auto-save triggers within 2s
- ✅ Saved indicator appears
- ✅ Order persists after refresh
- ✅ No console errors

**Screenshot:** `TC-07-order-persistence.png`

---

### TC-08: Edge Case - Single Block

**Objective:** Verify single block behavior

**Steps:**
1. Delete all blocks except one
2. Hover over remaining block
3. Observe drag handle

**Expected:**
- ✅ Drag handle appears
- ✅ Can pick up block
- ✅ Cannot drop elsewhere
- ✅ Returns to original position

**Screenshot:** `TC-08-single-block.png`

---

### TC-09: Edge Case - Empty List

**Objective:** Verify empty state

**Steps:**
1. Delete all blocks
2. Observe empty state message

**Expected:**
- ✅ Shows "왼쪽 사이드바에서 블록을 추가하여"
- ✅ Shows add_box icon
- ✅ No drag handles visible
- ✅ No console errors

**Screenshot:** `TC-09-empty-list.png`

---

### TC-10: Edge Case - Rapid Drag

**Objective:** Verify performance under stress

**Steps:**
1. Quickly drag first block up and down 10 times
2. Observe animations
3. Check CPU usage

**Expected:**
- ✅ No jank or stutter
- ✅ Animations stay smooth (60fps)
- ✅ CPU usage < 50%
- ✅ No memory leaks

**Screenshot:** `TC-10-rapid-drag.png`

---

### TC-11: Mobile vs Desktop Mode

**Objective:** Verify both device modes

**Steps:**
1. Set device mode to mobile
2. Drag a block
3. Switch to desktop mode
4. Drag a block again

**Expected:**
- ✅ Drag works in mobile mode
- ✅ Drag works in desktop mode
- ✅ Layout adjusts correctly
- ✅ No visual glitches

**Screenshots:**
- `TC-11-mobile-mode.png`
- `TC-11-desktop-mode.png`

---

### TC-12: Dark Mode

**Objective:** Verify dark mode styling

**Steps:**
1. Enable dark mode (OS setting)
2. Refresh page
3. Hover over block
4. Drag a block

**Expected:**
- ✅ Drag handle has dark background
- ✅ Overlay has dark styling
- ✅ Borders are dark-themed
- ✅ Text is readable

**Screenshot:** `TC-12-dark-mode.png`

---

### TC-13: Screen Reader

**Objective:** Verify accessibility

**Steps:**
1. Enable VoiceOver (Mac) or NVDA (Windows)
2. Tab to block
3. Listen to announcement
4. Press Space to pick up
5. Listen to announcement
6. Press Arrow key
7. Listen to announcement

**Expected:**
- ✅ Announces block type
- ✅ Announces "selected for dragging"
- ✅ Announces "moved to position N"
- ✅ Announces "dropped"

**Recording:** `TC-13-screen-reader.mov`

---

### TC-14: Auto-save Integration

**Objective:** Verify auto-save triggers

**Steps:**
1. Open Network tab
2. Drag a block
3. Wait 2 seconds
4. Observe PATCH request to `/api/guides/[id]`
5. Check response status

**Expected:**
- ✅ PATCH request sent
- ✅ Status code 200
- ✅ Body contains updated content_blocks
- ✅ No error toasts

**Screenshot:** `TC-14-network-tab.png`

---

### TC-15: Error Handling

**Objective:** Verify error scenarios

**Steps:**
1. Open DevTools Network tab
2. Enable offline mode
3. Drag a block
4. Wait for auto-save error
5. Observe error state

**Expected:**
- ✅ Error indicator appears
- ✅ Retry button visible
- ✅ Block order preserved locally
- ✅ Console shows error

**Screenshot:** `TC-15-error-state.png`

---

## Performance Benchmarks

### Metrics to Collect

1. **Time to Interactive**
   - Target: < 3 seconds

2. **Drag Start Latency**
   - Target: < 100ms

3. **Frame Rate During Drag**
   - Target: 60fps (16.67ms/frame)

4. **CPU Usage**
   - Target: < 50% on average device

5. **Memory Usage**
   - Target: < 100MB increase

### Tools
- Chrome DevTools Performance tab
- React DevTools Profiler
- Lighthouse audit

---

## Accessibility Checklist

- [ ] Keyboard-only navigation works
- [ ] Screen reader announces actions
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG AA
- [ ] Touch targets >= 44x44px
- [ ] No motion sickness triggers
- [ ] Respects prefers-reduced-motion

---

## Browser Compatibility

### Desktop Browsers
- [ ] Chrome 120+ (Mac)
- [ ] Chrome 120+ (Windows)
- [ ] Firefox 120+ (Mac)
- [ ] Firefox 120+ (Windows)
- [ ] Safari 17+ (Mac)
- [ ] Edge 120+ (Windows)

### Mobile Browsers
- [ ] Safari (iOS 16+)
- [ ] Chrome (Android 12+)
- [ ] Samsung Internet (Android 12+)

---

## Bug Report Template

```markdown
## Bug Description
[Clear description of the issue]

## Steps to Reproduce
1. [First step]
2. [Second step]
3. [...]

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Screenshots
[Attach screenshots]

## Environment
- Browser: [Chrome 120.0]
- OS: [macOS 13.0]
- Device: [MacBook Pro M1]
- Screen Size: [1920x1080]

## Console Errors
```
[Paste console errors]
```

## Network Requests
[Any failed requests]

## Additional Context
[Any other relevant info]
```

---

## Test Results

### Pass/Fail Summary

| Test Case | Status | Notes |
|-----------|--------|-------|
| TC-01 | ⏳ Pending | |
| TC-02 | ⏳ Pending | |
| TC-03 | ⏳ Pending | |
| TC-04 | ⏳ Pending | |
| TC-05 | ⏳ Pending | |
| TC-06 | ⏳ Pending | |
| TC-07 | ⏳ Pending | |
| TC-08 | ⏳ Pending | |
| TC-09 | ⏳ Pending | |
| TC-10 | ⏳ Pending | |
| TC-11 | ⏳ Pending | |
| TC-12 | ⏳ Pending | |
| TC-13 | ⏳ Pending | |
| TC-14 | ⏳ Pending | |
| TC-15 | ⏳ Pending | |

### Overall Status
⏳ **Testing Not Started**

---

## Screenshots

Screenshots should be saved to:
```
/screenshots/P2-T1/
├── TC-01-basic-drag.png
├── TC-02-drag-handle.png
├── TC-03-selection-state.png
├── TC-04-drag-overlay.png
├── TC-05-keyboard-nav.png
├── TC-06-mobile-touch.png
├── TC-07-order-persistence.png
├── TC-08-single-block.png
├── TC-09-empty-list.png
├── TC-10-rapid-drag.png
├── TC-11-mobile-mode.png
├── TC-11-desktop-mode.png
├── TC-12-dark-mode.png
├── TC-13-screen-reader.mov
├── TC-14-network-tab.png
└── TC-15-error-state.png
```

---

## Sign-Off

**Tester:** _____________
**Date:** _____________
**Status:** [ ] All Tests Pass [ ] Issues Found

**Issues Found:** _____________

**Ready for Production:** [ ] Yes [ ] No

---

**Last Updated:** 2026-02-02
**Version:** 1.0.0
**Test Plan By:** Claude AI Assistant
