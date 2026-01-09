# AI Monthly Summary Implementation Plan

## Overview
Add an AI-powered monthly summary feature that generates executive summaries with insights for completed tasks and notes using Claude API. The summary will be integrated into the existing Reports page with database caching to minimize costs.

## User Preferences
- **AI Provider**: Anthropic Claude API (Haiku 3.5 for cost efficiency)
- **UI Location**: Add to existing Reports page (/reports)
- **Scope**: Completed tasks + notes for selected month
- **Style**: Executive summary with insights (themes, patterns, highlights)

## Architecture Approach

**Hybrid model with optional database caching:**
1. Generate summaries on-demand when user clicks "Generate AI Summary" button
2. Cache generated summaries in MongoDB (new Summary model) to prevent duplicate API calls
3. Use Claude Haiku 3.5 (cost: ~$0.01-0.03 per summary)
4. Graceful fallback if API key missing or API fails

## Implementation Steps

### 1. Setup Dependencies (5 min)
- Install Anthropic SDK: `npm install @anthropic-ai/sdk`
- Add to `.env.local`: `ANTHROPIC_API_KEY=sk-ant-api03-...`

### 2. Create Database Model (15 min)

**Create:** `models/Summary.js`

Schema:
```javascript
{
  owner: ObjectId (ref: User) [required]
  year: Number [required]
  month: Number [required, 1-12]
  summary_text: String [required]
  task_count: Number [default: 0]
  prompt_tokens: Number
  completion_tokens: Number
  timestamps: true
}
```

Add compound unique index: `{ owner: 1, year: 1, month: 1 }`

### 3. Implement Server Actions (90 min)

**Modify:** `app/actions/tasks.js`

**Add function: `generateMonthlySummary(year, month, forceRegenerate = false)`**

Logic:
1. Authenticate user with `getSessionUser()`
2. Check for existing cached summary (unless forceRegenerate=true)
   - Query: `Summary.findOne({ owner: userId, year, month })`
   - If found, return cached summary
3. Fetch data with existing `getCompletedTasksByMonth(year, month)`
4. Also fetch completed notes: Add query filter `is_note: true, is_completed: true`
5. Format data with helper function `formatTasksForAI(tasks, notes)`:
   - Separate tasks and notes
   - Group by date
   - Format as markdown with dates and day of week
6. Call Claude API:
   - Model: `claude-3-5-haiku-20241022`
   - Max tokens: 1500
   - Temperature: 0.7
   - System prompt: "You are analyzing a user's monthly accomplishments."
   - User prompt template:
     ```
     Completed tasks and notes from [Month Year]:

     TASKS ([count]):
     [formatted tasks grouped by date]

     NOTES ([count]):
     [formatted notes grouped by date]

     Provide a summary with:
     ## Executive Summary
     ## Key Themes & Patterns
     ## Notable Highlights
     ## Insights & Observations
     ```
7. Save to database using `Summary.findOneAndUpdate()` with upsert
8. Return object: `{ summary_text, task_count, prompt_tokens, completion_tokens, generated_at }`
9. Comprehensive error handling:
   - Missing API key → friendly error message
   - Rate limits (429) → "Try again in a few minutes"
   - Other API errors → log and return generic error
   - Wrap entire function in try/catch

**Add helper: `formatTasksForAI(tasks, notes)`**
- Group by date using `dayjs`
- Format as markdown with bullet points
- Include day of week for context

### 4. Update Reports UI (60 min)

**Modify:** `app/reports/page.jsx`

**Add state:**
```javascript
const [summary, setSummary] = useState(null)
const [summaryLoading, setSummaryLoading] = useState(false)
const [summaryError, setSummaryError] = useState(null)
const [showSummary, setShowSummary] = useState(false)
```

**Add handler:**
```javascript
const handleGenerateSummary = async () => {
  setSummaryLoading(true)
  setSummaryError(null)
  const [year, month] = selectedMonth.split('-')
  const result = await generateMonthlySummary(parseInt(year), parseInt(month))
  if (result.error) {
    setSummaryError(result.message)
  } else {
    setSummary(result)
    setShowSummary(true)
  }
  setSummaryLoading(false)
}
```

**Add UI section** (between month selector and task list):
```jsx
<div className="card mb-4 border-primary">
  <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
    <h5 className="mb-0">AI-Generated Monthly Summary</h5>
    <button
      className="btn btn-sm btn-light"
      onClick={handleGenerateSummary}
      disabled={summaryLoading || !completedItems.length}
    >
      {summaryLoading ? 'Generating...' : summary ? 'Regenerate' : 'Generate Summary'}
    </button>
  </div>

  {summaryError && (
    <div className="alert alert-warning m-3">
      <strong>Unable to generate summary:</strong> {summaryError}
    </div>
  )}

  {summaryLoading && (
    <div className="card-body text-center">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  )}

  {summary && showSummary && (
    <div className="card-body">
      <div className="summary-content" style={{ whiteSpace: 'pre-wrap' }}>
        {summary.summary_text}
      </div>
      <hr />
      <small className="text-muted">
        Analyzed {summary.task_count} completed items • Generated {new Date(summary.generated_at).toLocaleDateString()}
      </small>
    </div>
  )}
</div>
```

**Optional:** Install `react-markdown` for better formatting: `npm install react-markdown`
- Replace `{summary.summary_text}` with `<ReactMarkdown>{summary.summary_text}</ReactMarkdown>`

### 5. Testing & Refinement (45 min)

**Test cases:**
1. Generate summary for current month with tasks
2. Verify summary cached in database (check MongoDB)
3. Reload page, click Generate again → should load from cache instantly
4. Click "Regenerate" → should create new summary
5. Test month with no tasks → should show appropriate message
6. Test month with only tasks (no notes)
7. Test month with only notes (no tasks)
8. Remove API key, verify graceful error handling
9. Test with invalid API key → should show auth error
10. Test as different user → summaries isolated per user

**Cost tracking during testing:**
- Add console.log in server action to monitor token usage
- Calculate cost: `(prompt_tokens * 0.001 + completion_tokens * 0.005) / 1000`

## Critical Files to Modify

1. **`models/Summary.js`** [CREATE] - Database model for caching summaries
2. **`app/actions/tasks.js`** [MODIFY] - Add `generateMonthlySummary()` and `formatTasksForAI()`
3. **`app/reports/page.jsx`** [MODIFY] - Add AI summary UI section with state management
4. **`.env.local`** [MODIFY] - Add `ANTHROPIC_API_KEY` environment variable
5. **`package.json`** [MODIFY] - Add `@anthropic-ai/sdk` dependency

## Database Changes

**New collection:** `summaries`
- Stores AI-generated summaries
- Compound unique index: `{ owner, year, month }`
- No migration needed (auto-creates on first use)

After deployment, manually create index in MongoDB:
```javascript
db.summaries.createIndex({ owner: 1, year: 1, month: 1 }, { unique: true })
```

## Cost Estimates

**Per summary:**
- Input: ~800-1200 tokens (formatted tasks + prompt)
- Output: ~500-800 tokens (summary)
- **Cost: $0.012-0.025 per summary**

**Monthly scenarios:**
- Single user, 1 summary/month: $0.02/month
- 10 users, 2 summaries/month: $0.40/month
- 100 users, 3 summaries/month: $7.50/month

**Caching benefit:**
- Without caching: Regenerating same month = additional cost
- With caching: Regenerating same month = $0 (loads from database)

## Error Handling Strategy

1. **Missing API key:** Show message "AI summary feature not configured"
2. **Rate limits (429):** Show "Rate limit exceeded, try again in a few minutes"
3. **Auth errors (401):** Show "API authentication failed, contact administrator"
4. **Network errors:** Show "Failed to generate summary, try again later"
5. **No tasks found:** Show friendly message "No completed tasks this month to summarize"
6. **All errors logged** to console with context for debugging

## Verification Steps

**Manual testing checklist:**

1. Start dev server: `npm run dev`
2. Navigate to Reports page: http://localhost:3000/reports
3. Select a month with completed tasks
4. Click "Generate AI Summary" button
5. Verify loading spinner appears
6. Verify summary appears with markdown formatting
7. Check MongoDB for new document in `summaries` collection
8. Click "Regenerate" → should create new summary
9. Refresh page, click Generate → should load cached version instantly
10. Check browser console for cost logs: prompt/completion tokens
11. Test empty month (no tasks) → verify appropriate message
12. Verify summary includes both tasks and notes
13. Test error case: temporarily set invalid API key → verify error message
14. Log in as different user → verify summaries are user-specific

**Database verification:**
```javascript
// In MongoDB shell or Compass
db.summaries.find({}).pretty()
// Should show documents with owner, year, month, summary_text
```

**Cost monitoring:**
```javascript
// In server action console output
Summary generated for 2026-01:
- Tasks: 45
- Prompt tokens: 1024
- Completion tokens: 687
- Estimated cost: $0.0044
```

## Future Enhancements (Not in MVP)

- Month-to-month comparison ("Compare to last month")
- Export summary as markdown file
- Email monthly summaries automatically
- Custom prompts/questions ("What were my main focus areas?")
- Summary style options (brief/detailed/motivational)

## Estimated Implementation Time

**Total: 3-4 hours**
- Setup: 15 min
- Backend (model + server action): 90 min
- UI integration: 60 min
- Testing & refinement: 45 min
