# Deployment Guide

This guide covers deploying your camera store backend with database migrations.

## Quick Reference

### Environment Variables for Deployment

```bash
# Required for production
NODE_ENV=production
DATABASE_URL=postgresql://...

# Migration control
RUN_MIGRATIONS=true              # Run database migrations during deployment
```

## Deployment Scenarios

### 1. Railway Deployment (Recommended)

**Automatic Setup:**
- The `deploy.sh` script runs automatically via `railway.toml` configuration
- Set `RUN_MIGRATIONS=true` in Railway environment variables to run migrations
- Script will automatically run `npx medusa db:migrate` if enabled

### 2. Manual Deployment

For other platforms (Heroku, DigitalOcean, etc.):

```bash
# Run migrations manually
npx medusa db:migrate

# Seed database (optional, for development/demo)
yarn seed
```

### 3. Production Deployment (Existing Database)

For deployments where database already exists:

```bash
# Just run migrations
npx medusa db:migrate
```

### 4. Development Environment Reset

For local development complete reset:

```bash
# Complete database reset (drops and recreates)
yarn reset-database
```

## Available Scripts

| Script | Purpose | When to Use |
|--------|---------|-------------|
| `npx medusa db:migrate` | Run database migrations only | Always safe to run |
| `yarn seed` | Seed database with demo data | First time or data refresh |
| `yarn reset-database` | Complete database reset | Development only |

## How deploy.sh Gets Executed

### Automatic Execution (Railway)
The `deploy.sh` script is automatically executed through the `railway.toml` configuration during deployment.

### Manual Execution
You can also run the deployment script manually:

```bash
# Make script executable and run it
chmod +x deploy.sh && ./deploy.sh

# Or run migrations directly
npx medusa db:migrate
```

## Environment-Specific Setup

### Railway
1. Set `RUN_MIGRATIONS=true` to enable database migrations
2. The `deploy.sh` handles migrations automatically
3. Environment variables are managed through Railway dashboard

### Heroku
1. Add PostgreSQL addon
2. Set build pack to Node.js
3. Run: `heroku run npx medusa db:migrate`

### DigitalOcean App Platform
1. Add managed PostgreSQL database
2. Set up environment variables
3. Use `npx medusa db:migrate` in run commands

### Docker/Generic
```dockerfile
# In your Dockerfile
RUN yarn build
CMD ["sh", "-c", "npx medusa db:migrate && yarn start"]
```

## Environment Variables Reference

### Required
- `NODE_ENV=production`
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret
- `COOKIE_SECRET` - Cookie encryption secret

### CORS (Update with your domains)
- `STORE_CORS` - Frontend domain(s)
- `ADMIN_CORS` - Admin panel domain(s)  
- `AUTH_CORS` - Authentication domain(s)

### Migration Control (Optional)
- `RUN_MIGRATIONS=true` - Run database migrations during deployment

## Troubleshooting

### Migration failures
- Check `DATABASE_URL` is correct
- Ensure database exists and is accessible
- Check PostgreSQL version compatibility
- Verify `RUN_MIGRATIONS=true` is set if using deploy.sh

### Seeding failures (when using yarn seed)
- Run `npx medusa db:migrate` first
- Check database has proper permissions
- Verify all environment variables are set

## Security Checklist

After deployment:
- [ ] Update CORS settings with actual domains
- [ ] Set up SSL/TLS certificates
- [ ] Configure proper backup strategy
- [ ] Monitor application logs

## Support

- Check deployment logs for specific error messages
- Ensure all environment variables are properly set
- Verify database connectivity and permissions
- Review Railway/platform-specific documentation