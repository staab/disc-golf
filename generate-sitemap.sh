#!/bin/bash

base=https://duthie-park.anhyzer.io
# routes=$(cat src/App.svelte \
#   | grep -oE 'path="([a-z\/]+)"' \
#   | awk -F\" '{print $2}' \
#   | xargs -I{} echo '  <url><loc>'$base{}'</loc></url>')

cat <<EOF > public/sitemap.xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>$base/</loc></url>
  <url><loc>$base/game/new</loc></url>
  <url><loc>$base/leaders</loc></url>
</urlset>
EOF
