#!/bin/bash

# Knowledge Base Management Script
# Usage: ./scripts/manage_knowledge.sh [extract|cleanup]

ACTION=${1:-extract}
WORKSPACE="/home/cwh/.openclaw/workspace"
KNOWLEDGE_DIR="$WORKSPACE/knowledge"
MEMORY_DIR="$WORKSPACE/memory"
SESSIONS_DIR="/home/cwh/.openclaw/agents/main/sessions"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Extract knowledge from recent sessions
extract_knowledge() {
    log_info "Extracting knowledge from recent sessions..."

    # Find recent session files (last 3 days)
    RECENT_SESSIONS=$(find "$SESSIONS_DIR" -name "*.json" -type f -mtime -3 2>/dev/null | head -20)

    if [ -z "$RECENT_SESSIONS" ]; then
        log_warn "No recent sessions found in the last 3 days"
        return
    fi

    # Extract daily memory files (last 3 days)
    RECENT_MEMORY=$(find "$MEMORY_DIR" -name "*.md" -type f -mtime -3 2>/dev/null)

    if [ -z "$RECENT_MEMORY" ]; then
        log_warn "No recent memory files found"
        return
    fi

    # Create temporary file for extracted knowledge
    TEMP_FILE=$(mktemp)

    # Process each memory file
    for memory_file in $RECENT_MEMORY; do
        log_info "Processing $memory_file..."

        # Extract sections that look like persistent knowledge
        # These include: technical decisions, problem solutions, lessons learned
        grep -A 5 -B 2 -E "(决策|方案|解决|经验|教训|重要|关键技术|架构)" "$memory_file" >> "$TEMP_FILE" 2>/dev/null
    done

    if [ -s "$TEMP_FILE" ]; then
        # Classify and categorize knowledge
        CLASSIFY_SCRIPT="$WORKSPACE/scripts/classify_knowledge.py"

        if [ -f "$CLASSIFY_SCRIPT" ]; then
            python3 "$CLASSIFY_SCRIPT" "$TEMP_FILE" "$KNOWLEDGE_DIR"
        else
            # Fallback: create a general knowledge file
            TODAY=$(date +%Y-%m-%d)
            OUTPUT_FILE="$KNOWLEDGE_DIR/extracted_$TODAY.md"

            {
                echo "# 知识提取 - $TODAY"
                echo ""
                echo "提取时间: $(date '+%Y-%m-%d %H:%M:%S')"
                echo ""
                echo "---"
                echo ""
                cat "$TEMP_FILE"
            } > "$OUTPUT_FILE"

            log_info "Knowledge extracted to $OUTPUT_FILE"
        fi
    else
        log_warn "No knowledge extracted from recent sessions"
    fi

    rm -f "$TEMP_FILE"
    log_info "Knowledge extraction completed"
}

# Cleanup outdated knowledge
cleanup_knowledge() {
    log_info "Cleaning up outdated knowledge..."

    # Find files older than 90 days
    OLD_FILES=$(find "$KNOWLEDGE_DIR" -name "*.md" -type f -mtime +90 2>/dev/null)

    if [ -z "$OLD_FILES" ]; then
        log_info "No outdated files found"
        return
    fi

    # Archive old files instead of deleting
    ARCHIVE_DIR="$KNOWLEDGE_DIR/archive"
    mkdir -p "$ARCHIVE_DIR"

    for old_file in $OLD_FILES; do
        log_info "Archiving $old_file..."
        mv "$old_file" "$ARCHIVE_DIR/"
    done

    log_info "Cleanup completed. Archived files to $ARCHIVE_DIR"
}

# Main execution
case "$ACTION" in
    extract)
        extract_knowledge
        ;;
    cleanup)
        cleanup_knowledge
        ;;
    *)
        echo "Usage: $0 [extract|cleanup]"
        exit 1
        ;;
esac
