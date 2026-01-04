---
name: pr-create
description: Creates or updates pull requests by analyzing code changes, creating branches, committing, pushing, and managing PRs with the project template. Use when creating a new PR, updating an existing PR, opening a PR, editing PR details, or preparing code for review. (project)
---

# PR Management Skill

Create and update pull requests with automated analysis, conventional commits, and project-aware checks.

## Quick Start

```bash
# Check if PR exists for current branch
gh pr view 2>/dev/null && echo "PR exists - will update" || echo "No PR - will create"

# View current changes
git status && git diff --stat
```

## Instructions

### Step 1: Determine Workflow

First, check if a PR already exists:

```bash
gh pr view
```

- **No PR exists**: Follow "Creating a New PR" workflow
- **PR exists**: Follow "Updating an Existing PR" workflow

---

## Creating a New PR

### Step 2: Analyze Changes

Run these commands in parallel to understand the current state:

```bash
# Current status
git status

# All changes (staged + unstaged)
git diff HEAD

# Recent commits on this branch
git log --oneline -10

# Identify affected Nx projects
yarn nx affected --base=origin/development --head=HEAD --plain
```

**Identify from the output:**
- Files modified, added, or deleted
- Purpose and scope of changes
- Affected projects: `backend`, `storefront`, `core-api`, `admin-dashboard`, `shared-types`

### Step 3: Determine Change Type

Classify using conventional commit types:

| Type | Description |
|------|-------------|
| `feat` | New feature (non-breaking) |
| `fix` | Bug fix |
| `refactor` | Code restructuring (no functional changes) |
| `docs` | Documentation updates |
| `ci` | CI/CD or tooling changes |
| `chore` | Maintenance tasks |
| `test` | Adding or updating tests |
| `breaking` | Changes that break existing functionality |

### Step 4: Create Feature Branch (if needed)

If on `development` or `main`, create a feature branch:

```bash
# Branch naming: <type>/<short-description>
git checkout -b feat/add-product-search
git checkout -b fix/cart-total-calculation
git checkout -b refactor/user-service-cleanup
```

### Step 5: Run Pre-PR Checks

Run checks on affected projects before committing:

```bash
# Lint affected projects
yarn nx affected --target=lint --base=origin/development --head=HEAD

# Type check affected projects
yarn nx affected --target=type-check --base=origin/development --head=HEAD

# Run tests on affected projects
yarn nx affected --target=test --base=origin/development --head=HEAD
```

Fix any issues before proceeding.

### Step 6: Stage and Commit

```bash
# Stage changes
git add <files>
# or
git add .

# Commit with conventional format
git commit -m "<type>(<scope>): <description>"
```

**Commit message guidelines:**
- Use imperative mood: "add feature" not "added feature"
- Keep subject under 72 characters
- Optional scope: `feat(storefront): add product filtering`
- Reference issues: `fix(backend): resolve cart error (#123)`

For multiple logical changes, create separate commits.

### Step 7: Push to Remote

```bash
git push -u origin <branch-name>
```

### Step 8: Create Pull Request

Use this command with the filled template:

```bash
gh pr create --title "<type>(<scope>): <description>" --body "$(cat <<'EOF'
## Description

<!-- Write 1-2 sentences summarizing the changes -->

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

<!-- Link issues: Fixes #123, Closes #456 -->

## Screenshots (if applicable)

<!-- Add screenshots for UI changes -->
EOF
)"
```

### Step 9: Fill the Template

When creating the PR body:

1. **Description**: Summarize the "why" behind the changes
2. **Type of Change**: Check boxes matching Step 3 classification
3. **Affected Projects**: Check based on file paths:
   - `apps/backend/` → backend
   - `apps/storefront/` → storefront
   - `apps/core-api/` → core-api
   - `apps/admin-dashboard/` → admin-dashboard
   - Other → Root/workspace
4. **Testing**: Mark what was performed
5. **Checklist**: Verify each item
6. **Related Issues**: Link GitHub issues

---

## Updating an Existing PR

### Step 1: Check PR Status

```bash
# View PR details
gh pr view

# Check CI status
gh pr checks
```

### Step 2: Analyze New Changes

```bash
# Changes since last push
git diff origin/<branch-name>

# Commits to be pushed
git log origin/<branch-name>..HEAD --oneline
```

### Step 3: Run Pre-Push Checks

```bash
yarn nx affected --target=lint --base=origin/development
yarn nx affected --target=type-check --base=origin/development
yarn nx affected --target=test --base=origin/development
```

### Step 4: Push Updates

```bash
git add <files>
git commit -m "<type>(<scope>): <description>"
git push
```

### Step 5: Update PR Details (if needed)

```bash
# Update title
gh pr edit --title "<new-title>"

# Update description
gh pr edit --body "$(cat <<'EOF'
## Description
[Updated description with new changes]

## Type of Change
[Updated checkboxes]

...rest of template...
EOF
)"

# Add comment explaining updates
gh pr comment --body "Updated PR:
- Fixed review feedback on authentication
- Added missing tests
- Updated documentation"
```

### Step 6: Manage PR State

```bash
# Convert draft to ready
gh pr ready

# Mark as draft again
gh pr ready --undo

# Request re-review
gh pr edit --add-reviewer @username
```

---

## Examples

### Creating a Feature PR

```bash
# 1. Analyze
git status
git diff HEAD
yarn nx affected --base=origin/development --plain

# 2. Create branch
git checkout -b feat/add-product-filtering

# 3. Run checks
yarn nx affected --target=lint --base=origin/development
yarn nx affected --target=type-check --base=origin/development

# 4. Commit
git add apps/storefront/src/modules/products/
git commit -m "feat(storefront): add product filtering by category"

# 5. Push
git push -u origin feat/add-product-filtering

# 6. Create PR
gh pr create --title "feat(storefront): add product filtering by category" \
  --body "## Description
Adds category-based filtering to the product listing page.

## Type of Change
- [x] New feature (non-breaking change that adds functionality)

## Affected Projects
- [x] \`storefront\` (Next.js)

## Testing
- [x] Manual testing performed

## Checklist
- [x] Code follows project conventions
- [x] Linting passes
- [x] Type checking passes"
```

### Updating After Review Feedback

```bash
# 1. Make fixes
git add .
git commit -m "fix(storefront): address review feedback on filtering"

# 2. Run checks
yarn nx affected --target=lint --base=origin/development

# 3. Push
git push

# 4. Comment
gh pr comment --body "Addressed review feedback:
- Fixed filter state reset issue
- Added loading indicator"
```

---

## Best Practices

- **Run checks before pushing**: Use `yarn nx affected` to catch issues early
- **Use scoped commits**: `feat(storefront):` helps identify affected areas
- **One PR, one purpose**: Keep PRs focused and reviewable
- **Draft PRs for WIP**: Use `gh pr create --draft` for incomplete work
- **Document breaking changes**: Include migration steps in description
- **Link issues**: Always reference related GitHub issues

## Validation Checklist

Before finalizing the PR:

- [ ] Branch name follows `<type>/<description>` convention
- [ ] All commits use conventional commit format
- [ ] `yarn nx affected --target=lint` passes
- [ ] `yarn nx affected --target=type-check` passes
- [ ] `yarn nx affected --target=test` passes
- [ ] PR title matches main commit message
- [ ] Description explains the "why"
- [ ] Correct checkboxes selected in template
- [ ] Related issues are linked
