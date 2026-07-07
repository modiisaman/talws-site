# The Amazing Life Welfare Society — Website

A static, animated website for the NGO, built with plain HTML/CSS/JS, GSAP + Lenis for scroll animation, and Razorpay for donations.

## Files
- `index.html` — all page content/sections
- `styles.css` — design system (colors, type, layout)
- `script.js` — smooth scroll, scroll animations, gallery filter, donate flow, form handling

## Before you go live — placeholders to replace

Search the files for `[PLACEHOLDER]` comments. Specifically:

1. **Registration details** (`index.html`)
   - Registration number, 12A/80G status — in the About and Donate sections.

2. **Contact info** (`index.html`, Volunteer section)
   - Real email, phone number, address.

3. **WhatsApp chat button** (`index.html`, near the bottom)
   - Replace `91XXXXXXXXXX` in the `wa.me` link with your real WhatsApp Business number (country code + number, no `+` or spaces).

4. **Razorpay key** (`script.js`, in the `donateBtn` click handler)
   - Replace `rzp_test_XXXXXXXXXXXX` with your real Razorpay **Key ID** from your Razorpay dashboard.
   - Note: this is a client-side-only integration suitable for getting started / test mode. For production, Razorpay recommends creating the order on a backend (a small serverless function works fine on Netlify) and passing the `order_id` into the checkout options — this prevents amount tampering. Ask if you want that serverless function built.

5. **Gallery photos** (`index.html`, Gallery section)
   - Each `.gallery-item` currently has a colored placeholder block (`.gallery-ph`) with a label like "Add photo — Education". Replace these divs with real `<img>` tags once you have event photos, e.g.:
     ```html
     <img src="images/education-1.jpg" alt="Students receiving school kits" loading="lazy">
     ```

6. **Stats** (`index.html`, About section)
   - Replace `[NN]` placeholders with real numbers (drives held, families reached, volunteers).

7. **Body copy**
   - All copy marked with `<!-- [PLACEHOLDER copy] -->` is a reasonable draft — read through and adjust to match your real story and programme details.

## Deploying to Netlify

1. Drag the `ngo-site` folder onto [app.netlify.com/drop](https://app.netlify.com/drop), **or**
2. Push it to a GitHub repo and connect it in Netlify (Site settings → Build & deploy → Continuous deployment). No build command is needed since this is static HTML — set the publish directory to the repo root (or wherever `index.html` lives).

### Enabling the volunteer form
The form already has `data-netlify="true"` and a hidden honeypot field, which is all Netlify needs to auto-detect it. After your first deploy:
- Go to **Site settings → Forms** in Netlify to see submissions and set up email notifications.
- No extra code needed — Netlify Forms works automatically once the site is deployed there.

## Notes on the design
- Fonts (Fraunces, Work Sans, JetBrains Mono) load from Google Fonts via `<link>` tags — no local font files needed.
- GSAP, Lenis, and Razorpay's checkout script load from CDNs — an internet connection is required for full animation/payment functionality.
- Reduced-motion is respected: users with that OS setting see the content without animation.
