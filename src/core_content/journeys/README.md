
# Journey Markdown Files

This directory contains markdown files for sacred journeys.

## File Structure
Each journey markdown file should include frontmatter at the top with the following fields:

```markdown
---
title: "Journey Title"
description: "A brief description"
tags: ["Tag1", "Tag2"]
veil: false  # Set to true if this requires veil activation
date: "2025-05-01"
---

Journey content goes here...
```

## Required Fields
- `title`: The name of the journey
- `description`: A short description (1-2 sentences)
- `tags`: Array of relevant tags

## Optional Fields
- `veil`: Boolean indicating if this journey requires veil activation (default: false)
- `date`: Publication date in YYYY-MM-DD format
- `author`: Author name
- `coverImage`: Path to a cover image
