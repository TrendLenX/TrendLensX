---
name: Auth flows — password reset + email verification
description: Token-based password reset and email verification for credentials accounts
---

# Auth flows — password reset + email verification

## Schema fields on `users` table
- `resetToken String? @unique` + `resetTokenExpiry DateTime?` — 1-hour TTL
- `verifyToken String? @unique` + `verifyTokenExpiry DateTime?` — 24-hour TTL
- `emailVerified DateTime?` — already existed; set to `new Date()` on Google sign-up and on verify-email API success

## Password reset files
- `src/lib/email.ts` — nodemailer transporter + `buildPasswordResetEmail()` + `buildVerificationEmail()`
- `src/pages/api/auth/forgot-password.ts` — token gen, email send, user-enumeration-safe response
- `src/pages/api/auth/reset-password.ts` — token validation, bcrypt hash update, token cleanup
- `src/pages/auth/forgot-password.tsx` — email input form
- `src/pages/auth/reset-password.tsx` — password form with strength meter, show/hide, confirm match

## Email verification files
- `src/pages/api/auth/register.ts` — generates verifyToken on create, sends verification email, returns `{verificationSent: true, email}`
- `src/pages/api/auth/verify-email.ts` — GET `?token=`, sets `emailVerified`, redirects to signin with success message or `/auth/verify-email?status=expired|invalid|error`
- `src/pages/api/auth/resend-verification.ts` — POST `{email}`, regenerates token, resends email; safe response always
- `src/pages/auth/check-email.tsx` — shown after registration; shows email address, resend button
- `src/pages/auth/verify-email.tsx` — landing page for the link; handles expired/invalid/success states with resend form
- `src/pages/auth/signup.tsx` — redirects to `/auth/check-email?email=...` after successful registration (no auto sign-in)
- `src/pages/auth/signin.tsx` — detects `result.error === 'EmailNotVerified'`, shows amber banner with inline resend button

## Key implementation detail — re-throwing in authorize()
`src/lib/auth.ts` CredentialsProvider `authorize()` has a `try/catch`. The `throw new Error('EmailNotVerified')` must be **re-thrown** from the catch block, otherwise NextAuth silently swallows it and returns `null` (generic error). Pattern used:
```ts
} catch (err: any) {
  if (err?.message === 'EmailNotVerified') throw err;
  console.error('...'); return null;
}
```

**Why:** NextAuth propagates the thrown Error message as `result.error` when `redirect: false`. Without re-throw, client gets `CredentialsSignin` instead of `EmailNotVerified`.

## Email behavior
- SMTP_HOST + SMTP_USER + SMTP_PASS configured → sends real email
- Not configured → logs full URL to server console (dev fallback)
- SMTP_FROM controls From address

## OAuth-only users
- Google sign-in sets `emailVerified: new Date()` on account creation — no verification needed
- Forgot-password silently skips users with `password: null`
- Resend-verification silently skips users with `emailVerified` already set or `password: null`
