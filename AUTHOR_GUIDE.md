# Content Author Guide

Welcome! This guide will help you publish new posts to TrendLensX without writing any code.

## Where Do Posts Live?

All posts are stored in the `/content/posts/` folder, named as `.mdx` files.

**Example file path:**
```
/content/posts/my-awesome-post.mdx
```

## What is MDX?

MDX is Markdown with extra power. It looks and feels like regular Markdown, but lets you add enhanced formatting when needed.

**Simple rule:** If you know Markdown, you already know MDX!

---

## Creating a New Post

### Step 1: Copy the Template

Create a new file in `/content/posts/` with your post title in the filename. Use lowercase with hyphens between words.

**Good filenames:**
- `blockchain-revolution-2024.mdx`
- `remote-work-trends.mdx`
- `climate-action-guide.mdx`

**Avoid:**
- Spaces in filenames
- Special characters (!, @, #, etc.)
- UPPERCASE letters

### Step 2: Add Required Information

Every post needs a **header section** with metadata. This goes at the very top of the file between three dashes:

```mdx
---
slug: blockchain-revolution-2024
title: The Blockchain Revolution in 2024
author: Jane Smith
date: 2024-02-15
category: Technology
excerpt: Discover how blockchain is transforming industries and what it means for the future.
featured: false
tags:
  - blockchain
  - technology
  - innovation
---

Your post content starts here after the dashes...
```

### Required Fields (Must Include)

| Field | What It Is | Example |
|-------|-----------|---------|
| `slug` | Unique URL identifier (lowercase, hyphens only) | `blockchain-revolution-2024` |
| `title` | Post headline | `The Blockchain Revolution in 2024` |
| `author` | Your name | `Jane Smith` |
| `date` | Publication date (YYYY-MM-DD) | `2024-02-15` |
| `category` | Main topic category | `Technology`, `Business`, `Health` |
| `excerpt` | Short summary (1-2 sentences) | `Discover how blockchain is transforming industries...` |

### Optional Fields (Nice to Have)

| Field | What It Is | Example |
|-------|-----------|---------|
| `featured` | Highlight post on homepage (true/false) | `true` |
| `tags` | Related keywords (list format) | `- blockchain`<br/>`- technology` |

---

## Writing Your Post Content

After the closing `---`, write your post using normal Markdown:

```mdx
---
slug: my-first-post
title: My First Post
author: You
date: 2024-02-15
category: Technology
excerpt: A short description.
---

## Main Heading

This is a paragraph. You can write as much as you want here.

### Subheading

- Bullet points work
- Like this
- And this

1. Numbered lists too
2. Very easy
3. Just use numbers

**Bold text** and *italic text* work as expected.

[Links look like this](https://example.com)
```

---

## Complete Example

Here's a real example post:

```mdx
---
slug: future-of-ai-2024
title: The Future of AI in 2024
author: Alex Johnson
date: 2024-02-10
category: Technology
excerpt: AI is reshaping how we work. Here's what to expect this year and beyond.
featured: true
tags:
  - artificial-intelligence
  - technology
  - future-trends
---

## AI is Everywhere Now

Artificial intelligence has moved from science fiction to daily reality. From chatbots to image generators, AI tools are becoming essential in workplaces worldwide.

### What Changed in 2024?

This year marked a turning point. Three major trends emerged:

1. **Accessibility** - AI tools became easier for non-technical users
2. **Affordability** - Costs dropped significantly
3. **Integration** - AI started working with existing tools seamlessly

### What Should You Do?

- Learn basic AI tools
- Stay curious and experiment
- Don't fear the technology
- Share knowledge with your team

The future is here. Are you ready?
```

---

## Publishing Your Post

### Step 1: Save Your File

1. Create or edit your `.mdx` file in `/content/posts/`
2. Make sure the filename matches the slug (with `.mdx` extension)
   - Slug: `future-of-ai-2024`
   - Filename: `future-of-ai-2024.mdx`

### Step 2: Commit to Git

```bash
git add content/posts/your-post-name.mdx
git commit -m "Add new post: Your Post Title"
```

### Step 3: Push to GitHub

```bash
git push origin main
```

### Step 4: Automatic Deployment

That's it! Vercel automatically deploys changes to the live site within 1-2 minutes.

**Your post is now live and visible on TrendLensX!**

---

## Featured Posts

Posts marked as `featured: true` appear prominently on the homepage.

```mdx
featured: true  # Shows on homepage
```

Only the most recent **featured posts** appear (typically 3-4). Use this for:
- Major announcements
- High-priority content
- Time-sensitive articles

### Make a Post Featured

Simply change this line:
```mdx
featured: false  # Not featured
```

To this:
```mdx
featured: true  # Featured!
```

---

## Common Mistakes to Avoid

### ❌ Wrong: Extra spaces in slug
```mdx
slug: my awesome post  # NO - spaces not allowed
```
### ✅ Right: Lowercase with hyphens
```mdx
slug: my-awesome-post  # YES - this is correct
```

---

### ❌ Wrong: Filename doesn't match slug
```mdx
slug: my-post
Filename: MyPost.mdx  # NO - doesn't match
```
### ✅ Right: Filename matches slug
```mdx
slug: my-post
Filename: my-post.mdx  # YES - matches exactly
```

---

### ❌ Wrong: Missing required fields
```mdx
---
slug: my-post
title: My Post
---
```
### ✅ Right: All required fields included
```mdx
---
slug: my-post
title: My Post
author: You
date: 2024-02-15
category: Technology
excerpt: Short summary here.
---
```

---

### ❌ Wrong: Broken date format
```mdx
date: Feb 15, 2024  # NO - wrong format
date: 15/02/2024    # NO - wrong format
```
### ✅ Right: ISO date format
```mdx
date: 2024-02-15  # YES - YYYY-MM-DD
```

---

### ❌ Wrong: Tags as plain text
```mdx
tags: blockchain, technology, crypto  # NO - not a list
```
### ✅ Right: Tags as a list
```mdx
tags:
  - blockchain
  - technology
  - crypto
```

---

## Got Questions?

- **Post not showing?** Check the slug matches the filename exactly
- **Date in wrong order?** Use YYYY-MM-DD format (2024-02-15)
- **Missing something?** Make sure all required fields are included
- **Want to feature it?** Set `featured: true` in the header

---

## Quick Reference Checklist

Before publishing, verify:

- [ ] File is in `/content/posts/` folder
- [ ] Filename is lowercase with hyphens (e.g., `my-post.mdx`)
- [ ] All required fields are filled in (`slug`, `title`, `author`, `date`, `category`, `excerpt`)
- [ ] Date is in YYYY-MM-DD format (2024-02-15)
- [ ] Slug matches the filename without `.mdx`
- [ ] If using tags, they're formatted as a list (with hyphens)
- [ ] Content is written below the closing `---`

**Ready to publish?** Follow the GitHub workflow above and your post goes live in minutes!

---

Happy writing! 🚀
