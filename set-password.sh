#!/bin/sh
# Sets the site password (stored only as a hash), then deploys.
cd "$(dirname "$0")" || exit 1
printf "New password: "; stty -echo; read -r pw; stty echo; printf "\n"
[ -z "$pw" ] && { echo "Empty password, nothing changed."; exit 1; }
h=$(printf 'pourlys:%s' "$pw" | shasum -a 256 | cut -d' ' -f1)
sed -i '' -E "s/const HASH = \"[0-9a-f]*\";/const HASH = \"$h\";/" gate.js
./deploy.sh "Update access password"
echo "Done. Open the site in a private window to check the gate."
