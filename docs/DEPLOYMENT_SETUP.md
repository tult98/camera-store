# Quick Deployment Setup Guide

This guide helps you set up Railway deployment with GitHub Actions for the Camera Store project.

## 🚀 Quick Start Checklist

### 1. Railway Project Setup

- [ ] Create Railway project
- [ ] Create backend service (root: `apps/backend`)
- [ ] Create frontend service (root: `apps/frontend`)
- [ ] Add PostgreSQL database
- [ ] Note down service IDs

### 2. GitHub Repository Configuration

#### Secrets (Settings > Secrets and variables > Actions > Secrets)
```
RAILWAY_TOKEN=rwy_xxx...
MEDUSA_PUBLISHABLE_KEY=pk_xxx...
MEDUSA_PUBLISHABLE_KEY_PREVIEW=pk_staging_xxx...
STRIPE_PUBLIC_KEY=pk_test_xxx...
REVALIDATE_SECRET=supersecret123
```

#### Variables (Settings > Secrets and variables > Actions > Variables)
```
RAILWAY_BACKEND_SERVICE_PROD=backend-service-id
RAILWAY_BACKEND_SERVICE_STAGING=backend-staging-id
RAILWAY_FRONTEND_SERVICE_PROD=frontend-service-id
RAILWAY_FRONTEND_SERVICE_STAGING=frontend-staging-id
```

#### Environments (Settings > Environments)
- [ ] `production` (with protection rules)
- [ ] `staging`
- [ ] `preview`

### 3. Railway Service Configuration

#### Backend Service Environment Variables
```env
NODE_ENV=production
PORT=9000
RUN_MIGRATIONS=true
JWT_SECRET=your-jwt-secret
COOKIE_SECRET=your-cookie-secret
STORE_CORS=https://your-frontend-url.com
ADMIN_CORS=https://your-admin-url.com
AUTH_CORS=https://your-frontend-url.com
```

#### Frontend Service Environment Variables
```env
NODE_ENV=production
MEDUSA_BACKEND_URL=https://your-backend-url.railway.app
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_your_key
NEXT_PUBLIC_BASE_URL=https://your-frontend-url.com
NEXT_PUBLIC_DEFAULT_REGION=us
NEXT_PUBLIC_STRIPE_KEY=pk_test_your_stripe_key
REVALIDATE_SECRET=your-revalidation-secret
```

## 🛠️ Getting Railway Service IDs

### Method 1: Railway CLI
```bash
npm install -g @railway/cli
railway login
railway list
```

### Method 2: Railway Dashboard
1. Go to Railway dashboard
2. Select your project
3. Click on service
4. Copy service ID from URL: `railway.app/project/{project-id}/service/{service-id}`

## 🔑 Getting Railway Token

1. Go to [Railway Account Settings](https://railway.app/account/tokens)
2. Create new token with project access
3. Copy token (starts with `rwy_`)
4. Add to GitHub secrets as `RAILWAY_TOKEN`

## 📋 Environment Variables Reference

### Required for Backend
- `DATABASE_URL` - Auto-provided by Railway PostgreSQL
- `JWT_SECRET` - Generate secure random string
- `COOKIE_SECRET` - Generate secure random string
- `STORE_CORS` - Frontend domain(s)
- `ADMIN_CORS` - Admin domain(s)
- `AUTH_CORS` - Frontend domain(s)

### Required for Frontend  
- `MEDUSA_BACKEND_URL` - Backend service URL
- `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` - From Medusa admin
- `NEXT_PUBLIC_BASE_URL` - Frontend domain
- `NEXT_PUBLIC_STRIPE_KEY` - Stripe publishable key

### Optional
- `NEXT_PUBLIC_DEFAULT_REGION` - Default to 'us'
- `REVALIDATE_SECRET` - For Next.js revalidation
- `RUN_MIGRATIONS` - Set to 'true' for auto-migrations

## 🧪 Testing the Setup

### 1. Test Workflow Trigger
```bash
git checkout -b test-deployment
echo "# Test" >> README.md
git add README.md
git commit -m "test: deployment workflow"
git push origin test-deployment
```

### 2. Create Pull Request
- GitHub Actions should run quality checks
- Preview deployment should be created (if applicable)
- Check PR comments for preview URLs

### 3. Merge to Main
- Production deployment should trigger
- Monitor workflow in GitHub Actions
- Verify services are accessible

## 🔍 Verification Steps

### Backend Health Check
```bash
curl https://your-backend-url.railway.app/health
```

### Frontend Accessibility
```bash
curl https://your-frontend-url.railway.app/
```

### Database Connection
```bash
# Via Railway CLI
railway connect postgresql
```

## 🐛 Common Issues & Solutions

### Issue: "Project Token not found"
**Solution:** Verify `RAILWAY_TOKEN` in GitHub secrets

### Issue: Build fails with dependency errors
**Solution:** 
```bash
# Local test
yarn install --frozen-lockfile
nx run backend:build
nx run frontend:build
```

### Issue: Migration fails
**Solution:** Check database permissions and connection
```bash
railway logs --filter migration
```

### Issue: CORS errors in frontend
**Solution:** Update `STORE_CORS` in backend environment variables

### Issue: Preview deployment not created
**Solution:** 
- Verify affected detection in workflow logs
- Check if changes are in `apps/backend` or `apps/frontend`

## 📚 Additional Resources

- [Full Deployment Guide](./DEPLOYMENT.md)
- [Railway Documentation](https://docs.railway.app/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Nx Documentation](https://nx.dev/concepts/affected)

## 🆘 Support

If you encounter issues:
1. Check workflow logs in GitHub Actions
2. Review Railway service logs
3. Verify all environment variables are set
4. Consult the full deployment documentation

---

*Setup complete? Create a test PR to verify everything works!*