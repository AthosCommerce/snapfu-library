#!/bin/bash

YELLOW='\033[1;33m'
RED='\033[1;31m'
CYAN='\033[1;36m'
RESET='\033[0m'

warnings=0

warn() {
    printf "  ${YELLOW}⚠${RESET}  %s\n\n" "$1"
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
middleware_files=$(grep -r -l -E "(\.on\('(afterSearch|afterStore)'|(afterSearch|afterStore)[[:space:]]*:)" ./src 2>/dev/null)

# For each file, output "file:linenum:content" for every middleware declaration whose callback
# scope (brace-tracked) contains 'response' in code (not in // comments). This serves both
# detection and display — only the specific declarations with response in scope are reported.
find_response_middleware_lines() {
    awk '
    BEGIN { in_block = 0; depth = 0; entered = 0; block_code = ""; decl_linenum = 0; decl_line = ""; in_comment = 0 }
    {
        line = $0
        if (!in_block) {
            if (line ~ /\.on\('"'"'(afterSearch|afterStore)'"'"'|(afterSearch|afterStore)[[:space:]]*:/) {
                in_block = 1; entered = 0; depth = 0; block_code = ""
                decl_linenum = NR; decl_line = line
            } else {
                next
            }
        }
        # Strip block comments (/* ... */), which may span multiple lines
        stripped = line
        if (in_comment) {
            if ((pos = index(stripped, "*/")) > 0) { stripped = substr(stripped, pos + 2); in_comment = 0 }
            else { stripped = "" }
        }
        while (!in_comment && (pos = index(stripped, "/*")) > 0) {
            before = substr(stripped, 1, pos - 1)
            rest = substr(stripped, pos + 2)
            if ((endpos = index(rest, "*/")) > 0) { stripped = before substr(rest, endpos + 2) }
            else { stripped = before; in_comment = 1 }
        }
        # Strip line comments (//)
        if (!in_comment && match(stripped, /\/\//)) { stripped = substr(stripped, 1, RSTART - 1) }
        block_code = block_code stripped "\n"
        tmp = line; open = 0
        while ((idx = index(tmp, "{")) > 0) { open++; tmp = substr(tmp, idx + 1) }
        tmp = line; close_n = 0
        while ((idx = index(tmp, "}")) > 0) { close_n++; tmp = substr(tmp, idx + 1) }
        if (open > 0) entered = 1
        depth += open - close_n
        if (entered && depth <= 0) {
            if (block_code ~ /(^|[^[:alnum:]_])response([^[:alnum:]_]|$)/) {
                print FILENAME ":" decl_linenum ":" decl_line
            }
            in_block = 0; block_code = ""; entered = 0; depth = 0
        }
    }
    ' "$1"
}

found_inline=""
found_inline_lines=""
while IFS= read -r file; do
    [ -z "$file" ] && continue
    matches=$(find_response_middleware_lines "$file")
    if [ -n "$matches" ]; then
        found_inline="${found_inline}${file}"$'\n'
        found_inline_lines="${found_inline_lines}${matches}"$'\n'
    fi
done <<< "$middleware_files"

# Also check for middleware passed as a function reference (e.g. afterSearch: myFn).
# Extract referenced function names (exclude inline async/arrow/function values and comment lines).
# Handles direct references (afterSearch: myFn) and array references (afterSearch: [myFn, myFn2]).
ref_names=$(grep -r -h -E "(afterSearch|afterStore)[[:space:]]*:" ./src 2>/dev/null \
    | grep -E -v "^[[:space:]]*//" \
    | grep -E -v "(afterSearch|afterStore)[[:space:]]*:[[:space:]]*(async\b|function\b|\()" \
    | grep -E -o "(afterSearch|afterStore)[[:space:]]*:[[:space:]]*\[?[a-zA-Z_][a-zA-Z0-9_,[:space:]]*" \
    | sed "s/.*:[[:space:]]*//" \
    | tr -d '[]' \
    | tr ',' '\n' \
    | tr -d ' \r' \
    | grep -v '^$' \
    | sort -u)

all_js_files=$(find ./src -type f \( -name "*.js" -o -name "*.ts" -o -name "*.jsx" -o -name "*.tsx" \) 2>/dev/null)

found_refs=""
while IFS= read -r name; do
    [ -z "$name" ] && continue
    # Search all JS/TS files for the function definition and response usage
    while IFS= read -r f; do
        [ -z "$f" ] && continue
        # Skip files already flagged by inline check
        case "$found_inline" in *"$f"*) continue ;; esac
        # Check the file defines the function
        if ! grep -q -E "(function[[:space:]]+${name}[[:space:]]*\(|[^a-zA-Z0-9_]${name}[[:space:]]*=[[:space:]]*(async[[:space:]]*)?(function\b|\())" "$f" 2>/dev/null; then
            continue
        fi
        # Check the file uses response as destructured variable or property access
        if grep -q -E "(\{[^}]*\bresponse\b|\.response\b)" "$f"; then
            found_refs="${found_refs}${f}"$'\n'
        fi
    done <<< "$all_js_files"
done <<< "$ref_names"

if [ -n "$found_inline" ] || [ -n "$found_refs" ]; then
    file_count=$(printf "%s\n%s\n" "$found_inline" "$found_refs" | grep -v '^$' | sort -u | wc -l | tr -d ' ')
    warnings=$((warnings + file_count))
    section "afterSearch / afterStore middleware"
    warn "The response payload structure has changed. Review the lines below and update any response references."

    # For inline middleware: show only the specific declaration lines where response is in scope
    printf "%s\n" "$found_inline_lines"

    # For referenced functions: show the response usage lines in the function definition file
    while IFS= read -r file; do
        [ -z "$file" ] && continue
        grep -H -n -E "(\{[^}]*\bresponse\b|\.response\b)" "$file"
    done <<< "$found_refs"
fi

# Check for class components in JSX/TSX files that may need to be refactored to functional components
class_components=$(grep -r -H -n -E "class[[:space:]]+[[:alnum:]_]+[[:space:]]+extends[[:space:]]+(Component|PureComponent)" --include="*.jsx" --include="*.tsx" ./src 2>/dev/null)

if [ -n "$class_components" ]; then
    file_count=$(printf "%s\n" "$class_components" | grep -v '^$' | sed 's/:.*//' | sort -u | wc -l | tr -d ' ')
    warnings=$((warnings + file_count))
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
else
    local_msg="  ✔  Migration completed - no issues found in automated checks"
    local_len=$((${#local_msg} + 2))
    local_bar=""
    i=0
    while [ $i -lt $local_len ]; do
        local_bar="${local_bar}━"
        i=$((i + 1))
    done
    printf "\n${CYAN}${local_bar}${RESET}\n"
    printf "${CYAN}%s${RESET}\n" "$local_msg"
    printf "${CYAN}${local_bar}${RESET}\n"
fi

printf "\n  For more information:\n  ${CYAN}https://athoscommerce.github.io/snap/reference-migration${RESET}\n\n"