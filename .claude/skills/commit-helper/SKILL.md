---
name: commit-helper
description: Create well-formatted git commits with conventional commit messages and emojis. Use when the user wants to commit changes, create a commit, save work to git, or mentions committing. Supports atomic commit strategies.
allowed-tools: Bash, Read, Grep, AskUserQuestion
---

# Commit Helper

This skill helps you create well-formatted git commits following conventional commit standards with emoji prefixes.

## Quick Start

When the user wants to commit changes:

1. Analyze all uncommitted changes (both staged and unstaged)
2. Determine if changes should be split into multiple commits
3. Generate conventional commit messages with appropriate emojis
4. Create the commit(s)

## Workflow Steps

### Step 1: Analyze Git Status and All Changes

Check the current git status to see both staged and unstaged files:

```bash
git status
```

Get the diff of ALL uncommitted changes (both staged and unstaged):

```bash
git diff HEAD
```

This shows all changes that will potentially be committed, giving a complete picture of what's changed.

If no files are staged, ask the user if they want to stage all modified files:

```bash
git add .
```

Or if they want to stage specific files, help them do so selectively.

### Step 2: Determine Commit Strategy

Analyze the diff to identify if there are multiple distinct logical changes:

**Consider splitting commits if changes involve:**

1. Different concerns (e.g., feature + documentation)
2. Different types (e.g., feature + bug fix)
3. Different file patterns (e.g., source code + configuration)
4. Multiple unrelated features
5. Very large changesets

**Keep as single commit if:**

- Changes are all related to one feature/fix
- Changes are small and focused
- Changes depend on each other

If multiple commits are recommended, explain to the user why and suggest how to split them. Help them stage and commit changes separately.

### Step 3: Generate Commit Message

Create a commit message using this format:

```
<emoji> <type>: <description>

<optional detailed description>

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Select the appropriate emoji and type:**

Refer to [EMOJI-REFERENCE.md](EMOJI-REFERENCE.md) for the complete mapping. Common ones:

- ✨ `feat`: New feature
- 🐛 `fix`: Bug fix
- 📝 `docs`: Documentation changes
- 💄 `style`: Formatting/code style
- ♻️ `refactor`: Code refactoring
- ⚡️ `perf`: Performance improvements
- ✅ `test`: Adding/fixing tests
- 🔧 `chore`: Build tools, config, dependencies
- 🚀 `ci`: CI/CD improvements
- 🚨 `fix`: Fix compiler/linter warnings
- 🔒️ `fix`: Security fixes
- 🏗️ `refactor`: Architectural changes

**Guidelines:**

- First line under 72 characters
- Present tense, imperative mood ("add feature" not "added feature")
- Be concise and clear
- Focus on "why" rather than "what" in detailed description

### Step 4: Create the Commit

Use a HEREDOC to ensure proper formatting:

```bash
git commit -m "$(cat <<'EOF'
<emoji> <type>: <description>

<optional detailed description>

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

Then verify the commit was created:

```bash
git status
```

## Best Practices

### Atomic Commits

Each commit should contain related changes that serve a single purpose:

**Good:**

- ✨ feat: add user authentication system
- 🐛 fix: resolve memory leak in rendering process
- 📝 docs: update API documentation with new endpoints

**Bad (should be split):**

- ✨ feat: add authentication, update docs, fix styling issues

### Commit Message Quality

**Concise first line:**
✅ "add OAuth2 authentication flow"
❌ "add authentication and also update the documentation and fix some bugs"

**Present tense, imperative:**
✅ "add feature"
❌ "added feature" or "adds feature"

**Focus on why, not what:**
✅ "refactor: simplify error handling logic to reduce cognitive complexity"
❌ "refactor: change code"

### Security Considerations

**Never commit sensitive data:**

- Check for .env files, credentials.json, etc.
- Warn user if attempting to commit potential secrets
- Suggest using .gitignore

## Common Scenarios

### Scenario 1: Simple Feature Addition

```bash
git status  # Check staged files
git diff --staged  # Review changes
```

Commit message:

```
✨ feat: add product search functionality

Implements full-text search across product titles
and descriptions using database indexes.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Scenario 2: Bug Fix

```
🐛 fix: resolve cart calculation rounding error

Fixes floating-point precision issues in total
calculation by using integer math (cents).

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Scenario 3: Multiple Changes (Split Required)

If diff shows:

- New API endpoint (feature)
- Updated documentation (docs)
- Fixed linter warnings (fix)

Recommend three separate commits:

1. ✨ feat: add new API endpoint
2. 📝 docs: update API documentation
3. 🚨 fix: resolve linter warnings

### Scenario 4: Breaking Changes

```
💥 feat: redesign authentication API

BREAKING CHANGE: Auth endpoints now require
API key in header instead of query parameter.

Migration guide available in docs/auth-migration.md

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

## Handling Failures

### Merge Conflicts

If there are merge conflicts:

1. Don't attempt to commit
2. Inform user: "There are merge conflicts that need to be resolved before committing"
3. Show conflicted files
4. Offer to help resolve conflicts

## Reference

For complete emoji mapping, see [EMOJI-REFERENCE.md](EMOJI-REFERENCE.md).
