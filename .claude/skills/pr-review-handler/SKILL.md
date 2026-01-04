---
name: pr-review-handler
description: Fetch and analyze GitHub PR review comments, evaluate their validity, and propose solutions. Use when the user asks to handle PR reviews, address reviewer feedback, check PR comments, or respond to code review suggestions.
---

# PR Review Handler

Fetches PR review comments from GitHub, evaluates if they are valid and actionable, then proposes solutions for valid comments with user approval before applying changes.

## Quick Start

```
/pr-review-handler 123
```

Or simply ask: "Help me address the review comments on PR #123"

## Instructions

### Step 1: Fetch PR Review Comments

Use the GitHub CLI to fetch review comments for the specified PR:

```bash
# Get PR review comments
gh pr view <PR_NUMBER> --json reviews,comments

# Get detailed review comments on specific lines
gh api repos/{owner}/{repo}/pulls/<PR_NUMBER>/comments
```

Extract the following for each comment:

- Comment body/content
- File path and line number (if applicable)
- Author
- State (pending, commented, approved, changes_requested)
- Created/updated timestamp

### Step 2: Analyze Comment Validity

For each review comment, evaluate if it is **valid and actionable**:

**Valid comments typically:**

- Point out actual bugs, logic errors, or security issues
- Suggest performance improvements with clear reasoning
- Identify missing error handling or edge cases
- Request necessary code style/convention fixes
- Ask for clarification that would improve code readability
- Suggest better naming or structure improvements

**Invalid or non-actionable comments:**

- Purely stylistic preferences without project convention backing
- Already addressed in subsequent commits
- Based on misunderstanding of the code or requirements
- Requests for changes outside the PR's scope
- Nitpicks that don't improve code quality

**For each comment, determine:**

1. Is it actionable? (Can code changes address it?)
2. Is it reasonable? (Does the suggestion improve the code?)
3. Is it still relevant? (Not already addressed?)

### Step 3: Present Analysis to User

Display a summary table of all comments:

```
| # | File | Comment Summary | Valid? | Reason |
|---|------|-----------------|--------|--------|
| 1 | src/api/user.ts:45 | Add null check | ✅ Yes | Prevents runtime error |
| 2 | src/utils.ts:12 | Rename variable | ❌ No | Style preference only |
| 3 | src/auth.ts:89 | Handle timeout | ✅ Yes | Missing error handling |
```

### Step 4: Propose Solutions for Valid Comments

For each valid comment:

1. **Read the relevant code** at the specified file and line
2. **Understand the context** - what the code does and why
3. **Design a solution** that addresses the reviewer's concern
4. **Present the proposed change** to the user:

```markdown
## Comment #1: Add null check

**File:** src/api/user.ts:45
**Reviewer:** @reviewer-name
**Comment:** "This could throw if user is undefined"

### Current Code:

\`\`\`typescript
const name = user.name;
\`\`\`

### Proposed Solution:

\`\`\`typescript
const name = user?.name ?? 'Unknown';
\`\`\`

### Explanation:

Added optional chaining and nullish coalescing to handle undefined user gracefully.

**Apply this change?** [Yes / No / Modify]
```

### Step 5: Apply Approved Changes

After user approval:

1. Apply the code changes using the Edit tool
2. Run relevant linting/type-checking if configured
3. Summarize all applied changes

### Step 6: Generate Response Summary

After processing all comments, provide:

- Count of valid vs invalid comments
- List of applied changes
- Any comments that need manual attention
- Suggested reply to reviewers (if requested)

## Examples

### Example 1: Basic Usage

**User:** Help me handle the review comments on PR #42

**Claude:**

1. Fetches comments from PR #42
2. Analyzes each comment for validity
3. Presents summary table
4. For each valid comment, proposes a solution
5. Waits for user approval before applying

### Example 2: With Specific Focus

**User:** Address only the security-related comments on PR #15

**Claude:**

1. Fetches all comments from PR #15
2. Filters for security-related concerns
3. Analyzes and proposes solutions for those specifically

## Best Practices

- **Don't blindly accept all comments** - Use judgment to identify truly valuable feedback
- **Preserve code intent** - Solutions should fix issues without changing the original purpose
- **Consider the reviewer's perspective** - Understand why they raised the concern
- **Group related changes** - If multiple comments affect the same area, propose a unified solution
- **Explain your reasoning** - When marking a comment as invalid, provide clear justification

## Edge Cases

**Comment already addressed:**

- Check git diff to see if subsequent commits fixed it
- Mark as "Already resolved" with commit reference

**Conflicting comments:**

- Present both perspectives to the user
- Ask for guidance on which direction to take

**Comment requires architectural change:**

- Flag as "Requires discussion"
- Don't propose quick fixes for fundamental issues

**Comment on deleted code:**

- Mark as "No longer applicable"
- Note that the code was removed

## Commands Reference

```bash
# List PR review comments
gh pr view <NUMBER> --json reviews

# Get line-level comments
gh api repos/{owner}/{repo}/pulls/<NUMBER>/comments

# Get PR diff for context
gh pr diff <NUMBER>

# Check PR status
gh pr checks <NUMBER>
```
