---
name: pr-create
description: Creates or updates pull requests by analyzing code changes, creating branches, committing, pushing, and managing PRs with the project template. Use when creating a new PR, updating an existing PR, opening a PR, editing PR details, or preparing code for review.
---

# PR Management Skill

## Overview

This skill handles both creating new pull requests and updating existing ones, guiding you through the complete workflow from code analysis to PR submission.

## Workflow Selection

First, determine if you're creating a new PR or updating an existing one:

```bash
# Check if current branch has an associated PR
gh pr view
```

- If no PR exists: Follow **Creating a New PR** workflow
- If PR exists: Follow **Updating an Existing PR** workflow

---

## Creating a New PR

### Step 1: Analyze Current Changes

First, examine the current state of the repository:

```bash
# Check current branch and status
git status

# View all changes (staged and unstaged)
git diff HEAD

# View recent commits if on a feature branch
git log --oneline -10
```

Identify:
- What files have been modified, added, or deleted
- The purpose and scope of the changes
- Which project(s) are affected (backend, storefront, core-api, admin-dashboard, shared-types)

### Step 2: Determine Change Type

Classify the changes into one of these categories:
- **feat**: New feature (non-breaking)
- **fix**: Bug fix
- **refactor**: Code restructuring (no functional changes)
- **docs**: Documentation updates
- **ci**: CI/CD or tooling changes
- **chore**: Maintenance tasks
- **test**: Adding or updating tests
- **breaking**: Changes that break existing functionality

### Step 3: Create Feature Branch

If not already on a feature branch, create one:

```bash
# Branch naming convention: <type>/<short-description>
# Examples:
#   feat/add-product-search
#   fix/cart-total-calculation
#   refactor/user-service-cleanup

git checkout -b <type>/<short-description>
```

### Step 4: Create Commits

Stage and commit changes with conventional commit messages:

```bash
# Stage specific files or all changes
git add <files>
# or
git add .

# Commit with conventional format
git commit -m "<type>: <description>"
```

**Commit message format:**
- Use imperative mood: "add feature" not "added feature"
- Keep subject line under 72 characters
- Reference issues when applicable: "fix: resolve cart error (#123)"

For multiple logical changes, create separate commits for each.

### Step 5: Push to Remote

```bash
git push -u origin <branch-name>
```

### Step 6: Create Pull Request

Use the GitHub CLI to create the PR with the project template:

```bash
gh pr create --title "<type>: <description>" --body "$(cat <<'EOF'
## Description

<!-- Summary of what this PR does -->

## Type of Change

- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to change)
- [ ] Refactoring (no functional changes)
- [ ] Documentation update
- [ ] CI/CD or tooling changes

## Affected Projects

- [ ] `backend` (MedusaJS)
- [ ] `storefront` (Next.js)
- [ ] `core-api` (NestJS)
- [ ] `admin-dashboard`
- [ ] `shared-types`
- [ ] Root/workspace configuration

## Testing

- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing performed

## Checklist

- [ ] Code follows project conventions (see CLAUDE.md)
- [ ] Self-review completed
- [ ] No `any` types introduced
- [ ] No console.log statements left in code
- [ ] Linting passes (`yarn lint`)
- [ ] Type checking passes (`yarn type-check`)
- [ ] Tests pass (`yarn test`)

## Related Issues

<!-- Link any related issues: Fixes #123, Closes #456 -->

## Screenshots (if applicable)

<!-- Add screenshots for UI changes -->
EOF
)"
```

## Filling the PR Template

When creating the PR body:

1. **Description**: Write a concise summary of the changes and their purpose
2. **Type of Change**: Check the appropriate box(es) based on Step 2 analysis
3. **Affected Projects**: Check projects where files were modified
4. **Testing**: Mark what testing was performed
5. **Checklist**: Verify each item before submitting
6. **Related Issues**: Link any GitHub issues this PR addresses
7. **Screenshots**: Include for any UI changes

## Example

```bash
# 1. Check current state
git status
git diff HEAD

# 2. Create branch (if needed)
git checkout -b feat/add-product-filtering

# 3. Stage and commit
git add apps/storefront/src/modules/products/
git commit -m "feat: add product filtering by category"

# 4. Push
git push -u origin feat/add-product-filtering

# 5. Create PR
gh pr create --title "feat: add product filtering by category" --body "..."
```

---

## Updating an Existing PR

### Step 1: Check PR Status

```bash
# View current PR details
gh pr view

# Check PR number and status
gh pr status
```

### Step 2: Analyze New Changes

```bash
# View changes since last push
git diff origin/<branch-name>

# Check what commits will be pushed
git log origin/<branch-name>..HEAD
```

### Step 3: Push Additional Commits

```bash
# Stage and commit new changes
git add <files>
git commit -m "<type>: <description>"

# Push to update the PR
git push
```

### Step 4: Update PR Details (if needed)

Update the PR title:
```bash
gh pr edit --title "<new-title>"
```

Update the PR description:
```bash
gh pr edit --body "$(cat <<'EOF'
## Description

[Updated description]

## Type of Change
[Check appropriate boxes]

## Affected Projects
[Check affected projects]

## Testing
[Mark completed tests]

## Checklist
[Update checklist]

## Related Issues
[Update issue links]

## Screenshots (if applicable)
[Add new screenshots]
EOF
)"
```

Add a comment to explain the updates:
```bash
gh pr comment --body "Updated to address review feedback:
- Fixed the authentication bug
- Added missing tests
- Updated documentation"
```

### Step 5: Request Re-review (if needed)

```bash
# Request review from specific reviewers
gh pr edit --add-reviewer @reviewer-username
```

### Common Update Scenarios

**Adding fixes from review feedback:**
```bash
git add .
git commit -m "fix: address review feedback on authentication"
git push
gh pr comment --body "Addressed review comments"
```

**Updating PR description:**
```bash
gh pr edit --body "$(cat .github/PULL_REQUEST_TEMPLATE.md)"
# Then fill in the template manually or via editor
```

**Converting draft to ready:**
```bash
gh pr ready
```

**Marking as draft again:**
```bash
gh pr ready --undo
```

---

## Notes

- For breaking changes, clearly document migration steps in the description
- Use draft PRs (`gh pr create --draft`) for work-in-progress
- When updating PRs, add comments to explain significant changes
- Always push commits before updating PR metadata
