## UI Enhancement Implementation Guide

This document provides step-by-step instructions for applying the focus states, loading spinners, help text, and theme colors to QA Nexus.

### Enhancement 1: Focus States on Form Inputs

**Current Jira Input:**
```tsx
<input value={jiraIssueInput} onChange={e => setJiraIssueInput(e.target.value)} placeholder="Ticket ID" className="flex-1 px-4 py-2 bg-slate-50 border rounded-lg text-sm" />
```

**Enhanced Jira Input (with focus states, help text, and aria-describedby):**
```tsx
<label htmlFor="jira-ticket" className="sr-only">Jira Ticket ID</label>
<input 
  id="jira-ticket"
  value={jiraIssueInput} 
  onChange={e => setJiraIssueInput(e.target.value)} 
  placeholder="Ticket ID (e.g., AUTH-101)" 
  className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:border-transparent transition-all" 
  aria-label="Jira ticket ID" 
  aria-describedby="jira-help" 
/>
<p id="jira-help" className="text-xs text-slate-500 mt-1">💡 Enter your Jira ticket ID to pull requirements directly</p>
```

**Key Changes:**
- ✅ Add `focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2` for focus state
- ✅ Add `focus:border-transparent` to remove default browser border
- ✅ Add `transition-all` for smooth color changes
- ✅ Add `border-slate-200` for better visibility
- ✅ Add `aria-describedby="jira-help"` linking to help text
- ✅ Add `sr-only` label for screen readers

---

### Enhancement 2: Loading Spinners with Loader2

**Current Fetch Button:**
```tsx
<button onClick={handleJiraFetch} disabled={isJiraLoading} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold">
  {isJiraLoading ? '...' : 'Fetch'}
</button>
```

**Enhanced Fetch Button (with Loader2 spinner):**
```tsx
<button 
  onClick={handleJiraFetch} 
  disabled={isJiraLoading || !jiraIssueInput.trim()} 
  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 transition-all" 
  aria-busy={isJiraLoading} 
  aria-label="Fetch requirements from Jira"
>
  {isJiraLoading ? (
    <span className="inline-flex items-center gap-1">
      <Loader2 size={14} className="animate-spin" /> Syncing...
    </span>
  ) : (
    'Fetch'
  )}
</button>
```

**Key Changes:**
- ✅ Import `Loader2` from lucide-react (already imported in App.tsx)
- ✅ Replace `'...'` with `<Loader2 size={14} className="animate-spin" />`
- ✅ Add `hover:bg-indigo-700` for hover effect
- ✅ Add `disabled:bg-slate-300 disabled:cursor-not-allowed` for disabled state
- ✅ Add focus ring: `focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2`
- ✅ Add `aria-busy={isJiraLoading}` for accessibility
- ✅ Add `aria-label="Fetch requirements from Jira"`

---

### Enhancement 3: Help Text with aria-describedby

**Current Requirements Textarea:**
```tsx
<textarea 
  value={state.rawRequirements} 
  onChange={e => setState(p => ({ ...p, rawRequirements: e.target.value }))} 
  className="w-full h-40 p-4 bg-slate-50 border rounded-xl text-sm outline-none" 
  placeholder="Paste requirements..." 
/>
```

**Enhanced Requirements Textarea:**
```tsx
<label htmlFor="requirements-input" className="block text-sm font-semibold text-slate-700">Requirements</label>
<textarea 
  id="requirements-input"
  value={state.rawRequirements} 
  onChange={e => setState(p => ({ ...p, rawRequirements: e.target.value }))} 
  className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:border-transparent transition-all resize-none" 
  placeholder="Paste requirements, PRD, or user stories here..." 
  aria-label="Raw requirements input" 
  aria-describedby="requirements-help" 
/>
<div className="flex justify-between items-center mt-2">
  <p id="requirements-help" className="text-xs text-slate-500">
    💡 Include business requirements, acceptance criteria, and edge cases for best results
  </p>
  <span className="text-xs text-slate-500">{state.rawRequirements.length} characters</span>
</div>
```

**Key Changes:**
- ✅ Add `aria-describedby="requirements-help"` linking to help text
- ✅ Add help text with `id="requirements-help"`
- ✅ Add character counter showing `{state.rawRequirements.length} characters`
- ✅ Add focus ring: `focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2`
- ✅ Add `resize-none` to prevent resizing
- ✅ Add semantic label with `htmlFor="requirements-input"`

---

### Enhancement 4: Theme Colors (indigo-600, rose-600, emerald-600)

**Apply to Key Elements:**

1. **Primary Actions** → Use `bg-indigo-600 hover:bg-indigo-700`
   - Launch Pipeline button
   - Fetch button
   - All primary call-to-action buttons

2. **Error/Warning States** → Use `text-rose-600 bg-rose-50 border-rose-200`
   - Ambiguities section in Agent 1 tab
   - Failed test results (Agent 3 tab)
   - Error status badge

3. **Success States** → Use `text-emerald-600 bg-emerald-50`
   - Acceptance criteria in Agent 1 tab
   - Passing test results (Agent 3 tab)
   - Success status badge

4. **Focus Rings** → Use `focus:ring-indigo-600` for all inputs and buttons

**Example - Error State Styling:**
```tsx
{spec.ambiguities.length > 0 && (
  <div className="p-4 bg-rose-50 rounded-xl border border-rose-200">
    <h5 className="text-[10px] font-bold text-rose-700 uppercase mb-2">⚠ Ambiguities</h5>
    <ul className="text-xs space-y-1 list-inside text-rose-600">
      {spec.ambiguities.map((am, i) => <li key={i}>• {am}</li>)}
    </ul>
  </div>
)}
```

**Example - Success State Styling:**
```tsx
<div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
  <h5 className="text-[10px] font-bold text-emerald-700 uppercase mb-2">✓ Acceptance Criteria</h5>
  <ul className="text-xs space-y-1 list-disc list-inside text-emerald-600">
    {spec.acceptanceCriteria.map((ac, i) => <li key={i}>{ac}</li>)}
  </ul>
</div>
```

---

### Enhancement 5: Launch Pipeline Button with Status

**Current Button:**
```tsx
<button onClick={runWorkflow} disabled={state.status !== WorkflowStatus.IDLE || !state.rawRequirements} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 flex items-center gap-2">
  Launch Pipeline <ChevronRight size={16} />
</button>
```

**Enhanced Button (with loading spinner and status):**
```tsx
<button 
  onClick={runWorkflow} 
  disabled={state.status !== WorkflowStatus.IDLE || !state.rawRequirements.trim()} 
  className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 transition-all flex items-center gap-2" 
  aria-busy={state.status !== WorkflowStatus.IDLE} 
  aria-label="Launch multi-agent QA pipeline"
>
  {state.status !== WorkflowStatus.IDLE && <Loader2 size={16} className="animate-spin" />}
  {state.status === WorkflowStatus.IDLE ? 'Launch Pipeline' : `${state.status.replace(/_/g, ' ')}`}
  {state.status === WorkflowStatus.IDLE && <ChevronRight size={16} />}
</button>
```

**Key Changes:**
- ✅ Show `Loader2` spinner when workflow is running
- ✅ Display current status instead of "Launch Pipeline" during execution
- ✅ Hide ChevronRight when loading
- ✅ Add `aria-busy={state.status !== WorkflowStatus.IDLE}`
- ✅ Add hover effect: `hover:bg-indigo-700`

---

## Implementation Checklist

- [ ] Apply focus states to Jira input with `focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2`
- [ ] Add help text paragraph with `aria-describedby="jira-help"`
- [ ] Replace loading indicator with `<Loader2 size={14} className="animate-spin" />`
- [ ] Apply focus states to requirements textarea
- [ ] Add character counter to textarea
- [ ] Apply focus states to Launch Pipeline button
- [ ] Add loading spinner to Launch Pipeline button
- [ ] Update button status text during workflow execution
- [ ] Apply rose-600/rose-50 colors to ambiguities sections
- [ ] Apply emerald-600/emerald-50 colors to acceptance criteria
- [ ] Add hover state (`hover:bg-indigo-700`) to all primary buttons
- [ ] Add disabled state colors (`disabled:bg-slate-300`) to all buttons
- [ ] Test keyboard navigation with Tab/Shift+Tab
- [ ] Verify focus indicators are visible on all interactive elements
- [ ] Test with screen reader (NVDA/JAWS) for ARIA labels

---

## Testing Commands

After applying changes, test with:

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## References

- [Tailwind Focus States](https://tailwindcss.com/docs/focus)
- [ARIA Best Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Lucide React Icons](https://lucide.dev/)
