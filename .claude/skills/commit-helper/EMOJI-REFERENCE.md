# Emoji Reference for Conventional Commits

This reference provides a comprehensive mapping of emojis to commit types and contexts.

## Primary Commit Types

| Emoji | Type | Description | Example |
|-------|------|-------------|---------|
| ✨ | `feat` | New feature | ✨ feat: add user authentication system |
| 🐛 | `fix` | Bug fix | 🐛 fix: resolve memory leak in rendering process |
| 📝 | `docs` | Documentation changes | 📝 docs: update API documentation with new endpoints |
| 💄 | `style` | Formatting/code style | 💄 style: format code with prettier |
| ♻️ | `refactor` | Code refactoring | ♻️ refactor: simplify error handling logic |
| ⚡️ | `perf` | Performance improvements | ⚡️ perf: optimize database queries |
| ✅ | `test` | Adding/fixing tests | ✅ test: add unit tests for auth module |
| 🔧 | `chore` | Build tools, config, dependencies | 🔧 chore: update webpack configuration |
| 🚀 | `ci` | CI/CD improvements | 🚀 ci: add GitHub Actions workflow |
| 🗑️ | `revert` | Reverting changes | 🗑️ revert: undo breaking auth changes |

## Context-Specific Emojis

### Code Quality & Warnings

| Emoji | Type | Description | Example |
|-------|------|-------------|---------|
| 🚨 | `fix` | Fix compiler/linter warnings | 🚨 fix: resolve ESLint warnings in components |
| 🎨 | `style` | Improve structure/format of code | 🎨 style: reorganize component structure |
| ⚰️ | `refactor` | Remove dead code | ⚰️ refactor: remove unused utility functions |
| 🔥 | `fix` | Remove code or files | 🔥 fix: remove deprecated API endpoints |

### Security

| Emoji | Type | Description | Example |
|-------|------|-------------|---------|
| 🔒️ | `fix` | Fix security issues | 🔒️ fix: patch XSS vulnerability in search |
| 🚑️ | `fix` | Critical hotfix | 🚑️ fix: emergency patch for auth bypass |

### Dependencies

| Emoji | Type | Description | Example |
|-------|------|-------------|---------|
| ➕ | `chore` | Add a dependency | ➕ chore: add react-query for data fetching |
| ➖ | `chore` | Remove a dependency | ➖ chore: remove unused lodash dependency |
| 📌 | `chore` | Pin dependencies to specific versions | 📌 chore: pin TypeScript to 5.6.2 |
| 📦️ | `chore` | Add or update compiled files or packages | 📦️ chore: update package-lock.json |

### Database & Data

| Emoji | Type | Description | Example |
|-------|------|-------------|---------|
| 🗃️ | `db` | Database related changes | 🗃️ db: add indexes for product search |
| 🌱 | `chore` | Add or update seed files | 🌱 chore: update product seed data |

### User Experience

| Emoji | Type | Description | Example |
|-------|------|-------------|---------|
| 🚸 | `feat` | Improve user experience/usability | 🚸 feat: add loading indicators to forms |
| 📱 | `feat` | Work on responsive design | 📱 feat: optimize layout for mobile devices |
| ♿️ | `feat` | Improve accessibility | ♿️ feat: add ARIA labels to navigation |
| 💫 | `ui` | Add or update animations and transitions | 💫 ui: add smooth transitions to modals |

### Developer Experience

| Emoji | Type | Description | Example |
|-------|------|-------------|---------|
| 🧑‍💻 | `chore` | Improve developer experience | 🧑‍💻 chore: add development setup script |
| 💡 | `docs` | Add or update comments in source code | 💡 docs: document complex algorithm logic |
| 👷 | `ci` | Add or update CI build system | 👷 ci: configure automated testing pipeline |
| 💚 | `fix` | Fix CI build | 💚 fix: resolve failing GitHub Actions build |

### Project Management

| Emoji | Type | Description | Example |
|-------|------|-------------|---------|
| 🎉 | `chore` | Begin a project | 🎉 chore: initial project setup |
| 🔖 | `chore` | Release/version tags | 🔖 chore: bump version to 2.0.0 |
| 👥 | `chore` | Add or update contributors | 👥 chore: add new team members to AUTHORS |
| 📄 | `chore` | Add or update license | 📄 chore: update license to MIT |

### File Operations

| Emoji | Type | Description | Example |
|-------|------|-------------|---------|
| 🚚 | `refactor` | Move or rename resources | 🚚 refactor: relocate components to modules/ |
| 🙈 | `chore` | Add or update .gitignore file | 🙈 chore: ignore node_modules and .env files |
| 🍱 | `assets` | Add or update assets | 🍱 assets: add product placeholder images |

### Architecture & Structure

| Emoji | Type | Description | Example |
|-------|------|-------------|---------|
| 🏗️ | `refactor` | Make architectural changes | 🏗️ refactor: migrate to hexagonal architecture |
| 🏷️ | `feat` | Add or update types | 🏷️ feat: add TypeScript type definitions |
| 🔀 | `chore` | Merge branches | 🔀 chore: merge feature/auth into main |

### Features & Functionality

| Emoji | Type | Description | Example |
|-------|------|-------------|---------|
| 👔 | `feat` | Add or update business logic | 👔 feat: implement order validation rules |
| 🧵 | `feat` | Add multithreading/concurrency code | 🧵 feat: add worker threads for image processing |
| 🔍️ | `feat` | Improve SEO | 🔍️ feat: add meta tags for product pages |
| 💬 | `feat` | Add or update text and literals | 💬 feat: update error message copy |
| 🌐 | `feat` | Internationalization and localization | 🌐 feat: add French language support |
| 📈 | `feat` | Add analytics or tracking code | 📈 feat: implement Google Analytics events |
| 🚩 | `feat` | Add, update, or remove feature flags | 🚩 feat: add feature flag for new checkout |
| 🦺 | `feat` | Add validation code | 🦺 feat: add input validation for user forms |
| ✈️ | `feat` | Improve offline support | ✈️ feat: add service worker for offline mode |

### Logging & Debugging

| Emoji | Type | Description | Example |
|-------|------|-------------|---------|
| 🔊 | `feat` | Add or update logs | 🔊 feat: add debug logging to API calls |
| 🔇 | `fix` | Remove logs | 🔇 fix: remove console.log statements |

### Testing & Experiments

| Emoji | Type | Description | Example |
|-------|------|-------------|---------|
| 🧪 | `test` | Add a failing test | 🧪 test: add failing test for bug reproduction |
| 🤡 | `test` | Mock things | 🤡 test: add mocks for external API calls |
| 📸 | `test` | Add or update snapshots | 📸 test: update component snapshots |
| ⚗️ | `experiment` | Perform experiments | ⚗️ experiment: try new state management approach |

### Breaking Changes & Special Cases

| Emoji | Type | Description | Example |
|-------|------|-------------|---------|
| 💥 | `feat` | Introduce breaking changes | 💥 feat: redesign authentication API (breaking) |
| 🩹 | `fix` | Simple fix for non-critical issue | 🩹 fix: correct typo in button label |
| 🥅 | `fix` | Catch errors | 🥅 fix: add error boundary to prevent crashes |
| 👽️ | `fix` | Update code due to external API changes | 👽️ fix: adapt to new Stripe API version |
| ✏️ | `fix` | Fix typos | ✏️ fix: correct spelling in documentation |
| ⏪️ | `revert` | Revert changes | ⏪️ revert: undo problematic refactoring |

### Work in Progress

| Emoji | Type | Description | Example |
|-------|------|-------------|---------|
| 🚧 | `wip` | Work in progress | 🚧 wip: partial implementation of payment flow |
| 🥚 | `feat` | Add or update an easter egg | 🥚 feat: add konami code easter egg |

## Selection Guidelines

### How to Choose the Right Emoji

1. **Identify the primary purpose** of your commit:
   - Is it adding something new? → `feat` (✨)
   - Is it fixing something broken? → `fix` (🐛)
   - Is it changing existing code without adding/fixing? → `refactor` (♻️)
   - Is it documentation only? → `docs` (📝)

2. **Check for specific contexts:**
   - Security issue? → 🔒️
   - Performance improvement? → ⚡️
   - Breaking change? → 💥
   - Accessibility? → ♿️
   - Dependencies? → ➕/➖

3. **Consider the impact:**
   - Critical/urgent? → 🚑️
   - Minor/trivial? → 🩹
   - Architectural? → 🏗️

4. **Special scenarios:**
   - First commit? → 🎉
   - Reverting? → 🗑️ or ⏪️
   - CI/Build fixes? → 💚

## Examples by Category

### Feature Development
```
✨ feat: add shopping cart functionality
🏷️ feat: add TypeScript interfaces for cart items
🦺 feat: add validation for cart operations
✅ test: add cart integration tests
📝 docs: document cart API endpoints
```

### Bug Fixing
```
🐛 fix: resolve checkout calculation error
🚑️ fix: emergency patch for payment processor
🩹 fix: correct button alignment in header
🥅 fix: add error handling for network failures
✏️ fix: fix typo in success message
```

### Code Quality
```
♻️ refactor: simplify authentication logic
🎨 style: improve code formatting and structure
⚰️ refactor: remove deprecated payment methods
🔥 fix: delete unused test fixtures
🚨 fix: resolve TypeScript strict mode errors
```

### Infrastructure & Tooling
```
🔧 chore: update ESLint configuration
🚀 ci: add automated deployment pipeline
👷 ci: configure test coverage reporting
💚 fix: resolve failing CI build
📦️ chore: update dependencies
```

### User Experience
```
🚸 feat: improve form validation feedback
📱 feat: optimize mobile navigation
♿️ feat: enhance keyboard navigation
💫 ui: add smooth page transitions
🌐 feat: add Spanish translations
```

## Tips for Writing Great Commit Messages

1. **Be specific**: "fix: resolve cart total calculation error" not "fix: fix bug"
2. **Use imperative mood**: "add feature" not "added feature" or "adds feature"
3. **Keep first line under 72 characters**
4. **Add context in body** for complex changes
5. **Reference issues** when applicable: "fix: resolve #123 - cart calculation"
6. **One logical change per commit** - split unrelated changes
7. **Test before committing** - ensure code works
8. **Review the diff** - verify what you're actually committing
