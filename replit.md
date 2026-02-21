# TrendLensX

## Overview
TrendLensX is a Next.js 14 content/blog platform covering trending topics in News, Finance, Technology, Education, Sports, Lifestyle, Jobs, and Scholarships. Content is authored in MDX files under `content/posts/`.

## Project Architecture
- **Framework**: Next.js 14 (Pages Router) with TypeScript
- **Styling**: Tailwind CSS + PostCSS
- **Content**: MDX files in `content/posts/`
- **Port**: 5000 (dev and production)
- **Host**: 0.0.0.0

### Key Directories
- `src/pages/` - Next.js pages (index, about, contact, search, post/[slug], category/[slug], author/[slug])
- `src/components/` - React components (Ads, Cards, Comments, Layout, SEO, Sections, Social)
- `src/lib/` - Utilities, constants, MDX post loading
- `src/data/` - Mock/seed data
- `content/posts/` - MDX blog posts
- `public/` - Static assets (images, favicon)

### Configuration Files
- `next.config.js` - Next.js config (allows all hosts for Replit proxy)
- `tailwind.config.js` - Tailwind CSS config
- `postcss.config.js` - PostCSS config
- `next-sitemap.config.js` - Sitemap generation
- `tsconfig.json` - TypeScript config

## Running
- **Dev**: `npm run dev` (port 5000, 0.0.0.0)
- **Build**: `npm run build`
- **Start**: `npm run start` (port 5000, 0.0.0.0)

## Environment Variables
- `NEXT_PUBLIC_SITE_URL` - Public site URL
- `NEXT_PUBLIC_SITE_NAME` - Site display name (TrendLensX)
- See `.env.example` for optional integrations (analytics, ads, etc.)

## Recent Changes
- 2026-02-12: Imported from GitHub, configured for Replit environment
  - Updated X-Frame-Options to ALLOWALL for Replit iframe preview
  - Set environment variables for site URL and name
  - Configured deployment for autoscale
