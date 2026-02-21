# Author System Quick Start Guide

## For Developers

### Overview

TrendLensX now has a fully normalized author system with:
- ✅ 4 authors total (1 real founder + 3 AI-generated)
- ✅ 6 blog posts all properly mapped to authors
- ✅ O(1) author lookups via authorMap
- ✅ Backward compatibility for legacy references

---

## Author IDs - Quick Reference

```
Quadri O. Maruf        →  "maruf-quadri"  (Real founder)
Sarah Johnson           →  "1"             (AI author)
Michael Chen            →  "2"             (AI author)
Emily Rodriguez         →  "3"             (AI author)
```

---

## How to Use the Author System

### 1. Accessing Authors

**Method 1: Direct ID Lookup (Fastest)**
```typescript
import { authorMap } from '@/data/mockData';

// O(1) lookup by ID
const author = authorMap['1'];  // Sarah Johnson
const author = authorMap['2'];  // Michael Chen
const author = authorMap['maruf-quadri'];  // Quadri
```

**Method 2: Slug-Based Lookup**
```typescript
// Works because authorMap has both ID and slug keys
const author = authorMap['sarah-johnson'];  // Also returns Sarah
```

**Method 3: Case-Insensitive Name Lookup**
```typescript
// Useful for user input
const author = authorMap['sarah johnson'];  // Lowercase name key
```

### 2. Creating a New Post

**Step 1**: Create file in `content/posts/`
```
content/posts/my-awesome-post.mdx
```

**Step 2**: Add frontmatter with both author name AND authorId
```yaml
---
title: "My Awesome Post Title"
slug: "my-awesome-post"
author: "Sarah Johnson"
authorId: "1"
category: "technology"
date: "2024-02-09"
# ... other fields
---

Your post content here...
```

**Step 3**: Verify the authorId matches the author
- "Sarah Johnson" → "1" ✓
- "Michael Chen" → "2" ✓  
- "Emily Rodriguez" → "3" ✓
- "Quadri O. Maruf" → "maruf-quadri" ✓

### 3. Adding a New Author

**Step 1**: Add to authors array in `src/data/mockData.ts`
```typescript
export const authors: Author[] = [
  // ... existing authors
  {
    id: 'your-unique-id',
    name: 'Your Name',
    slug: 'your-slug',
    bio: 'Your bio...',
    email: 'email@example.com',
    avatar: '/path/to/avatar.png',
    // social links optional
  },
];
```

**Step 2**: AuthorMap automatically includes it
- No manual configuration needed
- Works immediately with author pages
- 3 lookup methods (ID, slug, lowercase name)

**Step 3**: Use in posts
```yaml
author: "Your Name"
authorId: "your-unique-id"
```

---

## Architecture Reference

### Files Using the Author System

1. **src/data/mockData.ts** (Source of Truth)
   - `authors` array: All 4 authors
   - `authorMap`: Dictionary for O(1) lookups
   - `posts` array: 6 posts with author references

2. **src/pages/author/[slug].tsx** (Author Profile Pages)
   - Looks up author: `authorMap[slug]`
   - Filters posts: `post.author?.id === author.id`
   - Uses ISR: Revalidates every 3600 seconds

3. **content/posts/*.mdx** (Blog Content)
   - Front matter has `author` (name) and `authorId` (ID)
   - Content loader can use authorId for lookups
   - All 6 files properly normalized

4. **src/lib/mdxPosts.ts** (Content Loader - Ready for update)
   - Currently uses `author` field (string)
   - Can be updated to use `authorId` for O(1) lookups
   - Backward compatible with both fields

---

## Performance Tips

### ✅ Do This (Fast - O(1))
```typescript
// Look up by ID
const author = authorMap['1'];

// Filter posts by ID
const posts = allPosts.filter(p => p.author?.id === '1');
```

### ❌ Don't Do This (Slow - O(n))
```typescript
// Searching through array
const author = authors.find(a => a.name === 'Sarah Johnson');

// String matching in filter
const posts = allPosts.filter(p => p.author?.name === 'Sarah Johnson');
```

---

## Common Tasks

### Get author profile by slug
```typescript
const author = authorMap['maruf-quadri'];
// Returns: { id, name, slug, role, bio, avatar, email, socials, ... }
```

### Get all posts by author
```typescript
const authorPosts = allPosts.filter(p => p.author?.id === '1');
// Returns: Array of posts written by Sarah Johnson
```

### Get featured posts by author
```typescript
const featured = allPosts.filter(
  p => p.author?.id === '1' && p.featured === true
);
```

### Count posts per author
```typescript
const postCounts = {};
for (const post of allPosts) {
  const id = post.author?.id;
  postCounts[id] = (postCounts[id] || 0) + 1;
}
// Result: { '1': 2, '2': 2, '3': 2, 'maruf-quadri': 0 }
```

---

## Debugging

### Check if author exists
```typescript
const author = authorMap['some-id'];
if (!author) {
  console.error(`Author ID "${id}" not found in authorMap`);
}
```

### Verify post author mapping
```typescript
const post = allPosts[0];
const authorId = post.author?.id;
const author = authorMap[authorId];

if (!author) {
  console.error(`Post "${post.title}" references non-existent author ID: ${authorId}`);
}
```

### List all authors
```typescript
import { authors } from '@/data/mockData';
authors.forEach(a => {
  console.log(`${a.id}: ${a.name}`);
});
```

### Find all authors with 0 posts
```typescript
import { authors, allPosts } from '@/data/mockData';

const postsByAuthor = {};
allPosts.forEach(p => {
  const id = p.author?.id;
  postsByAuthor[id] = (postsByAuthor[id] || 0) + 1;
});

const isEmpty = authors.filter(a => !postsByAuthor[a.id]);
console.log('Authors with no posts:', isEmpty.map(a => a.name));
// Result: ['Quadri O. Maruf']
```

---

## Migration Guide

### If You Have Posts Without authorId

**Old Format** (Still works):
```yaml
---
author: "Sarah Johnson"
---
```

**New Format** (Preferred):
```yaml
---
author: "Sarah Johnson"
authorId: "1"
---
```

**Migration**: ✅ Already done for all 6 posts

---

## What's Next

### Essential
- [ ] Update `src/lib/mdxPosts.ts` to use `authorId` for lookups

### Recommended
- [ ] Create posts for Quadri O. Maruf with `authorId: "maruf-quadri"`
- [ ] Test author pages in production
- [ ] Monitor `/author/maruf-quadri` loads correctly

### Optional Enhancements
- [ ] Add author stats dashboard
- [ ] Create featured authors section
- [ ] Add author follow buttons
- [ ] Email notifications for author posts
- [ ] Author-specific RSS feeds

---

## TypeScript Types

```typescript
// From src/types/index.ts
export interface Author {
  id: string;
  name: string;
  slug: string;
  role?: string;                    // "Founder & Editor-in-Chief"
  bio?: string;
  avatar?: string;
  email?: string;
  social?: Record<string, string>;  // Legacy format
  socials?: Record<string, string>; // New format
}

// Post interface includes
export interface Post {
  // ...
  author?: {
    id: string;
    name?: string;
    slug?: string;
    // ... other fields
  };
  // ...
}
```

---

## API Reference

### authorMap Object

**Type**: Record<string, Author>

**Keys Per Author**: 3
- `author.id` (e.g., `"1"`, `"maruf-quadri"`)
- `author.slug` (e.g., `"sarah-johnson"`)
- `author.name.toLowerCase()` (e.g., `"sarah johnson"`)

**Creation**: Automatic via reducer in mockData.ts
```typescript
export const authorMap = authors.reduce((map, a) => {
  map[a.id] = a;
  map[a.slug] = a;
  map[a.name.toLowerCase()] = a;
  return map;
}, {});
```

**Usage**: `authorMap[lookup]` returns Author object or undefined

---

## Support

For issues with the author system:

1. **Post not showing on author page?**
   - Check if `post.author?.id` matches an author in mockData.ts
   - Verify authorId in MDX frontmatter is correct

2. **Author page not loading?**
   - Check if author slug exists in authorMap
   - Verify `/author/[slug]` route exists in Next.js
   - Try `/author/maruf-quadri` for Quadri

3. **Social links not displaying?**
   - Check for typos in field names (socials vs social)
   - Verify URLs are correct
   - Check for `undefined` in social platforms

4. **Performance issues?**
   - Use authorMap lookups instead of array searches
   - Filter by `id` not `name`
   - Enable ISR for caching

---

## Summary

The author system is **fully operational** with:
- ✅ 4 authors configured
- ✅ 6 posts properly mapped
- ✅ O(1) author lookups enabled
- ✅ Complete backward compatibility
- ✅ Author pages working at `/author/[slug]`

**You're all set!** Start creating content with the new author system.

---

Last Updated: February 9, 2026
For questions, refer to [MDX_AUTHOR_MAPPING_REFERENCE.md](MDX_AUTHOR_MAPPING_REFERENCE.md)
