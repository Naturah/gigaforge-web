#!/bin/bash
# Hook: auto-format
# Type: post-tool-use
# Matcher: Edit|Write
# Description: Automatically format files after editing (Prettier for markdown, Black for Python)

set -euo pipefail

# Read JSON input from stdin
INPUT=$(cat)

# Extract tool and file path
TOOL=$(echo "$INPUT" | jq -r '.tool // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.file_path // empty')

# Only process Edit/Write tools
if [[ ! "$TOOL" =~ ^(Edit|Write)$ ]]; then
    exit 0
fi

# Only process if file path exists
if [[ -z "$FILE_PATH" || ! -f "$FILE_PATH" ]]; then
    exit 0
fi

# Get file extension
EXT="${FILE_PATH##*.}"

# Format based on file type
case "$EXT" in
    md|markdown)
        # Format markdown with Prettier (if installed)
        if command -v prettier &> /dev/null; then
            prettier --write "$FILE_PATH" &> /dev/null || true
        fi
        ;;
    py)
        # Format Python with Black (if installed)
        if command -v black &> /dev/null; then
            black --quiet "$FILE_PATH" 2> /dev/null || true
        fi
        ;;
    js|ts|jsx|tsx|json)
        # Format JavaScript/TypeScript with Prettier (if installed)
        if command -v prettier &> /dev/null; then
            prettier --write "$FILE_PATH" &> /dev/null || true
        fi
        ;;
esac

# Always succeed (don't block workflow if formatting fails)
exit 0
