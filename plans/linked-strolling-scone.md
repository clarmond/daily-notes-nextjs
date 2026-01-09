# Implementation Plan: First Focus of Day Dashboard Refresh

## Overview
Add functionality to refresh the dashboard to the current date when the window/tab receives focus for the first time each day.

## User Requirements (from clarification)
- **Trigger**: Only on window focus (not at midnight)
- **Condition**: Only refresh if user is currently viewing today's date (respect manual navigation)
- **Feedback**: Show toast notification when auto-refresh occurs

## Critical Files to Modify

1. **app/layout.jsx** - Fix provider hierarchy (lines 14-15)
2. **context/GlobalContext.js** - Add focus listener and refresh logic

## Implementation Steps

### Step 1: Fix Provider Hierarchy in layout.jsx

**Problem**: GlobalProvider currently wraps ToastProvider, but we need ToastProvider to wrap GlobalProvider so that GlobalContext can use the `useToast()` hook.

**Current (lines 14-15)**:
```jsx
<GlobalProvider>
  <ToastProvider>
```

**Change to**:
```jsx
<ToastProvider>
  <GlobalProvider>
```

This requires swapping lines 14 and 40 to properly nest the providers.

### Step 2: Add Focus Refresh Logic to GlobalContext.js

**2a. Add import (after line 5)**:
```javascript
import { useToast } from "@/context/ToastContext";
```

**2b. Add state for tracking last refresh date (after line 16)**:
```javascript
const [lastRefreshDate, setLastRefreshDate] = useState(null);
```

**2c. Initialize toast hook (after line 16)**:
```javascript
const { showToast } = useToast();
```

**2d. Add window focus event listener (after line 78, before return statement)**:

```javascript
// Effect 5: Handle "first focus of the day" auto-refresh
useEffect(() => {
  const handleFocus = async () => {
    // Get today's date as YYYY-MM-DD string for comparison
    const todayString = dayjs().format('YYYY-MM-DD');
    const selectedDateString = dayjs(selectedDate).format('YYYY-MM-DD');

    // Only proceed if user is viewing today's date
    if (selectedDateString !== todayString) {
      return;
    }

    // Check if we need to refresh (new day since last focus)
    const lastRefreshString = lastRefreshDate
      ? dayjs(lastRefreshDate).format('YYYY-MM-DD')
      : null;

    if (lastRefreshString !== todayString) {
      // It's a new day! Refresh tasks
      setIsLoaded(false);

      try {
        // Fetch current tasks for today
        const currentTasks = await getTasksByDate(todayString);
        setCurrentItems(currentTasks);

        // Fetch updated previous tasks
        const recentDateString = await getMostRecentPreviousDate();
        if (recentDateString) {
          const newPreviousDate = new Date(recentDateString);
          setPreviousDate(newPreviousDate);

          const previousTasks = await getTasksByDate(dayjs(newPreviousDate).format('YYYY-MM-DD'));
          setPreviousItems(previousTasks);
        }

        // Update last refresh date and show notification
        setLastRefreshDate(new Date());
        showToast('Refreshed to today\'s tasks', 'success');
      } catch (error) {
        console.error('Error refreshing tasks on focus:', error);
        showToast('Failed to refresh tasks', 'error');
      } finally {
        setIsLoaded(true);
      }
    }
  };

  // Add event listener
  window.addEventListener('focus', handleFocus);

  // Cleanup on unmount
  return () => {
    window.removeEventListener('focus', handleFocus);
  };
}, [selectedDate, lastRefreshDate, showToast, setCurrentItems, setPreviousItems, setIsLoaded, setPreviousDate]);
```

## How It Works

1. **Date Tracking**: `lastRefreshDate` state stores when the last refresh occurred (in-memory, resets on browser close)

2. **Focus Event**: Window focus listener fires whenever user switches back to the browser tab/window

3. **Conditions Check**:
   - Is user viewing today? (Compare `selectedDate` to current date)
   - Is this the first focus of a new day? (Compare `lastRefreshDate` to current date)

4. **Refresh Logic**:
   - Fetch fresh current tasks for today
   - Fetch fresh previous tasks (most recent previous day)
   - Update state and show success toast

5. **Error Handling**: Try/catch block shows error toast if fetch fails

## Edge Cases Handled

- User viewing past date → No refresh (respects manual navigation)
- Multiple focus events same day → Only first triggers refresh
- Browser closed/reopened → `lastRefreshDate` resets, next focus will refresh
- Component unmount → Event listener cleanup prevents memory leaks
- Network errors → Error toast shown, loading state restored

## Testing Scenarios

1. Normal case: Keep app open overnight, focus window next morning → Tasks refresh with toast
2. Past date: Navigate to yesterday, focus window → No refresh
3. Same day: Focus multiple times → Only first focus refreshes
4. Browser restart: Close at night, open next day, focus → Refresh occurs
