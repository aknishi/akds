#!/usr/bin/env bash
# Builds the monorepo dependency chain for the website in the order the
# GitHub Actions production deploy (.github/workflows/deploy-website.yml)
# already uses: tokens -> icons -> reactkit -> website. reactkit's tsup
# build needs the larger heap or it OOMs mid-build.
set -e

export NODE_OPTIONS=--max-old-space-size=8192

npm run build --workspace=@aknishi/akds-tokens
npm run generate --workspace=@aknishi/akds-icons
npm run build --workspace=@aknishi/akds-icons
npm run build --workspace=@aknishi/akds-reactkit
npm run build --workspace=@akds/website
