import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'Filapen Team <noreply@mail.filapen.de>'
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim())
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

// ── Creator einladen ───────────────────────────────────────────────────────
export async function sendCreatorInvite(to: string, name: string, code: string) {
  const loginLink = `${APP_URL}/creator?code=${code}`
  
  await resend.emails.send({
    from: FROM,
    to,
    subject: 'Creator Hub Filapen',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e8e8ec;border-radius:16px;overflow:hidden">
        <div style="background:#111;padding:28px 32px;text-align:center">
          <div style="color:#ffffff;font-size:22px;font-weight:700;letter-spacing:1px">Filapen</div>
          <div style="color:#aaa;font-size:11px;letter-spacing:3px;margin-top:4px">CREATOR HUB</div>
        </div>
        <div style="padding:36px 32px">
          <p style="font-size:16px;color:#111;margin:0 0 20px">Liebe*r ${name},</p>
          <p style="font-size:15px;color:#333;line-height:1.7;margin:0 0 16px">
            wir freuen uns sehr, dich in unserem Creator-Team bei Filapen willkommen zu heißen!
          </p>
          <p style="font-size:15px;color:#333;line-height:1.7;margin:0 0 16px">
            Über den folgenden Link kannst du dich jederzeit ganz unkompliziert in dein persönliches Dashboard einloggen. 
            Dort hast du die Möglichkeit, deine erstellten Inhalte hochzuladen und weitere Funktionen zu nutzen.
          </p>
          <p style="font-size:15px;color:#333;line-height:1.7;margin:0 0 28px">
            Ein Passwort benötigst du nicht – der Zugriff erfolgt ganz einfach über den bereitgestellten Link.
          </p>
          <div style="text-align:center;margin:28px 0">
            <a href="${loginLink}" style="display:inline-block;background:#111;color:#fff;font-weight:700;font-size:15px;padding:16px 36px;border-radius:10px;text-decoration:none">
              Zum Creator Dashboard →
            </a>
          </div>
          <p style="font-size:13px;color:#888;line-height:1.6;margin:24px 0 0">
            Falls der Button nicht funktioniert, kopiere diesen Link in deinen Browser:<br>
            <a href="${loginLink}" style="color:#111;word-break:break-all">${loginLink}</a>
          </p>
          <p style="font-size:15px;color:#333;line-height:1.7;margin:28px 0 0">
            Bei Fragen stehen wir dir jederzeit gerne zur Verfügung.
          </p>
          <p style="font-size:15px;color:#333;line-height:1.7;margin:8px 0 0">
            Herzliche Grüße<br>
            <strong>Dein Filapen Team</strong>
          </p>
        </div>
        <div style="background:#f9f9fb;border-top:1px solid #e8e8ec;padding:16px 32px;text-align:center">
          <p style="font-size:12px;color:#aaa;margin:0">Filapen GmbH · Creator Hub · noreply@mail.filapen.de</p>
        </div>
      </div>
    `
  })
}

// ── Team-Mitglied einladen ─────────────────────────────────────────────────
export async function sendTeamInvite(to: string, name: string, password: string) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: 'Deine Einladung zu CreatorHub',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e8e8ec;border-radius:16px;overflow:hidden">
        <div style="background:#111;padding:28px 32px;text-align:center">
          <div style="color:#ffffff;font-size:22px;font-weight:700;letter-spacing:1px">Filapen</div>
          <div style="color:#aaa;font-size:11px;letter-spacing:3px;margin-top:4px">BUSINESS HUB</div>
        </div>
        <div style="padding:36px 32px">
          <h2 style="font-size:20px;font-weight:700;color:#111;margin:0 0 16px">Willkommen, ${name}! 👋</h2>
          <p style="font-size:15px;color:#333;line-height:1.7;margin:0 0 20px">Du wurdest zum Filapen Business Hub eingeladen. Hier sind deine Zugangsdaten:</p>
          <div style="background:#f9f9fb;border:1px solid #e8e8ec;border-radius:10px;padding:20px;margin:20px 0">
            <p style="margin:0 0 8px;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px">E-Mail</p>
            <p style="margin:0 0 16px;font-size:15px;font-weight:600;color:#111">${to}</p>
            <p style="margin:0 0 8px;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px">Temporäres Passwort</p>
            <p style="margin:0;font-size:24px;font-weight:700;color:#111;letter-spacing:4px">${password}</p>
          </div>
          <p style="color:#d97706;font-size:13px;margin:0 0 20px">⚠️ Du wirst beim ersten Login aufgefordert, dein Passwort zu ändern.</p>
          <div style="text-align:center">
            <a href="${APP_URL}/login" style="display:inline-block;background:#111;color:#fff;font-weight:700;font-size:15px;padding:14px 32px;border-radius:10px;text-decoration:none">Jetzt einloggen →</a>
          </div>
        </div>
        <div style="background:#f9f9fb;border-top:1px solid #e8e8ec;padding:16px 32px;text-align:center">
          <p style="font-size:12px;color:#aaa;margin:0">Filapen GmbH · Business Hub · noreply@mail.filapen.de</p>
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
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e8e8ec;border-radius:16px;overflow:hidden">
        <div style="background:#111;padding:28px 32px;text-align:center">
          <div style="color:#ffffff;font-size:22px;font-weight:700">Filapen Creator Hub</div>
        </div>
        <div style="padding:36px 32px">
          <h2 style="font-size:18px;color:#111;margin:0 0 16px">Neue Inhalte verfügbar</h2>
          <p style="font-size:15px;color:#333;line-height:1.7;margin:0 0 16px">
            <strong>${creatorName}</strong> hat neue Inhalte eingereicht:
          </p>
          <div style="background:#f9f9fb;border:1px solid #e8e8ec;border-radius:10px;padding:16px;margin:16px 0">
            <p style="margin:0 0 6px;color:#888;font-size:12px">Bezeichnung</p>
            <p style="margin:0 0 12px;font-size:15px;font-weight:600;color:#111">${linkTitle}</p>
            <a href="${linkUrl}" style="color:#111;word-break:break-all;font-size:13px">${linkUrl}</a>
          </div>
          <div style="text-align:center;margin-top:20px">
            <a href="${linkUrl}" style="display:inline-block;background:#111;color:#fff;font-weight:700;padding:12px 28px;border-radius:10px;text-decoration:none">Inhalte ansehen →</a>
          </div>
        </div>
        <div style="background:#f9f9fb;border-top:1px solid #e8e8ec;padding:16px 32px;text-align:center">
          <p style="font-size:12px;color:#aaa;margin:0">Filapen GmbH · Automatische Benachrichtigung</p>
        </div>
      </div>
    `
  })
}
