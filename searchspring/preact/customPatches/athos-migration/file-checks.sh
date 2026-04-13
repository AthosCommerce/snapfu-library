#!/bin/bash

YELLOW='\033[1;33m'
RED='\033[1;31m'
CYAN='\033[1;36m'
RESET='\033[0m'

warnings=0

warn() {
    printf "${YELLOW}⚠${RESET}  %s\n" "$1"
}

section() {
    local label="ACTION REQUIRED: $1"
    local len=${#label}
    local border=""
    local i=0
    while [ $i -lt $((len + 2)) ]; do
        border="${border}─"
        i=$((i + 1))
    done
    printf "\n${RED}┌${border}┐${RESET}\n"
    printf "${RED}│ %s │${RESET}\n" "$label"
    printf "${RED}└${border}┘${RESET}\n"
}

# Find all files in ./src with afterSearch or afterStore middleware
# Matches both controller.on('afterSearch', ...) and config middleware: { afterSearch: ... } patterns
middleware_files=$(grep -r -l -E "(\.on\('(afterSearch|afterStore)'|(afterSearch|afterStore)\s*:)" ./src 2>/dev/null)

# Filter to only files that also use 'response' as a destructured variable or property access.
# This avoids false positives from comments or unrelated variable names containing 'response'.
found_inline=""
while IFS= read -r file; do
    [ -z "$file" ] && continue
    if grep -q -E "(\{[^}]*\bresponse\b|\.response\b)" "$file"; then
        found_inline="${found_inline}${file}"$'\n'
    fi
done <<< "$middleware_files"

# Also check for middleware passed as a function reference (e.g. afterSearch: myFn).
# Extract referenced function names (exclude inline async/arrow/function values and comment lines).
# Handles direct references (afterSearch: myFn) and array references (afterSearch: [myFn, myFn2]).
ref_names=$(grep -r -h -E "(afterSearch|afterStore)\s*:" ./src 2>/dev/null \
    | grep -E -v "^\s*//" \
    | grep -E -v "(afterSearch|afterStore)\s*:\s*(async\b|function\b|\()" \
    | grep -E -o "(afterSearch|afterStore)\s*:\s*\[?[a-zA-Z_][a-zA-Z0-9_,[:space:]]*" \
    | sed "s/.*:[[:space:]]*//" \
    | tr -d '[]' \
    | tr ',' '\n' \
    | tr -d ' \r' \
    | grep -v '^$' \
    | sort -u)

found_refs=""
while IFS= read -r name; do
    [ -z "$name" ] && continue
    # Search all JS/TS files for the function definition and response usage
    all_js_files=$(find ./src -type f \( -name "*.js" -o -name "*.ts" -o -name "*.jsx" -o -name "*.tsx" \) 2>/dev/null)
    while IFS= read -r f; do
        [ -z "$f" ] && continue
        # Skip files already flagged by inline check
        case "$found_inline" in *"$f"*) continue ;; esac
        # Check the file defines the function
        if ! grep -q -E "(function\s+${name}\s*\(|[^a-zA-Z0-9_]${name}\s*=\s*(async\s*)?(function\b|\())" "$f" 2>/dev/null; then
            continue
        fi
        # Check the file uses response as destructured variable or property access
        if grep -q -E "(\{[^}]*\bresponse\b|\.response\b)" "$f"; then
            found_refs="${found_refs}${f}"$'\n'
        fi
    done <<< "$all_js_files"
done <<< "$ref_names"

if [ -n "$found_inline" ] || [ -n "$found_refs" ]; then
    warnings=$((warnings + 1))
    section "afterSearch / afterStore middleware"
    warn "The response payload structure has changed. Review the lines below and update any response references."

    # For inline middleware: show the middleware declaration lines
    while IFS= read -r file; do
        [ -z "$file" ] && continue
        grep -H -n -E "(\.on\('(afterSearch|afterStore)'|(afterSearch|afterStore)\s*:)" "$file"
    done <<< "$found_inline"

    # For referenced functions: show the response usage lines in the function definition file
    while IFS= read -r file; do
        [ -z "$file" ] && continue
        grep -H -n -E "(\{[^}]*\bresponse\b|\.response\b)" "$file"
    done <<< "$found_refs"
fi

# Check for class components in JSX/TSX files that may need to be refactored to functional components
class_components=$(grep -r -H -n -E "class\s+\w+\s+extends\s+(Component|PureComponent)" --include="*.jsx" --include="*.tsx" ./src 2>/dev/null)

if [ -n "$class_components" ]; then
    warnings=$((warnings + 1))
    section "Class components"
    warn "Class components must be refactored to functional components. Review the lines below."

    printf "%s\n" "$class_components"
fi

# Display summary if any warnings were found (for visibility before deploying)
if [ "$warnings" -gt 0 ]; then
    local_msg="  ⚠  ${warnings} manual check(s) required — see above before deploying"
    local_len=$((${#local_msg} + 2))
    local_bar=""
    i=0
    while [ $i -lt $local_len ]; do
        local_bar="${local_bar}━"
        i=$((i + 1))
    done
    printf "\n${YELLOW}${local_bar}${RESET}\n"
    printf "${YELLOW}%s${RESET}\n" "$local_msg"
    printf "${YELLOW}${local_bar}${RESET}\n"
fi

printf "\n  For more information:\n  ${CYAN}Migration Guide: https://athoscommerce.github.io/snap/reference-migration${RESET}\n\n"