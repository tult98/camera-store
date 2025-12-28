---
name: pr-create
description: Creates a pull request by analyzing code changes, creating a branch, committing, pushing, and opening a PR with the project template. Use when ready to submit code for review or merge changes.
---

# PR Create Skill

## Overview

This skill guides the complete PR creation workflow from code analysis to PR submission.

## Workflow

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
- Which project(s) are affected (backend, frontend, core-api, admin-dashboard, shared-types)

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
- [ ] `frontend` (Next.js)
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
git add apps/frontend/src/modules/products/
git commit -m "feat: add product filtering by category"

# 4. Push
git push -u origin feat/add-product-filtering

# 5. Create PR
gh pr create --title "feat: add product filtering by category" --body "..."
```

## Notes

- For breaking changes, clearly document migration steps in the description
- Use draft PRs (`gh pr create --draft`) for work-in-progress
