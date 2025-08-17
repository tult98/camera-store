# Railway Deployment with GitHub Actions

This guide explains how to deploy the Camera Store application (MedusaJS backend + Next.js frontend) to Railway using GitHub Actions CI/CD.

## Overview

The deployment system uses:
- **GitHub Actions** for CI/CD automation
- **Railway** for cloud hosting
- **Nx** for monorepo management and affected detection
- **Automated** database migrations
- **Preview environments** for pull requests

## Architecture

```
GitHub Repository
    ├── .github/workflows/
    │   └── deploy.yml              # Main deployment workflow
    ├── .github/actions/
    │   └── install-dependencies/   # Shared dependency installation with caching
    ├── backend/                    # MedusaJS backend (or apps/backend)
    └── frontend/                   # Next.js frontend (or apps/frontend)
```

## Prerequisites

### 1. Railway Setup

1. Create a Railway account and project
2. Create separate services for:
   - **Backend** (MedusaJS API)
   - **Frontend** (Next.js storefront)
   - **Database** (PostgreSQL)

3. Configure service settings:
   - Configure root directories as needed for your project structure
   - Enable auto-deployments from GitHub (optional)

### 2. Environment Configuration

#### Production Environment Variables

**Backend Service:**
```env
NODE_ENV=production
PORT=9000
RUN_MIGRATIONS=true
DATABASE_URL=postgresql://... (auto-provided by Railway)
JWT_SECRET=your-secure-jwt-secret
COOKIE_SECRET=your-secure-cookie-secret
STORE_CORS=https://your-frontend-domain.com
ADMIN_CORS=https://your-admin-domain.com
AUTH_CORS=https://your-frontend-domain.com
```

**Frontend Service:**
```env
NODE_ENV=production
MEDUSA_BACKEND_URL=https://your-backend-domain.railway.app
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_your_publishable_key
NEXT_PUBLIC_BASE_URL=https://your-frontend-domain.com
NEXT_PUBLIC_DEFAULT_REGION=us
NEXT_PUBLIC_STRIPE_KEY=pk_test_your_stripe_key
REVALIDATE_SECRET=your-revalidation-secret
```

#### Staging Environment Variables

Use the same variables as production but with staging-specific values and domains.

### 3. GitHub Repository Setup

#### Required Secrets

Add these secrets to your GitHub repository (`Settings > Secrets and variables > Actions`):

**Repository Secrets:**
```
RAILWAY_TOKEN                    # Railway API token for deployments
DATABASE_URL                     # PostgreSQL connection string for builds
MEDUSA_PUBLISHABLE_KEY          # Medusa publishable key for frontend
```

#### Required Variables

Add these variables to your GitHub repository (`Settings > Secrets and variables > Actions > Variables`):

**Repository Variables:**
```
RAILWAY_BACKEND_SERVICE_NAME     # Railway backend service name
RAILWAY_FRONTEND_SERVICE_NAME    # Railway frontend service name
```

#### GitHub Environments

Create this environment in your repository (`Settings > Environments`):

1. **staging** - Deployment environment with protection rules

## Deployment Workflows

### 1. Main Deployment (`deploy.yml`)

**Triggers:**
- Push to `main` branch → Staging deployment

**Features:**
- Nx affected detection (only deploys changed projects)
- Quality checks (ESLint and TypeScript checking)
- Conditional backend and frontend deployment
- Deployment status reporting

**Workflow:**
```
Setup & Affected Detection → Quality Checks → Deploy Backend (if affected) → Deploy Frontend (if affected) → Status Report
```

### 2. Quality Checks Job

**Features:**
- ESLint linting on affected projects
- TypeScript checking on affected projects
- Runs only when projects are affected
- Gates deployment process

### 3. Backend Deployment Job

**Features:**
- Conditional deployment based on affected detection
- Build with `yarn nx build backend`
- Deploy to Railway using `bervProject/railway-deploy@main`
- Environment variable injection

### 4. Frontend Deployment Job

**Features:**
- Conditional deployment based on affected detection
- Build with `yarn nx build frontend`
- Deploy to Railway using same deployment action
- Frontend-specific environment variables

## Usage

### Standard Development Flow

1. **Make Changes**
   - Modify backend or frontend code
   - Nx will detect affected projects automatically

2. **Commit and Push to Main**
   ```bash
   git add .
   git commit -m "your changes"
   git push origin main
   ```

3. **Automatic Deployment**
   - Deployment workflow triggered automatically
   - Quality checks run on affected projects
   - Only affected services are deployed

### Manual Deployment

Manual deployment triggers are not currently configured in the workflow. Deployments are automatically triggered on pushes to the main branch.

### Database Migrations

Database migrations are not currently configured in the deployment workflow. Manual database management is handled through Railway console or CLI as needed.

### Rollback Strategy

1. **Quick Rollback:**
   ```bash
   git revert <commit-hash>
   git push origin main
   ```

2. **Railway Console:**
   - Access Railway dashboard
   - Redeploy previous version
   - Monitor deployment status

## Monitoring and Debugging

### Deployment Logs

1. **GitHub Actions:**
   - View workflow logs in `Actions` tab
   - Check individual job outputs for setup, quality-checks, deploy-backend, deploy-frontend
   - Monitor deployment status in final status report

2. **Railway Logs:**
   ```bash
   railway logs --tail 100
   ```

3. **Health Checks:**
   - Backend: `https://your-backend.railway.app/health`
   - Frontend: `https://your-frontend.railway.app/`

### Common Issues

#### Failed Migrations
```bash
# Check migration status
railway logs --filter migration

# Manual migration
railway shell
npx medusa db:migrate
```

#### Build Failures
```bash
# Local debugging
nx run backend:build
nx run frontend:build

# Check dependencies
yarn install --frozen-lockfile
```

#### Environment Variable Issues
```bash
# List current variables
railway variables

# Update variable
railway variables set KEY=value
```

### Performance Monitoring

- **Bundle Analysis:** Automatic frontend bundle analysis
- **Response Time:** Health check response time monitoring
- **Resource Usage:** Railway dashboard metrics
- **Error Tracking:** Deployment logs and error reporting

## Security Considerations

1. **Secrets Management:**
   - Never commit secrets to repository
   - Use GitHub secrets for sensitive data
   - Rotate secrets regularly

2. **Environment Isolation:**
   - Separate databases for production/staging/preview
   - Isolated environment variables
   - Protected production environment

3. **Access Control:**
   - Limited Railway project access
   - GitHub environment protection rules
   - Review requirements for production

## Advanced Configuration

### Custom Deployment Triggers

Modify workflow triggers in `.github/workflows/deploy.yml`:

```yaml
on:
  push:
    branches: [main, develop]
    paths: 
      - 'apps/backend/**'
      - 'apps/frontend/**'
  workflow_dispatch:
    inputs:
      force_deploy:
        description: 'Force deploy all services'
        type: boolean
        default: false
```

### Custom Deployment Conditions

Modify affected detection or force deployments by editing the workflow:

```yaml
# In .github/workflows/deploy.yml
deploy-backend:
  # Uncomment to force backend deployment on every run
  # if: always() && needs.quality-checks.result == 'success'
  if: needs.setup.outputs.affected-backend == 'true' && always() && needs.quality-checks.result == 'success'
```

## Troubleshooting

### Workflow Debugging

1. **Enable Debug Logging:**
   ```yaml
   env:
     ACTIONS_STEP_DEBUG: true
     ACTIONS_RUNNER_DEBUG: true
   ```

2. **SSH into Runner:**
   ```yaml
   - name: Setup tmate session
     uses: mxschmitt/action-tmate@v3
   ```

### Railway Debugging

1. **Check Service Status:**
   ```bash
   railway status
   ```

2. **View Build Logs:**
   ```bash
   railway logs --deployment <deployment-id>
   ```

3. **Connect to Database:**
   ```bash
   railway connect postgresql
   ```

## Best Practices

1. **Code Quality:**
   - Always run quality checks before deployment
   - Fix linting and type errors
   - Maintain good test coverage

2. **Database Safety:**
   - Review migrations before deployment
   - Backup database before major changes
   - Test migrations in staging first

3. **Monitoring:**
   - Monitor deployment logs
   - Set up alerts for failed deployments
   - Regular health check monitoring

4. **Documentation:**
   - Keep deployment docs updated
   - Document environment variables
   - Maintain runbook for common issues

## Support

- **GitHub Issues:** Report deployment issues
- **Railway Discord:** Community support
- **Documentation:** Railway and GitHub Actions docs
- **Team Contact:** Internal deployment team

---

*This documentation is maintained with the deployment configuration. Please update when making changes to the deployment process.*