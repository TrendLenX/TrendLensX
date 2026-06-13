---
name: Password reset flow
description: How the token-based password reset feature is implemented and what to know for future changes
---

# Password reset flow

## Schema
Two nullable fields added to `users` table via `prisma db push`:
- `resetToken String? @unique` — 64-char hex token
- `resetTokenExpiry DateTime?` — 1-hour TTL

## Files
- `src/lib/email.ts` — nodemailer transporter + HTML email builder
- `src/pages/api/auth/forgot-password.ts` — generates token, writes to DB, sends email; always returns same success message (no user enumeration)
- `src/pages/api/auth/reset-password.ts` — validates token + expiry, bcrypt-hashes new password, clears token fields
- `src/pages/auth/forgot-password.tsx` — email input form with sent/error states
- `src/pages/auth/reset-password.tsx` — password form with strength meter, show/hide toggle, confirm match validation
- `src/pages/auth/signin.tsx` — "Forgot password?" link added next to Password label

## Email behavior
- If SMTP_HOST + SMTP_USER + SMTP_PASS are set → sends real email via nodemailer
- If not set → logs reset link to server console (dev fallback, feature still usable)
- SMTP_FROM controls the From address; falls back to SMTP_USER or noreply@trendlensx.com

**Why:** Graceful dev fallback means the flow is fully testable without email config. The console log prints the full reset URL so developers can copy-paste it.

## OAuth-only users
Forgot-password silently skips users with `password: null` (Google-only accounts) and returns the same safe response. They must use Google sign-in.

## Security design
- Tokens are `crypto.randomBytes(32).toString('hex')` — 256 bits of entropy
- Expiry: 1 hour
- Token is cleared immediately on use (one-time)
- Expired tokens are also cleared on attempt
- Rate-limited via existing `authRateLimit` middleware
