#!/bin/bash

# LeaveLab Supabase Setup Script
# Run this after installing Supabase CLI

set -e

# Add Homebrew to PATH for this session
export PATH="/opt/homebrew/bin:$PATH"

echo "🚀 LeaveLab Supabase Setup"
echo "=========================="
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running!"
    echo "Please start Docker Desktop and try again."
    exit 1
fi

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Error: Supabase CLI is not installed!"
    echo ""
    echo "Install it using:"
    echo "  brew install supabase/tap/supabase"
    echo ""
    exit 1
fi

echo "✅ Docker is running"
echo "✅ Supabase CLI is installed"
echo ""

# Check if .supabase directory exists
if [ ! -d ".supabase" ]; then
    echo "📦 Initializing Supabase..."
    supabase init
else
    echo "✅ Supabase already initialized"
fi

echo ""
echo "🐳 Starting Supabase (this may take a few minutes)..."
echo ""

# Start Supabase
supabase start

echo ""
echo "✅ Supabase started successfully!"
echo ""

# Get the credentials
SUPABASE_URL=$(supabase status | grep "API URL" | awk '{print $3}')
ANON_KEY=$(supabase status | grep "anon key" | awk '{print $3}')
SERVICE_ROLE_KEY=$(supabase status | grep "service_role key" | awk '{print $3}')

echo "📝 Creating .env.local file..."

# Create .env.local
cat > .env.local << EOF
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=$SERVICE_ROLE_KEY

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=LeaveLab

# Session Configuration
JWT_SECRET=leavelab-local-development-jwt-secret-change-in-production
SESSION_DURATION_DAYS=7
EOF

echo "✅ .env.local created"
echo ""

# Run migrations
echo "🗄️  Running database migrations..."
supabase db push

echo "✅ Migrations applied"
echo ""

# Generate TypeScript types
echo "📝 Generating TypeScript types..."
supabase gen types typescript --local > src/lib/supabase/types.ts

echo "✅ Types generated"
echo ""

echo "🎉 Setup complete!"
echo ""
echo "📊 Supabase Dashboard: http://localhost:54323"
echo "📧 Inbucket (Email): http://localhost:54324"
echo ""
echo "Next steps:"
echo "  1. Run: npm run dev"
echo "  2. Visit: http://localhost:3000"
echo ""
