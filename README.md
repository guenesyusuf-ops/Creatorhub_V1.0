# CreatorHub – Deployment Anleitung

## Schritt 1: Supabase Datenbank aufsetzen

1. Gehe zu https://supabase.com und logge dich ein
2. Öffne dein Projekt → klicke links auf **SQL Editor**
3. Kopiere den kompletten Inhalt der Datei `schema.sql`
4. Füge ihn in den SQL Editor ein und klicke **Run**
5. Die Datenbank ist jetzt bereit ✓

---

## Schritt 2: Resend Domain verifizieren (für echte E-Mails)

1. Gehe zu https://resend.com → **Domains** → **Add Domain**
2. Füge `filapen.de` hinzu und verifiziere die DNS-Einträge
3. Danach in `lib/email.ts` die Zeile ändern:
   ```
   const FROM = 'CreatorHub <noreply@filapen.de>'
   ```
   (vorher war es die Resend Test-Domain)

---

## Schritt 3: Auf Vercel deployen

1. Gehe zu https://vercel.com → **Add New Project**
2. Wähle **"Import Git Repository"** → oder zippe diesen Ordner und nutze **"Deploy from ZIP"** falls kein GitHub vorhanden
3. Bei den **Environment Variables** füge folgendes ein:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | deine Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | dein Supabase Anon Key |
| `RESEND_API_KEY` | dein Resend API Key |
| `ADMIN_EMAILS` | marketing@filapen.de,kris@filapen.de,mazlum@filapen.de |
| `NEXT_PUBLIC_APP_URL` | https://deine-app.vercel.app (nach dem ersten Deploy eintragen) |
| `JWT_SECRET` | ein zufälliger langer String (z.B. `creatorhub-super-secret-2024-xyz`) |

4. Klicke **Deploy**

---

## Schritt 4: Erster Login

- URL: `https://deine-app.vercel.app/login`
- E-Mail: `marketing@filapen.de`
- Passwort: `Admin1234!`
- Du wirst beim ersten Login **nicht** aufgefordert das Passwort zu ändern (da must_change_password=false gesetzt)

---

## Wie funktioniert was?

### Team-Mitglied einladen
1. Dashboard → Team → "+ Mitglied einladen"
2. Name, E-Mail, Rolle (Lesen / Admin) auswählen
3. Die Person bekommt eine E-Mail mit einem temporären Passwort
4. Beim ersten Login muss sie ein neues Passwort setzen

### Creator einladen
1. Dashboard → Creator-Karte → "📧 Als Creator einladen"
2. E-Mail der Creatorin eingeben
3. Sie bekommt einen 8-stelligen Code per E-Mail
4. Sie logt sich unter `/creator` mit dem Code ein
5. Sie sieht **nur ihren eigenen Ordner** und kann Links eintragen

### Admin-Benachrichtigung
- Sobald eine Creatorin einen Link einträgt, bekommen alle Admin-E-Mails automatisch eine Nachricht:
  - Betreff: `Neues Video [Name der Creatorin]`
  - Inhalt: Link + "Neue videos verfügbar bitte prüfen"

---

## Lokale Entwicklung (optional)

```bash
npm install
npm run dev
```

Öffne http://localhost:3000
