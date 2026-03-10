# TrendLensX

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

A modern, production-ready content platform built with Next.js and TailwindCSS. Your lens to trending topics in News, Finance, Technology, Education, Sports, Lifestyle, Jobs, and Scholarships.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

### Content Management
- **MDX-Powered Posts**: Write content in Markdown with JSX components for rich formatting
- **8 Content Categories**: News, Finance, Technology, Education, Sports, Lifestyle, Jobs, Scholarships
- **Author Profiles**: Comprehensive bio pages with avatars and social media links
- **Dynamic Content**: Featured posts, category filtering, and advanced search functionality

### User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Interactive Elements**: Comment sections, social sharing buttons, and newsletter subscriptions
- **Search & Discovery**: Full-text search with category and author filters
- **SEO Optimized**: Meta tags, Open Graph, and structured data for better visibility

### Administration
- **User Management**: Admin panel for managing users and content
- **Authentication**: Secure login system with NextAuth.js
- **Analytics Ready**: Integration points for Google Analytics and Plausible

### Monetization & Marketing
- **Ad Integration**: Google AdSense placeholders and affiliate link support
- **Payment Gateways**: Ready for Stripe, Paystack, and Flutterwave
- **Newsletter**: Mailchimp integration for email marketing

### Technical Features
- **Performance**: Optimized with Next.js 14, TypeScript, and TailwindCSS
- **Security**: HTTPS enforcement, XSS protection, and CSRF-ready
- **Accessibility**: WCAG-compliant components and semantic HTML

## Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/TrendLenX/TrendLensX.git
   cd TrendLensX
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your environment variables (see `.env.example` for details).

4. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

- `NEXT_PUBLIC_SITE_URL`: Your production URL
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`: Google Analytics measurement ID
- `MAILCHIMP_API_KEY`: For newsletter integration
- `NEXTAUTH_SECRET`: Secret for NextAuth.js
- `NEXTAUTH_URL`: Base URL for authentication

## Usage

### For Readers
- Browse trending topics on the homepage
- Filter content by categories or search for specific topics
- Read full articles with comments and social sharing
- Subscribe to the newsletter for updates

### For Content Authors
Posts are written in MDX format. See [AUTHOR_GUIDE.md](AUTHOR_GUIDE.md) for detailed instructions on creating and publishing content.

Key steps:
1. Create a new `.mdx` file in `/content/posts/`
2. Add frontmatter with metadata (title, author, category, etc.)
3. Write your content in Markdown
4. Commit and push to deploy

### Admin Panel
Access `/admin/users` to manage users and content (requires authentication).

## Project Structure

```
TrendLensX/
├── content/
│   └── posts/              # MDX blog posts
├── public/
│   ├── images/            # Static assets
│   └── robots.txt         # SEO file
├── src/
│   ├── components/        # Reusable React components
│   │   ├── Ads/          # Advertisement components
│   │   ├── Cards/        # Post and author cards
│   │   ├── Comments/     # Comment system
│   │   ├── Layout/       # Header, footer, layout
│   │   ├── Sections/     # Page sections (Hero, Newsletter)
│   │   ├── SEO/          # SEO meta components
│   │   └── Social/       # Social sharing buttons
│   ├── data/             # Static data (authors, mock data)
│   ├── lib/              # Utility functions and constants
│   ├── pages/            # Next.js pages and API routes
│   │   ├── api/          # API endpoints
│   │   ├── auth/         # Authentication pages
│   │   ├── admin/        # Admin panel
│   │   ├── author/       # Author profile pages
│   │   ├── category/     # Category pages
│   │   └── post/         # Individual post pages
│   ├── styles/           # Global CSS
│   └── types/            # TypeScript type definitions
├── .env.example          # Environment variables template
├── next.config.js        # Next.js configuration
├── next-sitemap.config.js # Sitemap generation
├── tailwind.config.js    # TailwindCSS configuration
├── tsconfig.json         # TypeScript configuration
└── vercel.json           # Vercel deployment config
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Configure environment variables
4. Deploy automatically

### Manual Deployment

```bash
npm run build
npm run start
```

### Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint for code quality

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`npm run lint`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

For content contributions, see [AUTHOR_GUIDE.md](AUTHOR_GUIDE.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ by the TrendLensX Team
