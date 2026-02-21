# TrendLensX

A modern, production-ready content platform built with Next.js and TailwindCSS. Your lens to trending topics in News, Finance, Technology, Education, Sports, Lifestyle, Jobs, and Scholarships.

## Features

### Content Structure
- **8 Categories**: News, Finance, Technology, Education, Sports, Lifestyle, Jobs, Scholarships
- **Author Profiles**: Bio, avatar, and social media links
- **Dynamic Posts**: Featured posts, category filtering, and search functionality

### Pages
- Homepage with featured and latest articles
- Category pages with filtered content
- Single post pages with comments and social sharing
- Search functionality
- About and Contact pages

### SEO & Marketing
- next-seo for meta tags management
- next-sitemap for automatic sitemap generation
- Open Graph tags for social sharing
- Structured data ready

### Monetization Ready
- Google AdSense integration placeholders
- Affiliate link support
- Payment gateway ready (Stripe, Paystack, Flutterwave)

### Security
- Security headers via Next.js config
- HTTPS enforced
- XSS protection
- CSRF-ready

### Analytics
- Google Analytics ready
- Plausible Analytics support

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/trendlensx.git
cd trendlensx

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:5000](http://localhost:5000) in your browser.

### Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

- `NEXT_PUBLIC_SITE_URL` - Your production URL
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` - Google Analytics ID
- `MAILCHIMP_API_KEY` - For newsletter integration
- `STRIPE_*` - Payment gateway credentials

## Project Structure

```
TrendLensX/
├── .github/workflows/     # GitHub Actions CI/CD
├── public/                # Static assets
│   ├── images/           # Image assets
│   └── icons/            # Favicons and icons
├── src/
│   ├── components/       # React components
│   │   ├── Ads/         # Advertisement components
│   │   ├── Cards/       # Card components
│   │   ├── Comments/    # Comment section
│   │   ├── Layout/      # Header, Footer, Layout
│   │   ├── Sections/    # Page sections
│   │   ├── SEO/         # SEO components
│   │   └── Social/      # Social sharing
│   ├── data/            # Mock data
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility libraries
│   ├── pages/           # Next.js pages
│   ├── styles/          # Global styles
│   ├── types/           # TypeScript types
│   └── utils/           # Utility functions
├── .env.example          # Environment template
├── next.config.js        # Next.js configuration
├── next-sitemap.config.js # Sitemap configuration
├── tailwind.config.js    # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
└── vercel.json          # Vercel deployment config
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

### Manual Build

```bash
npm run build
npm run start
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Tech Stack

- **Framework**: Next.js 14
- **Styling**: TailwindCSS
- **SEO**: next-seo, next-sitemap
- **Icons**: Lucide React
- **Social Sharing**: react-share
- **Forms**: react-hook-form + zod
- **Date Handling**: date-fns

## License

MIT License - See LICENSE file for details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

Built with love by the TrendLensX Team
