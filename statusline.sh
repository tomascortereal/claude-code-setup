#!/bin/bash
# Minimal statusline: model + dir + branch (line 1), context bar (line 2)
input=$(cat)

MODEL=$(echo "$input" | jq -r '.model.display_name')
DIR=$(echo "$input" | jq -r '.workspace.current_dir')
PCT=$(echo "$input" | jq -r '.context_window.used_percentage // 0' | cut -d. -f1)

CYAN='\033[36m'; GREEN='\033[32m'; YELLOW='\033[33m'; RED='\033[31m'; RESET='\033[0m'

# Git branch (if in a repo)
BRANCH=""
if git -C "$DIR" rev-parse --git-dir > /dev/null 2>&1; then
    BRANCH=" | \xF0\x9F\x8C\xBF $(git -C "$DIR" branch --show-current 2>/dev/null)"
fi

# Line 1: model + directory + branch
printf "${CYAN}[${MODEL}]${RESET} \xF0\x9F\x93\x81 ${DIR##*/}${BRANCH}\n"

# Line 2: context bar
if [ "$PCT" -ge 90 ]; then BAR_COLOR="$RED"
elif [ "$PCT" -ge 70 ]; then BAR_COLOR="$YELLOW"
else BAR_COLOR="$GREEN"; fi

FILLED=$((PCT / 10)); EMPTY=$((10 - FILLED))
BAR=""
[ "$FILLED" -gt 0 ] && printf -v FILL "%${FILLED}s" && BAR="${FILL// /█}"
[ "$EMPTY" -gt 0 ] && printf -v PAD "%${EMPTY}s" && BAR="${BAR}${PAD// /░}"

printf "${BAR_COLOR}${BAR}${RESET} ${PCT}%%\n"
