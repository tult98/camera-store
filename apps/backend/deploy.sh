#!/bin/bash

# Railway post-build script for MedusaJS backend
# This runs after the build phase

set -e  # Exit on any error

# Check if migrations should be run
if [ "$RUN_MIGRATIONS" = "true" ]; then
    echo "🗄️ Running database migrations..."
    if ! npx medusa db:migrate; then
        echo "❌ Database migration failed!"
        exit 1
    fi
    echo "✅ Database migrations completed!"
else
    echo "⏭️ Skipping database migrations"
    echo "💡 To run migrations: set RUN_MIGRATIONS=true"
fi

echo "🎉 Deployment script complete!"