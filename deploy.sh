#!/bin/bash
set -e

SERVER="ladygasy@46.182.5.79"
REMOTE_PATH="/home/ladygasy/public_html/lady-gasy"
SSH_KEY="$HOME/.ssh/id-rsa"
SSH="ssh -i $SSH_KEY"
SCP="scp -i $SSH_KEY"

echo "🔨 Building..."
pnpm build

echo "📦 Packaging everything into a single archive..."
TEMP_DIR="/tmp/lady-gasy-bundle"
rm -rf "$TEMP_DIR" /tmp/lady-gasy-full.tar.gz
mkdir -p "$TEMP_DIR"

# 1. Standalone app
cp -R .next/standalone/. "$TEMP_DIR/"

# 2. Static assets inside .next/static
mkdir -p "$TEMP_DIR/.next/static"
cp -R .next/static/. "$TEMP_DIR/.next/static/"

# 3. Public folder
mkdir -p "$TEMP_DIR/public"
cp -R public/. "$TEMP_DIR/public/"

# Create single tar.gz without macOS xattrs
COPYFILE_DISABLE=1 tar -czf /tmp/lady-gasy-full.tar.gz -C "$TEMP_DIR" .
rm -rf "$TEMP_DIR"

echo "📤 Uploading single bundle (this may take 1-2 minutes)..."
$SCP /tmp/lady-gasy-full.tar.gz $SERVER:/tmp/lady-gasy-full.tar.gz

echo "🗜️  Extracting & restarting on server..."
$SSH $SERVER "
  mkdir -p $REMOTE_PATH/tmp &&
  tar -xzf /tmp/lady-gasy-full.tar.gz -C $REMOTE_PATH &&
  rm -f /tmp/lady-gasy-full.tar.gz &&
  touch $REMOTE_PATH/tmp/restart.txt
"

rm -f /tmp/lady-gasy-full.tar.gz

echo "✅ Deployed successfully! → https://ladygasy.mg"
