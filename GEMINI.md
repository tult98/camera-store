# GEMINI.md: AI-Powered Project Context

This document provides essential context for the Gemini AI assistant to understand and effectively assist with this project.

## 1. Project Overview

This is a full-stack e-commerce application for a camera store, built as a monorepo using **Nx**.

- **Frontend (`apps/frontend`):** A **Next.js 15** application using React 19, TypeScript, Tailwind CSS, and daisyUI. It serves as the customer-facing storefront.
- **Backend (`apps/backend`):** A headless e-commerce server powered by **MedusaJS v2**. It uses TypeScript and connects to a PostgreSQL database.

The project is configured for CI/CD with **GitHub Actions**, deploying to **Railway** using **Nixpacks** for builds.

## 2. Building and Running

The primary commands are defined in the root `package.json` and orchestrated by Nx.

### Prerequisites

- Node.js >= 20
- Yarn
- PostgreSQL database

### Initial Setup

1.  Install dependencies:
    ```bash
    yarn install
    ```
2.  Set up environment variables by creating `.env` files in `apps/backend` and `apps/frontend` (refer to `README.md` for required variables).

### Development

To run both the frontend (http://localhost:8000) and backend (http://localhost:9000) servers in parallel:

```bash
yarn dev
```

To run them individually:

```bash
nx serve frontend
nx serve backend
```

### Building for Production

To build both applications:

```bash
yarn build
```

Or individually:

```bash
nx build frontend
nx build backend
```

### Testing

To run all tests across the workspace:

```bash
yarn test
```

To run tests for a specific application:

```bash
nx test frontend
nx test backend
```

## 3. Development Conventions

- **Monorepo Management:** Nx is the single source of truth for running tasks (`serve`, `build`, `lint`, `test`) and understanding the dependency graph between projects. Use `nx <command> <project>` for all operations.
- **Code Style:** Code quality is maintained with ESLint and Prettier. Use `nx lint <project>` to check for issues.
- **State Management:** The frontend prioritizes React Server Components (RSC) for data fetching. Client-side state is managed with React hooks and context.
- **Component Structure:** The frontend follows a modular approach, with components organized by feature under `src/modules`. Shared components are in `src/modules/common`.
- **Backend Architecture:** The MedusaJS backend is highly customized with custom API routes, admin extensions, workflows, and services. Follow the patterns established in `apps/backend/src/`.
- **Product Requirements:** New features are specified in detail in Product Requirement Documents (PRDs) located in the `docs/` directory. See `docs/PRD-Category-Page-Redesign-V2.md` for an example.
