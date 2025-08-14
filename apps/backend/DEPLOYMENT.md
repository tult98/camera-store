# Railway Deployment Guide

## Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **GitHub Repository**: Ensure your code is pushed to GitHub
3. **Node.js**: Backend requires Node.js >=20

## Deployment Steps

### 1. Create Railway Project

1. Go to [railway.app](https://railway.app) and click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your camera-store repository
4. Select the `apps/backend` folder as the root directory

### 2. Add PostgreSQL Database

1. In your Railway project dashboard, click "New Service"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically create a PostgreSQL instance
4. The `DATABASE_URL` environment variable will be auto-configured

### 3. Configure Environment Variables

Railway will automatically configure these variables from `railway.toml`:
- `DATABASE_URL` (from PostgreSQL addon)
- `JWT_SECRET` (auto-generated)
- `COOKIE_SECRET` (auto-generated)
- `NODE_ENV=production`
- `PORT=9000`

**Manual Configuration Required:**
Set these in Railway's Environment Variables tab:

```
STORE_CORS=https://your-frontend-domain.vercel.app
ADMIN_CORS=https://your-admin-domain.com  
AUTH_CORS=https://your-frontend-domain.vercel.app
```

**Migration Control:**
```
RUN_MIGRATIONS=true
```
Set this to `true` to run database migrations during deployment. If not set, migrations will be skipped.

### 4. Deploy

1. Click "Deploy" in Railway dashboard
2. Monitor the build logs
3. Once deployed, Railway will provide your backend URL (e.g., `https://your-app.railway.app`)

### 5. Verify Deployment

Test these endpoints:
- `GET https://your-app.railway.app/health` - Health check
- `GET https://your-app.railway.app/admin` - Admin dashboard
- `GET https://your-app.railway.app/store/products` - Store API

### 6. Update Frontend Configuration

Update your frontend's `.env.local`:
```
MEDUSA_BACKEND_URL=https://your-app.railway.app
```

## Post-Deployment

### Database Management

**Run Migrations:**
```bash
# In Railway console or via Railway CLI
npx medusa db:migrate
```

**Seed Database (one-time):**
```bash
# In Railway console or via Railway CLI  
yarn seed
```

### Monitoring

- **Logs**: Available in Railway dashboard
- **Metrics**: CPU, memory, and network usage
- **Health Check**: Configured at `/health` endpoint

### Custom Domain (Optional)

1. In Railway project settings, go to "Domains"
2. Add your custom domain
3. Configure DNS records as instructed
4. Update CORS settings with your custom domain

## Troubleshooting

### Common Issues

**Database Connection Errors:**
- Verify `DATABASE_URL` is set correctly
- Check PostgreSQL service is running
- Ensure migrations have been run

**CORS Errors:**
- Update `STORE_CORS`, `ADMIN_CORS`, `AUTH_CORS` with your frontend domains
- Use comma-separated values for multiple domains

**Build Failures:**
- Check Node.js version (must be >=20)
- Verify all dependencies are in `package.json`
- Review build logs in Railway dashboard

**Environment Variables:**
- Use Railway's environment variables tab
- Secrets are automatically generated on first deployment
- Restart deployment after changing environment variables

### Support

- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **MedusaJS Docs**: [docs.medusajs.com](https://docs.medusajs.com)
- **Railway Discord**: Available through Railway dashboard

## Free Tier Limits

**Railway Free Tier:**
- $5/month usage credit
- 512MB RAM
- Shared CPU
- 1GB disk space
- Good for development and small projects

Monitor usage in Railway dashboard to stay within limits.