# Implementation Plan: Inline Edit Task/Note Functionality

## Overview

Add inline editing capability to tasks and notes with:
- Edit icon button (pencil) next to delete icon
- Double-click on task text to enter edit mode
- Inline input field replaces label during editing
- Save on Enter or blur, cancel on Escape
- Works for both regular tasks and notes
- Only enabled in editable boxes (Today's Goals/Done, not Previous Done)

## Implementation Approach: Inline Editing

**User selected: Inline editing** (text transforms into input field directly in the list)

### Architecture Decision

**Component-level state in ListItem** - No GlobalContext changes needed
- Each ListItem manages its own `isEditing`, `editText`, and `isSaving` state
- Follows existing pattern where ListItem handles checkbox toggle internally
- Simpler implementation without polluting global state

## Files to Modify

### 1. Server Action - `app/actions/tasks.js`

Add new server action following existing patterns:

```javascript
export async function updateTaskText(id, newText) {
  await connectDB();

  const sessionUser = await getSessionUser();
  if (!sessionUser || !sessionUser.userId) {
    throw new Error("User must be authenticated");
  }

  const trimmedText = newText.trim();
  if (!trimmedText) {
    throw new Error("Task text cannot be empty");
  }

  const item = await Task.findById(id);
  if (!item) {
    throw new Error("Task not found");
  }

  if (item.owner.toString() !== sessionUser.userId) {
    throw new Error("Unauthorized to update this task");
  }

  item.text = trimmedText;
  await item.save();

  return convertToSerialObject(item);
}
```

### 2. ListItem Component - `app/components/ListItem.jsx`

**Key changes:**
- Import `FaPencilAlt`, `useState` from React, `updateTaskText` action, and `useToast`
- Add state: `isEditing`, `editText`, `isSaving`
- Replace label (line 58) with conditional: input field when editing, label otherwise
- Add `onDoubleClick` handler to label to enter edit mode
- Add edit button to action buttons container (line 61-72) next to DeleteItem
- Implement handlers: `handleEditClick`, `handleSave`, `handleCancel`, `handleKeyDown`, `handleBlur`
- Update state arrays after successful save (follow `markAsComplete` pattern at lines 16-38)

**State update pattern (already in use):**
```javascript
// After server action, update currentItems or backburnerItems
const updatedItems = [...currentItems];
updatedItems.forEach((item) => {
  if (item._id === id) {
    item.text = trimmedText;
  }
});
setCurrentItems(updatedItems);
```

**Input field styling:**
- Use `form-control form-control-sm flex-grow-1` classes
- Add `autoFocus` to focus immediately
- Disable input while `isSaving`

**Edit button:**
- Icon: `FaPencilAlt` from react-icons/fa
- Classes: `btn btn-primary btn-sm`
- aria-label: "Edit this task"
- Only show when `editable={true}` and `!isEditing`

### 3. No Other Files Need Modification

- TodaysGoalsBox.jsx - No changes (already passes `editable={true}`)
- TodaysDoneBox.jsx - No changes (already passes `editable={true}`)
- PreviousDoneBox.jsx - No changes (already passes `editable={false}`)
- GlobalContext.js - No changes (ListItem handles its own state)
- DeleteModal.jsx - No changes (separate delete functionality)

## Event Flow

### Edit via Button Click
1. User clicks pencil icon
2. `handleEditClick()` sets `isEditing={true}`, initializes `editText`
3. Label → Input field transition
4. Input receives focus via `autoFocus`
5. Edit and delete buttons hide, input field appears

### Edit via Double-Click
1. User double-clicks label
2. Same as button click if `editable={true}`
3. No effect if `editable={false}` (Previous Done box)

### Save Changes
1. User presses Enter OR clicks outside input (blur)
2. `handleSave()` validates trimmed text
3. If empty → show error toast, stay in edit mode
4. If unchanged → exit edit mode without save
5. If valid → call `updateTaskText(id, trimmedText)`
6. Update local state array (currentItems or backburnerItems)
7. Show success toast
8. Exit edit mode (`isEditing={false}`)

### Cancel Changes
1. User presses Escape
2. `handleCancel()` resets `editText` to original
3. Exit edit mode without saving

### Error Handling
1. Server action fails → show error toast
2. Stay in edit mode for retry
3. User can press Escape to cancel

## Validation

**Client-side:**
- Trim whitespace
- Reject empty strings
- Skip save if text unchanged
- Prevent duplicate saves with `isSaving` flag

**Server-side:**
- Validate session authentication
- Verify task ownership
- Reject empty text
- Handle non-existent task IDs

## Technical Details

**Icons:** `FaPencilAlt` from react-icons/fa
**Button:** `btn btn-primary btn-sm` (blue primary color)
**Input:** `form-control form-control-sm flex-grow-1` with `autoFocus`
**Toast notifications:** Success/error messages via useToast hook (pattern from TransferItem)
**Loading state:** `isSaving` prevents duplicate submissions (pattern from TransferItem)
**Action detection:** Handle both regular tasks and backburner tasks via `action` prop

## Edge Cases Handled

- Double-click on checkbox → Only label has `onDoubleClick`, not checkbox
- Empty text → Client validation prevents save, stays in edit mode
- Unchanged text → Exit edit mode without server call
- Rapid Enter presses → `isSaving` flag prevents duplicate saves
- Read-only boxes → Edit button hidden, double-click disabled
- Delete modal open → Bootstrap backdrop blocks interaction
- Very long text → Input inherits flex layout, wraps naturally

## Critical Files

1. `/Users/carmond/code/personal/daily-notes-next-js/app/actions/tasks.js` - Add updateTaskText server action
2. `/Users/carmond/code/personal/daily-notes-next-js/app/components/ListItem.jsx` - Add inline edit state and UI
