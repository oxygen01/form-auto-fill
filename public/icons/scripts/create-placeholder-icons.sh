#!/bin/bash
# Create simple placeholder PNG icons

ICON_DIR="public/icons"
mkdir -p "$ICON_DIR"

echo "Creating placeholder icons..."

# Base64-encoded 1x1 blue PNG
BLUE_PNG="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="

echo "$BLUE_PNG" | base64 --decode > "$ICON_DIR/icon16.png"
echo "$BLUE_PNG" | base64 --decode > "$ICON_DIR/icon48.png"
echo "$BLUE_PNG" | base64 --decode > "$ICON_DIR/icon128.png"

echo "✓ Created placeholder icons"
