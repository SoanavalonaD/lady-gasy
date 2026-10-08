#!/bin/bash
set -e

SERVER="ladygasy@46.182.5.79"
REMOTE_PATH="/home/ladygasy/public_html"
SSH_KEY="$HOME/.ssh/id-rsa"
SSH="ssh -i $SSH_KEY"
SCP="scp -i $SSH_KEY"

echo "🔨 Building..."
pnpm build

echo "📦 Creating archive..."
COPYFILE_DISABLE=1 tar -czf /tmp/lady-gasy-deploy.tar.gz -C .next/standalone .

echo "📤 Uploading archive..."
$SCP /tmp/lady-gasy-deploy.tar.gz $SERVER:/tmp/lady-gasy-deploy.tar.gz

echo "📤 Uploading static assets..."
$SSH $SERVER "mkdir -p $REMOTE_PATH/.next/static"
tar -czf /tmp/lady-gasy-static.tar.gz -C .next/static .
$SCP /tmp/lady-gasy-static.tar.gz $SERVER:/tmp/lady-gasy-static.tar.gz

echo "📤 Uploading public folder..."
tar -czf /tmp/lady-gasy-public.tar.gz -C public .
$SCP /tmp/lady-gasy-public.tar.gz $SERVER:/tmp/lady-gasy-public.tar.gz

echo "🗜️  Extracting on server..."
$SSH $SERVER "
  tar -xzf /tmp/lady-gasy-deploy.tar.gz -C $REMOTE_PATH &&
  tar -xzf /tmp/lady-gasy-static.tar.gz -C $REMOTE_PATH/.next/static &&
  mkdir -p $REMOTE_PATH/public &&
  tar -xzf /tmp/lady-gasy-public.tar.gz -C $REMOTE_PATH/public &&
  rm /tmp/lady-gasy-*.tar.gz &&
  mkdir -p $REMOTE_PATH/tmp &&
  touch $REMOTE_PATH/tmp/restart.txt
"

echo "🧹 Cleaning up local tmp files..."
rm /tmp/lady-gasy-*.tar.gz

echo "✅ Deployed successfully! → https://ladygasy.mg"
