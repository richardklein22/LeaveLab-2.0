#!/bin/bash

# Lighthouse Performance Testing Script
# Tests web performance and generates reports

echo "🔦 Lighthouse Performance Testing"
echo "=================================="
echo ""

# Check if lighthouse is installed
if ! command -v lighthouse &> /dev/null; then
    echo "❌ Lighthouse CLI not found"
    echo "📦 Installing Lighthouse..."
    npm install -g lighthouse
fi

# Configuration
URL="${1:-http://localhost:3000}"
OUTPUT_DIR="lighthouse-reports"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

echo "🌐 Target URL: $URL"
echo "📁 Output Directory: $OUTPUT_DIR"
echo ""

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Test pages
PAGES=(
    "/"
    "/login"
    "/signup"
    "/dashboard"
    "/pricing"
)

echo "📊 Running Lighthouse tests..."
echo ""

# Run tests for each page
for page in "${PAGES[@]}"; do
    FULL_URL="${URL}${page}"
    PAGE_NAME=$(echo "$page" | sed 's/\//-/g' | sed 's/^-//')
    [ -z "$PAGE_NAME" ] && PAGE_NAME="home"
    
    OUTPUT_FILE="${OUTPUT_DIR}/${PAGE_NAME}_${TIMESTAMP}"
    
    echo "🔍 Testing: $FULL_URL"
    
    lighthouse "$FULL_URL" \
        --output html \
        --output json \
        --output-path "$OUTPUT_FILE" \
        --chrome-flags="--headless" \
        --only-categories=performance,accessibility,best-practices,seo \
        --quiet
    
    echo "✅ Report saved: ${OUTPUT_FILE}.html"
    echo ""
done

echo "=================================="
echo "✨ Lighthouse tests complete!"
echo ""
echo "📈 View reports:"
for page in "${PAGES[@]}"; do
    PAGE_NAME=$(echo "$page" | sed 's/\//-/g' | sed 's/^-//')
    [ -z "$PAGE_NAME" ] && PAGE_NAME="home"
    echo "   - ${OUTPUT_DIR}/${PAGE_NAME}_${TIMESTAMP}.html"
done
echo ""

# Generate summary from JSON files
echo "📊 Performance Summary:"
echo "=================================="

for page in "${PAGES[@]}"; do
    PAGE_NAME=$(echo "$page" | sed 's/\//-/g' | sed 's/^-//')
    [ -z "$PAGE_NAME" ] && PAGE_NAME="home"
    
    JSON_FILE="${OUTPUT_DIR}/${PAGE_NAME}_${TIMESTAMP}.json"
    
    if [ -f "$JSON_FILE" ]; then
        echo ""
        echo "Page: $page"
        
        # Extract scores using jq if available
        if command -v jq &> /dev/null; then
            PERF=$(jq -r '.categories.performance.score * 100' "$JSON_FILE")
            ACC=$(jq -r '.categories.accessibility.score * 100' "$JSON_FILE")
            BP=$(jq -r '.categories["best-practices"].score * 100' "$JSON_FILE")
            SEO=$(jq -r '.categories.seo.score * 100' "$JSON_FILE")
            
            echo "  Performance:    ${PERF}%"
            echo "  Accessibility:  ${ACC}%"
            echo "  Best Practices: ${BP}%"
            echo "  SEO:            ${SEO}%"
            
            # Key metrics
            FCP=$(jq -r '.audits["first-contentful-paint"].displayValue' "$JSON_FILE")
            LCP=$(jq -r '.audits["largest-contentful-paint"].displayValue' "$JSON_FILE")
            TBT=$(jq -r '.audits["total-blocking-time"].displayValue' "$JSON_FILE")
            CLS=$(jq -r '.audits["cumulative-layout-shift"].displayValue' "$JSON_FILE")
            SI=$(jq -r '.audits["speed-index"].displayValue' "$JSON_FILE")
            
            echo ""
            echo "  First Contentful Paint: $FCP"
            echo "  Largest Contentful Paint: $LCP"
            echo "  Total Blocking Time: $TBT"
            echo "  Cumulative Layout Shift: $CLS"
            echo "  Speed Index: $SI"
        else
            echo "  (Install jq for detailed scores: brew install jq)"
        fi
    fi
done

echo ""
echo "=================================="
echo "✅ Done!"

