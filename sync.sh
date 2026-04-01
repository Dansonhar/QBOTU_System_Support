#!/bin/bash
# Run this after making content changes in the local admin panel
# It commits the database + any new uploads and pushes to GitHub
# Render will then auto-deploy within ~2 minutes

echo "🔄 Syncing local changes to Render..."

git add server/faq.db uploads/

# Only commit if there are staged changes
if git diff --cached --quiet; then
  echo "✅ Nothing new to sync — already up to date."
else
  git commit -m "sync: update content and uploads"
  git push origin main
  echo "✅ Done! Render will deploy in ~2 minutes."
fi
