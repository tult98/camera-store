#!/bin/bash

# Railway deployment script for MedusaJS backend
# This script runs automatically on Railway deployment

echo "🚀 Starting Railway deployment..."

echo "📦 Building application..."
yarn build

echo "🗄️ Running database migrations..."
yarn deploy:migrate

echo "🌱 Checking if database needs seeding..."
# Only seed if this is a fresh deployment (no existing data)
if [ "$RAILWAY_SEED_DB" = "true" ]; then
    echo "🌱 Seeding database with demo data..."
    yarn deploy:seed
else
    echo "⏭️ Skipping database seeding (set RAILWAY_SEED_DB=true to seed)"
fi

echo "✅ Deployment preparation complete!"
echo "🚀 Starting Medusa server..."