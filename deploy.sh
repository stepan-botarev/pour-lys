#!/bin/sh
# usage: ./deploy.sh "commit message"
# Bumps the ?v= cache-buster on css/js (GitHub Pages caches files for 10 min), commits and pushes.
cd "$(dirname "$0")" || exit 1
v=$(date +%s)
sed -i '' -E "s/(styles\.css|config\.js|app\.js)\?v=[0-9]+/\1?v=$v/g" index.html
git add -A
git commit -q -m "${1:-Update}

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
GIT_TERMINAL_PROMPT=0 git push
