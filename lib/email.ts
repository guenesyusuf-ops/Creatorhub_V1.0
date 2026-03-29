import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// ✅ Absender – wird geändert sobald mail.filapen.de in Resend verifiziert ist
const FROM = 'CreatorHub <noreply@mail.filapen.de>'

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim())
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

// ── Team-Mitglied einladen ─────────────────────────────────────────────────
export async function sendTeamInvite(to: string, name: string, password: string) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: 'Deine Einladung zu CreatorHub',
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#0a0a0f;color:#f0f0f5;border-radius:16px;overflow:hidden">
        <div style="background:linear-gradient(135deg,#7c3aed,#c8f035);padding:32px;text-align:center">
          <h1 style="margin:0;font-size:28px;color:#0a0a0f;font-weight:900">CREATOR<span>HUB</span></h1>
        </div>
        <div style="padding:32px">
          <h2 style="color:#c8f035;margin-top:0">Willkommen, ${name}! 👋</h2>
          <p style="color:#a0a0b8;line-height:1.6">Du wurdest zum CreatorHub eingeladen. Hier sind deine Zugangsdaten:</p>
          <div style="background:#13131c;border:1px solid #2a2a3a;border-radius:12px;padding:20px;margin:20px 0">
            <p style="margin:0 0 8px;color:#6b6b80;font-size:12px;text-transform:uppercase;letter-spacing:1px">E-Mail</p>
            <p style="margin:0 0 16px;font-size:16px;font-weight:600">${to}</p>
            <p style="margin:0 0 8px;color:#6b6b80;font-size:12px;text-transform:uppercase;letter-spacing:1px">Temporäres Passwort</p>
            <p style="margin:0;font-size:22px;font-weight:900;color:#c8f035;letter-spacing:2px">${password}</p>
          </div>
          <p style="color:#f59e0b;font-size:13px">⚠️ Du wirst beim ersten Login aufgefordert, dein Passwort zu ändern.</p>
          <a href="${APP_URL}/login" style="display:inline-block;background:#c8f035;color:#0a0a0f;font-weight:700;padding:14px 28px;border-radius:10px;text-decoration:none;margin-top:16px">Jetzt einloggen →</a>
          <p style="color:#6b6b80;font-size:12px;margin-top:24px">CreatorHub · Filapen GmbH · Diese E-Mail wurde automatisch versendet von noreply@mail.filapen.de</p>
        </div>
      </div>
    `
  })
}

// ── Creator einladen ───────────────────────────────────────────────────────
export async function sendCreatorInvite(to: string, name: string, code: string) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: 'Deine Creator-Einladung zu CreatorHub',
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#0a0a0f;color:#f0f0f5;border-radius:16px;overflow:hidden">
        <div style="background:linear-gradient(135deg,#7c3aed,#c8f035);padding:32px;text-align:center">
          <h1 style="margin:0;font-size:28px;color:#0a0a0f;font-weight:900">CREATOR<span>HUB</span></h1>
        </div>
        <div style="padding:32px">
          <h2 style="color:#c8f035;margin-top:0">Hey ${name}! ⭐</h2>
          <p style="color:#a0a0b8;line-height:1.6">Du wurdest als Creator eingeladen. Mit deinem persönlichen Code kannst du deine Videos eintragen.</p>
          <div style="background:#13131c;border:1px solid #2a2a3a;border-radius:12px;padding:24px;margin:20px 0;text-align:center">
            <p style="margin:0 0 8px;color:#6b6b80;font-size:12px;text-transform:uppercase;letter-spacing:1px">Dein persönlicher Code</p>
            <p style="margin:0;font-size:36px;font-weight:900;color:#c8f035;letter-spacing:6px">${code}</p>
          </div>
          <a href="${APP_URL}/creator" style="display:inline-block;background:#c8f035;color:#0a0a0f;font-weight:700;padding:14px 28px;border-radius:10px;text-decoration:none;margin-top:8px">Zum Creator-Portal →</a>
          <p style="color:#6b6b80;font-size:12px;margin-top:24px">CreatorHub · Filapen GmbH · Diese E-Mail wurde automatisch versendet von noreply@mail.filapen.de</p>
        </div>
      </div>
    `
  })
}

// ── Admins bei neuem Link benachrichtigen ──────────────────────────────────
export async function notifyAdminsNewLink(creatorName: string, linkTitle: string, linkUrl: string) {
  await resend.emails.send({
    from: FROM,
    to: ADMIN_EMAILS,
    subject: `Neues Video – ${creatorName}`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#0a0a0f;color:#f0f0f5;border-radius:16px;overflow:hidden">
        <div style="background:linear-gradient(135deg,#7c3aed,#c8f035);padding:32px;text-align:center">
          <h1 style="margin:0;font-size:28px;color:#0a0a0f;font-weight:900">CREATOR<span>HUB</span></h1>
        </div>
        <div style="padding:32px">
          <h2 style="color:#c8f035;margin-top:0">Neue Videos verfügbar – bitte prüfen</h2>
          <p style="color:#a0a0b8;line-height:1.6"><strong style="color:#f0f0f5">${creatorName}</strong> hat einen neuen Link eingetragen:</p>
          <div style="background:#13131c;border:1px solid #2a2a3a;border-radius:12px;padding:20px;margin:20px 0">
            <p style="margin:0 0 6px;color:#6b6b80;font-size:12px;text-transform:uppercase;letter-spacing:1px">Bezeichnung</p>
            <p style="margin:0 0 16px;font-size:16px;font-weight:600">${linkTitle}</p>
            <p style="margin:0 0 6px;color:#6b6b80;font-size:12px;text-transform:uppercase;letter-spacing:1px">Link</p>
            <a href="${linkUrl}" style="color:#c8f035;word-break:break-all">${linkUrl}</a>
          </div>
          <a href="${linkUrl}" style="display:inline-block;background:#c8f035;color:#0a0a0f;font-weight:700;padding:14px 28px;border-radius:10px;text-decoration:none">Video öffnen →</a>
          <p style="color:#6b6b80;font-size:12px;margin-top:20px">CreatorHub · Automatische Benachrichtigung · noreply@mail.filapen.de</p>
        </div>
      </div>
    `
  })
}
