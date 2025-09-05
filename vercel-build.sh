#!/bin/bash

# Install dependencies
echo "Installing dependencies..."
pnpm install --legacy-peer-deps

# Build the web app
echo "Building web app..."
cd apps/web
pnpm run build

echo "Build completed successfully!"
