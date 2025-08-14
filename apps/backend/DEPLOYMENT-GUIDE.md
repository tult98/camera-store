# First-Time Deployment Guide

This guide covers different scenarios for deploying your camera store backend with proper migration and seeding.

## Quick Reference

### Environment Variables for Deployment

```bash
# Required for production
NODE_ENV=production
DATABASE_URL=postgresql://...

# Admin user (optional - defaults provided)
ADMIN_EMAIL=admin@camera-store.com
ADMIN_PASSWORD=SecureAdmin123!

# Deployment control
RAILWAY_SEED_DB=true              # Force initialization on Railway
FORCE_INITIALIZE=true             # Force initialization anywhere
SKIP_INITIALIZATION=true          # Skip initialization in production
FORCE_RESEED=true                # Force re-seeding existing database
```

## Deployment Scenarios

### 1. Railway First-Time Deployment (Recommended)

**Automatic Setup:**
- The `deploy.sh` script runs automatically via `railway.toml` configuration
- Set `RAILWAY_SEED_DB=true` in Railway environment variables for first deployment
- Remove or set to `false` after successful deployment

**Manual Control:**
```bash
# In Railway console/terminal
yarn deploy:full

# Or run the deploy script directly
yarn deploy:script
```

### 2. Manual First-Time Deployment

For other platforms (Heroku, DigitalOcean, etc.):

```bash
# Run migrations
yarn deploy:migrate

# Initialize database with demo data and admin user
yarn deploy:initialize

# Or run both in sequence
yarn deploy:full
```

### 3. Production Deployment (Existing Database)

For deployments where database already exists:

```bash
# Just run migrations
yarn deploy:migrate

# Create admin user if needed
yarn create-admin
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
| `yarn deploy:migrate` | Run database migrations only | Always safe to run |
| `yarn deploy:seed` | Seed database with demo data | First time or data refresh |
| `yarn deploy:initialize` | Smart initialization (checks existing data) | First-time deployment |
| `yarn deploy:full` | Migrate + Initialize in sequence | First-time deployment |
| `yarn deploy:script` | Run deploy.sh script | Manual deployment script execution |
| `yarn create-admin` | Create/update admin user | Admin user management |
| `yarn reset-database` | Complete database reset | Development only |

## How deploy.sh Gets Executed

### Automatic Execution (Railway)
The `deploy.sh` script is automatically executed through the `railway.toml` configuration:
```toml
[deploy]
startCommand = "chmod +x deploy.sh && ./deploy.sh && yarn start"
```

### Manual Execution
You can also run the deployment script manually:

```bash
# Make script executable and run it
chmod +x deploy.sh && ./deploy.sh

# Or use the npm script
yarn deploy:script

# Or run individual components
yarn deploy:full
```

## Environment-Specific Setup

### Railway
1. Set `RAILWAY_SEED_DB=true` for first deployment
2. The `deploy.sh` handles everything automatically
3. Remove `RAILWAY_SEED_DB` after successful deployment

### Heroku
1. Add PostgreSQL addon
2. Set build pack to Node.js
3. Run: `heroku run yarn deploy:full`

### DigitalOcean App Platform
1. Add managed PostgreSQL database
2. Set up environment variables
3. Use `yarn deploy:full` as run command

### Docker/Generic
```dockerfile
# In your Dockerfile
RUN yarn build
CMD ["sh", "-c", "yarn deploy:full && yarn start"]
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

### Admin User (Optional)
- `ADMIN_EMAIL` - Default: admin@camera-store.com
- `ADMIN_PASSWORD` - Default: SecureAdmin123!
- `ADMIN_FIRST_NAME` - Default: Admin
- `ADMIN_LAST_NAME` - Default: User

### Deployment Control (Optional)
- `RAILWAY_SEED_DB=true` - Force initialization on Railway
- `FORCE_INITIALIZE=true` - Force initialization
- `SKIP_INITIALIZATION=true` - Skip initialization
- `FORCE_RESEED=true` - Force re-seeding existing data
- `UPDATE_ADMIN=true` - Update existing admin user

## Troubleshooting

### "Database already initialized" 
- Set `FORCE_RESEED=true` to re-seed
- Or use `yarn deploy:migrate` only

### "Admin user already exists"
- Set `UPDATE_ADMIN=true` to update existing user
- Or use different `ADMIN_EMAIL`

### Migration failures
- Check `DATABASE_URL` is correct
- Ensure database exists and is accessible
- Check PostgreSQL version compatibility

### Seeding failures
- Run `yarn deploy:migrate` first
- Check database has proper permissions
- Verify all environment variables are set

## Security Checklist

After deployment:
- [ ] Change admin password from default
- [ ] Update CORS settings with actual domains
- [ ] Remove `RAILWAY_SEED_DB` environment variable
- [ ] Set up SSL/TLS certificates
- [ ] Configure proper backup strategy
- [ ] Monitor application logs

## Support

- Check deployment logs for specific error messages
- Ensure all environment variables are properly set
- Verify database connectivity and permissions
- Review Railway/platform-specific documentation