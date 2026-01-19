#!/bin/sh
set -e

echo "🔍 Checking dependencies..."
echo "📂 Current directory: $(pwd)"
echo "📦 Checking for package.json: $(test -f package.json && echo 'found' || echo 'NOT FOUND')"

# Check if node_modules exists and has pnpm structure
NEEDS_INSTALL=false

if [ ! -d "node_modules" ]; then
  echo "⚠️  node_modules directory not found"
  NEEDS_INSTALL=true
elif [ ! -d "node_modules/.pnpm" ]; then
  echo "⚠️  pnpm structure not found in node_modules"
  NEEDS_INSTALL=true
elif [ ! -d "node_modules/@t3-oss" ]; then
  echo "⚠️  @t3-oss packages not found"
  NEEDS_INSTALL=true
elif [ ! -d "node_modules/@t3-oss/env-nextjs" ]; then
  echo "⚠️  @t3-oss/env-nextjs package not found"
  NEEDS_INSTALL=true
else
  # Try to verify the package is actually accessible via Node.js
  # Temporarily disable set -e for this check
  set +e
  node -e "require('@t3-oss/env-nextjs')" 2>/dev/null
  PACKAGE_CHECK=$?
  set -e
  if [ $PACKAGE_CHECK -ne 0 ]; then
    echo "⚠️  @t3-oss/env-nextjs package not accessible via require()"
    NEEDS_INSTALL=true
  fi
fi

if [ "$NEEDS_INSTALL" = "true" ]; then
  echo "📦 Installing dependencies..."
  echo "📋 pnpm version: $(pnpm --version)"
  echo "📋 Node version: $(node --version)"
  echo "📋 Working directory: $(pwd)"

  # Remove node_modules if incomplete to prevent pnpm confirmation prompts
  if [ -d "node_modules" ]; then
    echo "🧹 Removing incomplete node_modules for clean install..."
    rm -rf node_modules
  fi

  # Set non-interactive environment for pnpm (prevents confirmation prompts)
  export CI=true

  # Install dependencies - try with frozen lockfile first, fallback to regular install
  echo "📥 Running pnpm install (non-interactive mode)..."
  # Use printf to send 'y' if pnpm prompts (though CI=true should prevent this)
  if ! printf 'y\n' | pnpm install --frozen-lockfile 2>&1; then
    echo "⚠️  Frozen lockfile install failed, trying without frozen lockfile..."
    printf 'y\n' | pnpm install 2>&1
  fi

  # Wait a moment for file system to sync
  sleep 1

  # Verify installation worked
  echo "🔍 Verifying installation..."
  if [ ! -d "node_modules/@t3-oss/env-nextjs" ]; then
    echo "❌ Installation verification failed - @t3-oss/env-nextjs still not found"
    echo "📋 Listing node_modules contents:"
    ls -la node_modules/ 2>/dev/null | head -20 || echo "  node_modules directory does not exist"
    echo "📋 Checking for @t3-oss directory:"
    ls -la node_modules/@t3-oss 2>/dev/null || echo "  @t3-oss directory does not exist"
    echo "📋 Checking pnpm store:"
    ls -la node_modules/.pnpm 2>/dev/null | head -10 || echo "  .pnpm directory does not exist"
    echo "❌ Fatal: Cannot proceed without required dependencies"
    exit 1
  fi

  echo "✅ Dependencies installed successfully"
  echo "✅ Verified: @t3-oss/env-nextjs is now available"
else
  echo "✅ Dependencies are already installed"
fi

# Execute the command passed to the container
echo "🚀 Starting: $@"
exec "$@"
