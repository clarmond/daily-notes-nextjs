# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A daily notes/task management application built with Next.js 15, MongoDB/Mongoose, and NextAuth.js for Google OAuth authentication. Users track daily goals, mark completion, and view previous day's tasks.

## Development Commands

```bash
# Start development server on http://localhost:3000
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Architecture Overview

### Authentication & Sessions

- Uses NextAuth.js with Google OAuth provider
- Configuration in `utils/authOptions.js`:
  - `signIn` callback creates new User in MongoDB on first login
  - `session` callback attaches MongoDB `user._id` to `session.user.id`
- Server actions call `getSessionUser()` from `utils/getSessionUser.js` to validate authentication
- All database operations require authenticated session

### Data Models (Mongoose)

**Task** (`models/Task.js`):
- `owner`: ObjectId ref to User (required)
- `text`: String (required)
- `is_completed`: Boolean (default false)
- `is_note`: Boolean (default false)
- `priority`: Number (default 0)
- `publish_date`: Date
- Includes timestamps (createdAt, updatedAt)

**User** (`models/User.js`):
- `email`: String (unique, required)
- `username`: String (required)
- `image`: String
- `bookmarks`: Array of ObjectIds (legacy field, unused)

### State Management Pattern

**GlobalContext** (`context/GlobalContext.js`):
- Client-side React Context providing global state
- On mount, fetches current day and previous day tasks via `Promise.allSettled`
- Exposes: `currentItems`, `previousItems`, `isLoaded`, `currentId`, and their setters
- **Critical**: Does NOT auto-refresh after mutations - components must manually update state arrays after server actions

### Server Actions (`app/actions/tasks.js`)

All database operations use Next.js Server Actions:

- `saveNewTask(text, is_completed, is_note)` - Creates task for authenticated user
- `getCurrentTasks()` - Returns today's tasks (filtered by createdAt >= today 00:00:00 and < 23:59:59)
- `getPreviousTasks()` - Finds most recent previous day with tasks, returns all from that day
- `updateCompletion(id, isComplete)` - Updates task completion status
- `deleteItem(id)` - Deletes task by ID

**Date filtering logic**: All queries use `startOfToday` and `endOfToday` Date objects set to midnight boundaries for consistent day-based filtering.

### UI Structure

- **Root layout** (`app/layout.jsx`): Wraps in `GlobalProvider` → `AuthProvider`, includes Bootstrap 5.3.8 from CDN
- **Main page** (`app/page.jsx`): Conditionally renders `LoginBox` (if not authenticated) or three task boxes with delete modal
- **Task boxes**:
  - `TodaysGoalsBox` - Shows incomplete tasks from currentItems
  - `TodaysDoneBox` - Shows completed tasks from currentItems
  - `PreviousDoneBox` - Shows completed tasks from previousItems
- Components use `useGlobalContext()` hook to access shared state

### Database Connection

- `config/db.js` implements singleton connection pattern
- Maintains `connected` flag to prevent duplicate connections
- Uses `MONGODB_URI` from environment variables

## Key Implementation Details

**Object Serialization**: Server actions convert Mongoose documents to plain objects using `convertToSerialObject()` utility before returning to client (handles ObjectId and Date conversion).

**Component Pattern**: Most UI components are client-side (`'use client'` directive) due to hooks and interactivity. Server actions handle all database operations.

**Manual State Updates**: After calling server actions that mutate data, components must manually update GlobalContext state arrays - there's no automatic refetch mechanism.

## Environment Variables

Required in `.env`:
```
MONGODB_URI=<MongoDB connection string>
GOOGLE_CLIENT_ID=<Google OAuth client ID>
GOOGLE_CLIENT_SECRET=<Google OAuth client secret>
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_URL_INTERNAL=http://localhost:3000
NEXTAUTH_SECRET=<NextAuth session encryption secret>
```

## Known Technical Debt

- Missing try/catch error handling in server actions (see TODO at `app/actions/tasks.js:3`)
- `User.bookmarks` field references non-existent `Property` model (legacy code)
- `updateCompletion()` and `deleteItem()` don't return values or confirmation
