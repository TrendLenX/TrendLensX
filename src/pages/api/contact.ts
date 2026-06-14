import { NextApiRequest, NextApiResponse } from 'next';
import { sendEmail } from '@/lib/email';
import { rateLimit } from '@/lib/rateLimit';

const contactRateLimit = rateLimit({ limit: 3, windowMs: 60 * 60 * 1000 }); // 3 per hour per IP

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function buildInboxEmail(name: string, email: string, subject: string, message: string): string {
  const escaped = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>New Contact Message</title></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:linear-gradient(135deg,#1e3a5f 0%,#4f46e5 100%);padding:32px 40px;">
            <p style="margin:0;font-size:24px;font-weight:800;color:#fff;letter-spacing:-0.5px;">TrendLens<span style="color:#818cf8;">X</span></p>
            <p style="margin:6px 0 0;font-size:13px;color:#c7d2fe;">New contact form submission</p>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;margin-bottom:24px;">
              <tr style="background:#f8fafc;">
                <td style="padding:10px 16px;font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;width:90px;">From</td>
                <td style="padding:10px 16px;font-size:14px;color:#111827;">${escaped(name)} &lt;<a href="mailto:${escaped(email)}" style="color:#4f46e5;">${escaped(email)}</a>&gt;</td>
              </tr>
              <tr style="border-top:1px solid #e2e8f0;">
                <td style="padding:10px 16px;font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Subject</td>
                <td style="padding:10px 16px;font-size:14px;color:#111827;">${escaped(subject)}</td>
              </tr>
            </table>
            <p style="margin:0 0 8px;font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Message</p>
            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:20px;font-size:15px;color:#374151;line-height:1.7;white-space:pre-wrap;">${escaped(message)}</div>
            <div style="margin-top:24px;">
              <a href="mailto:${escaped(email)}?subject=Re: ${escaped(subject)}"
                 style="display:inline-block;padding:12px 28px;background:#4f46e5;color:#fff;font-size:14px;font-weight:600;text-decoration:none;border-radius:8px;">
                Reply to ${escaped(name)}
              </a>
            </div>
          </td>
        </tr>
        <tr>
          <td style="background:#f8fafc;padding:18px 40px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="margin:0;font-size:12px;color:#9ca3af;">&copy; ${new Date().getFullYear()} TrendLensX. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildAutoReplyEmail(name: string, subject: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>We received your message</title></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:linear-gradient(135deg,#1e3a5f 0%,#4f46e5 100%);padding:36px 40px;text-align:center;">
            <p style="margin:0;font-size:26px;font-weight:800;color:#fff;letter-spacing:-0.5px;">TrendLens<span style="color:#818cf8;">X</span></p>
            <p style="margin:8px 0 0;font-size:13px;color:#c7d2fe;">Your lens to trending topics</p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;">Thanks for reaching out, ${name.split(' ')[0]}!</p>
            <p style="margin:0 0 20px;font-size:15px;color:#6b7280;line-height:1.6;">
              We've received your message about <strong>"${subject}"</strong> and will get back to you as soon as possible — usually within 1–2 business days.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px 20px;">
                  <p style="margin:0;font-size:13px;color:#64748b;line-height:1.5;">
                    In the meantime, explore the latest trending stories on TrendLensX.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="background:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="margin:0;font-size:12px;color:#9ca3af;">&copy; ${new Date().getFullYear()} TrendLensX. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  if (!contactRateLimit(req, res)) return;

  const { name, email, subject, message } = req.body;

  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ message: 'Invalid email address' });
  }

  if (name.trim().length < 2) {
    return res.status(400).json({ message: 'Name must be at least 2 characters' });
  }

  if (message.trim().length < 10) {
    return res.status(400).json({ message: 'Message must be at least 10 characters' });
  }

  if (message.trim().length > 5000) {
    return res.status(400).json({ message: 'Message is too long (max 5000 characters)' });
  }

  const inbox = process.env.SMTP_FROM || process.env.SMTP_USER;

  if (!inbox) {
    console.log('\n========== CONTACT FORM (no SMTP configured) ==========');
    console.log('From:', name, '<' + email + '>');
    console.log('Subject:', subject);
    console.log('Message:', message);
    console.log('=======================================================\n');
    return res.status(200).json({ message: 'Message received' });
  }

  try {
    // Send notification to inbox and auto-reply to sender concurrently
    const [inboxOk, replyOk] = await Promise.all([
      sendEmail({
        to: inbox,
        subject: `[Contact] ${subject}`,
        html: buildInboxEmail(name.trim(), email.trim(), subject.trim(), message.trim()),
      }),
      sendEmail({
        to: email.trim(),
        subject: `We received your message — TrendLensX`,
        html: buildAutoReplyEmail(name.trim(), subject.trim()),
      }),
    ]);

    if (!inboxOk) {
      console.error('[contact] Failed to deliver message to inbox');
      return res.status(500).json({ message: 'Failed to send message. Please try again.' });
    }

    return res.status(200).json({ message: 'Message sent successfully' });
  } catch (err) {
    console.error('[contact] Unexpected error:', err);
    return res.status(500).json({ message: 'Failed to send message. Please try again.' });
  }
}
