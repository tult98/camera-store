#!/bin/bash

# Railway post-build script for MedusaJS backend
# This runs after the build phase to initialize the database

set -e  # Exit on any error

echo "🗄️ Running database migrations..."
if ! npx medusa db:migrate; then
    echo "❌ Database migration failed!"
    exit 1
fi

echo "🔍 Checking deployment initialization requirements..."

# Check if this is the first deployment or if forced initialization is requested
INITIALIZE_DB="false"

if [ "$RAILWAY_SEED_DB" = "true" ] || [ "$FORCE_INITIALIZE" = "true" ]; then
    INITIALIZE_DB="true"
elif [ "$NODE_ENV" = "production" ] && [ -z "$SKIP_INITIALIZATION" ]; then
    # In production, default to initializing unless explicitly skipped
    INITIALIZE_DB="true"
fi

if [ "$INITIALIZE_DB" = "true" ]; then
    echo "🚀 Running deployment initialization..."
    
    # Set default admin credentials if not provided
    export ADMIN_EMAIL="${ADMIN_EMAIL:-admin@camera-store.com}"
    export ADMIN_PASSWORD="${ADMIN_PASSWORD:-SecureAdmin123!}"
    
    # Run the initialization script
    if ! npx medusa exec ./src/scripts/initialize-deployment.ts; then
        echo "❌ Deployment initialization failed!"
        echo "💡 You can skip initialization by setting SKIP_INITIALIZATION=true"
        exit 1
    fi
    
    echo "✅ Deployment initialization completed!"
else
    echo "⏭️ Skipping deployment initialization"
    echo "💡 To initialize: set RAILWAY_SEED_DB=true or FORCE_INITIALIZE=true"
    echo "💡 To skip in production: set SKIP_INITIALIZATION=true"
fi

echo ""
echo "🎉 Database setup complete!"
echo "📋 Deployment Status:"
echo "   • Migrations: ✅ Applied"
echo "   • Initialization: $([ "$INITIALIZE_DB" = "true" ] && echo "✅ Completed" || echo "⏭️ Skipped")"
echo ""

if [ "$INITIALIZE_DB" = "true" ]; then
    echo "🔗 Important URLs:"
    echo "   • Admin Panel: ${RAILWAY_PUBLIC_DOMAIN:-\$\{YOUR_DOMAIN\}}/admin"
    echo "   • Store API: ${RAILWAY_PUBLIC_DOMAIN:-\$\{YOUR_DOMAIN\}}/store"
    echo "   • Health Check: ${RAILWAY_PUBLIC_DOMAIN:-\$\{YOUR_DOMAIN\}}/health"
    echo ""
    echo "🔐 Admin Credentials:"
    echo "   • Email: ${ADMIN_EMAIL:-admin@camera-store.com}"
    echo "   • Password: $([ -n "$ADMIN_PASSWORD" ] && echo "[CUSTOM]" || echo "SecureAdmin123!")"
    echo ""
    echo "⚠️  Remember to:"
    echo "   1. Change admin password after first login"
    echo "   2. Update CORS settings with your frontend domain"
    echo "   3. Configure environment variables for production"
fi