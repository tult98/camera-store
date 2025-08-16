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
    │   ├── deploy.yml              # Main deployment workflow
    │   ├── deploy-backend.yml      # Backend-specific deployment
    │   ├── deploy-frontend.yml     # Frontend-specific deployment
    │   ├── quality-checks.yml      # Reusable quality checks
    │   └── preview-deploy.yml      # PR preview environments
    ├── apps/backend/railway.json   # Backend Railway config
    ├── apps/frontend/railway.json  # Frontend Railway config
    └── railway.json                # Root Railway config
```

## Prerequisites

### 1. Railway Setup

1. Create a Railway account and project
2. Create separate services for:
   - **Backend** (MedusaJS API)
   - **Frontend** (Next.js storefront)
   - **Database** (PostgreSQL)

3. Configure service settings:
   - Set root directories: `apps/backend` and `apps/frontend`
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
RAILWAY_TOKEN                    # Railway project token
MEDUSA_PUBLISHABLE_KEY          # Production Medusa publishable key
MEDUSA_PUBLISHABLE_KEY_PREVIEW  # Preview/staging Medusa publishable key
STRIPE_PUBLIC_KEY               # Stripe public key
REVALIDATE_SECRET               # Next.js revalidation secret
```

#### Required Variables

Add these variables to your GitHub repository (`Settings > Secrets and variables > Actions > Variables`):

**Repository Variables:**
```
RAILWAY_BACKEND_SERVICE_PROD     # Production backend service ID
RAILWAY_BACKEND_SERVICE_STAGING  # Staging backend service ID
RAILWAY_FRONTEND_SERVICE_PROD    # Production frontend service ID
RAILWAY_FRONTEND_SERVICE_STAGING # Staging frontend service ID
```

#### GitHub Environments

Create these environments in your repository (`Settings > Environments`):

1. **production** - Protected environment requiring review
2. **staging** - Auto-deploy environment
3. **preview** - For PR preview deployments

## Deployment Workflows

### 1. Main Deployment (`deploy.yml`)

**Triggers:**
- Push to `main` branch → Production deployment
- Pull request to `main` → Staging deployment

**Features:**
- Nx affected detection (only deploys changed services)
- Quality checks (linting, type checking, tests)
- Parallel backend and frontend deployment
- Deployment status reporting

**Workflow:**
```
Setup → Quality Checks → Deploy Backend → Deploy Frontend → Status Report
```

### 2. Preview Deployments (`preview-deploy.yml`)

**Triggers:**
- Pull request opened/updated → Create/update preview
- Pull request closed → Cleanup preview

**Features:**
- Automatic preview environment creation
- PR comment with preview URLs
- Automatic cleanup on PR close
- Isolated preview databases

### 3. Backend Deployment (`deploy-backend.yml`)

**Features:**
- Database migration support
- Health check validation
- Post-deployment verification
- Migration status monitoring

### 4. Frontend Deployment (`deploy-frontend.yml`)

**Features:**
- Environment-specific builds
- Bundle size analysis
- Performance monitoring
- Health check validation

### 5. Quality Checks (`quality-checks.yml`)

**Features:**
- ESLint linting
- TypeScript checking
- Unit testing
- Security audits
- Dependency validation

## Usage

### Standard Development Flow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Make Changes**
   - Modify backend or frontend code
   - Nx will detect affected projects automatically

3. **Create Pull Request**
   - Quality checks run automatically
   - Preview environment created if services affected
   - Review preview URLs in PR comments

4. **Merge to Main**
   - Production deployment triggered
   - Only affected services deployed
   - Migration runs automatically if backend changed

### Manual Deployment

You can trigger deployments manually using GitHub Actions:

1. Go to `Actions` tab in GitHub
2. Select workflow (e.g., "Deploy to Railway")
3. Click "Run workflow"
4. Choose branch and options

### Database Migrations

Migrations run automatically when:
- Backend code changes are deployed
- `RUN_MIGRATIONS=true` environment variable is set

To skip migrations:
- Set `RUN_MIGRATIONS=false` in Railway environment
- Or modify the workflow input

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
   - Check individual job outputs
   - Monitor deployment status

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

### Multi-Region Deployment

Update `railway.json` for multiple regions:

```json
{
  "regions": ["us-west1", "eu-west1"],
  "deploy": {
    "strategy": "blue-green"
  }
}
```

### Custom Build Commands

Modify build commands in Railway configuration:

```json
{
  "build": {
    "buildCommand": "yarn install && nx run-many --target=build --projects=backend,frontend"
  }
}
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