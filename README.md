# Janak & Rajni — Floral Baby Shower Invitation

A mobile-friendly animated invitation with countdown, venue map, calendar link, RSVP, baby prediction poll and sharing. No build tools required.

## Publish on GitHub Pages

1. Create a **public** GitHub repository named `baby-shower-invitation`.
2. Upload `index.html`, `style.css`, `script.js` and `preview.jpg` to the repository root (not inside another folder).
3. Go to **Settings → Pages → Build and deployment**, choose **Deploy from a branch**, select `main` and `/(root)`, and save.
4. Visit `https://YOURUSERNAME.github.io/baby-shower-invitation/` once deployment completes.
5. **Important:** In `index.html`, replace `YOURUSERNAME` in the `og:image` URL with your actual GitHub username. For a custom domain, update the entire `og:image` URL to the public HTTPS image location.
6. Share the deployed URL on WhatsApp. WhatsApp preview caching may delay image changes. The preview image must be publicly accessible.

## How RSVPs and poll responses work

The RSVP and poll forms are **functional WhatsApp message composers**: submitting opens WhatsApp with a prefilled response. **The guest must select the host/family recipient and tap Send**. The site itself does **not** store responses or display shared poll totals. This is intentional: GitHub Pages is static hosting and cannot securely save responses on its own.

For **automatic Google Sheets collection**, create a Google Form with name, attendance, guest count, note, and prediction fields, link its responses to Google Sheets, then replace the WhatsApp form submit behavior with the published form link or integrate a verified form endpoint. Do not paste private credentials or API keys into frontend JavaScript.

## Customize

- Event date/time: `script.js` → `eventDate` (timezone `+05:30`).
- Display text and venue: `index.html`.
- Map URL: `index.html` → Google Maps search link. Confirm the pin for the exact location.
- Calendar event: `script.js` → `start`, `end` (the default end of 2:30 PM is only a placeholder; update if desired).
- Colors: `style.css` → `:root`.
- Preview: replace `preview.jpg` with your preferred 1200 × 630 image.
- Fonts load from Google Fonts; system fallback fonts are provided if offline.

## Test

Open `index.html` in a browser to preview. Share/clipboard features work best over HTTPS once published. RSVP/poll WhatsApp links require WhatsApp or WhatsApp Web access.
