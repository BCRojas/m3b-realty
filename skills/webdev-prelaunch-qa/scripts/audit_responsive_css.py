#!/usr/bin/env python3
"""
audit_responsive_css.py

Scans htmlGenerators.ts for common responsive layout issues:
- Fixed-width grid columns with no mobile media query override
- Missing overflow-x: hidden on body
- Missing viewport meta tag
- Missing meta description
- Font sizes above 2rem with no mobile override

Usage:
    python3 audit_responsive_css.py /path/to/htmlGenerators.ts

Output: A report of found issues with line numbers.
"""

import re
import sys
from pathlib import Path


def audit(filepath: str) -> None:
    path = Path(filepath)
    if not path.exists():
        print(f"ERROR: File not found: {filepath}")
        sys.exit(1)

    content = path.read_text()
    lines = content.splitlines()
    issues = []

    # 1. Check for overflow-x: hidden on body
    if "overflow-x: hidden" not in content:
        issues.append("MISSING: overflow-x: hidden not found in body CSS (getBaseStyles)")

    # 2. Check for viewport meta tag in all 4 templates
    viewport_count = content.count('meta name="viewport"')
    if viewport_count < 4:
        issues.append(f"MISSING: viewport meta tag found {viewport_count} times, expected 4 (one per template)")

    # 3. Check for meta description in all 4 templates
    desc_count = content.count('meta name="description"')
    if desc_count < 4:
        issues.append(f"MISSING: meta description found {desc_count} times, expected 4 (one per template)")

    # 4. Find grid-template-columns with repeat() patterns and check for mobile overrides
    grid_pattern = re.compile(r'grid-template-columns:\s*repeat\((\d+),\s*1fr\)')
    media_pattern = re.compile(r'@media\s*\(max-width:\s*(\d+)px\)')

    # Collect all media query positions
    media_positions = []
    for i, line in enumerate(lines):
        m = media_pattern.search(line)
        if m:
            media_positions.append((i, int(m.group(1))))

    # Check each grid definition
    for i, line in enumerate(lines):
        m = grid_pattern.search(line)
        if m:
            cols = int(m.group(1))
            if cols >= 3:
                # Check if there's a mobile media query within 200 lines after this
                has_mobile_override = any(
                    pos > i and pos < i + 200 and width <= 768
                    for pos, width in media_positions
                )
                if not has_mobile_override:
                    issues.append(
                        f"LINE {i+1}: grid-template-columns: repeat({cols}, 1fr) "
                        f"— no mobile media query override found within 200 lines"
                    )

    # 5. Check for large fixed font sizes without mobile override
    font_pattern = re.compile(r'font-size:\s*([3-9]\.\d+|[3-9])rem')
    for i, line in enumerate(lines):
        m = font_pattern.search(line)
        if m:
            # Check if there's a mobile override within 150 lines
            has_mobile_override = any(
                pos > i and pos < i + 150 and width <= 768
                for pos, width in media_positions
            )
            if not has_mobile_override:
                issues.append(
                    f"LINE {i+1}: Large font-size {m.group(0)} "
                    f"— no mobile media query override found within 150 lines"
                )

    # 6. Check for getFontOverrideStyles calls without darkTheme flag on dark templates
    restaurant_gen_match = re.search(r'function generate\w*Restaurant\w*\(', content)
    if restaurant_gen_match:
        # Find the getFontOverrideStyles call after the restaurant function start
        rest_start = restaurant_gen_match.start()
        rest_section = content[rest_start:rest_start + 5000]
        if 'getFontOverrideStyles' in rest_section:
            if 'darkTheme' not in rest_section[:rest_section.index('getFontOverrideStyles') + 100]:
                issues.append(
                    "Restaurant generator: getFontOverrideStyles called without darkTheme:true "
                    "— this will override the template's dark color scheme"
                )

    # Report
    if issues:
        print(f"\n⚠️  Found {len(issues)} issue(s) in {filepath}:\n")
        for issue in issues:
            print(f"  ❌ {issue}")
        print()
    else:
        print(f"\n✅ No responsive CSS issues found in {filepath}\n")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 audit_responsive_css.py <path_to_htmlGenerators.ts>")
        sys.exit(1)
    audit(sys.argv[1])
