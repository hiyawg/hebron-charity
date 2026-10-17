# Hebron Church Generosity Department — website

A fast, responsive, single-page static site. No build step, no dependencies:
`index.html`, `styles.css`, `script.js` and the `images/` folder.

Content comes from *"HEBRON CHURCH GENEROSITY DEPARTMENT to Pas Bedlu.docx"*:
the five projects, their Bible verses and activities, the contact number and the
bank account details. The photos are the ones from that document.

## Before you go live

1. **Check the text.** Read every project once. One line was shortened:
   "Serving free breakfast by their own" now reads "Serving free breakfast".
2. **Use sharper photos if you have them.** The photos in the Word file are small
   (about 400 px wide), so they look slightly soft on large screens. Replace a file in
   `images/` with a larger original using the **same file name**, and it updates everywhere.
3. **Social sharing preview.** After deploying, change `og:image` in `index.html` to the
   full URL, e.g. `https://your-site.netlify.app/images/p2-meal.jpg`.
4. **Colours and fonts** are the variables at the top of `styles.css`.

## Preview locally

```bash
python3 -m http.server 8080
```
Then open http://localhost:8080

## Deploy (pick one, all free)

**Netlify (easiest):** go to https://app.netlify.com/drop and drag this whole folder in.
You get a live HTTPS link instantly; add your own domain under *Domain settings*.

**Vercel:**
```bash
npx vercel --prod
```

**GitHub Pages:** push this folder to a repo → *Settings → Pages* → deploy from `main`, root folder.

**Cloudflare Pages:** *Workers & Pages → Create → Pages → Upload assets*, then upload the folder.
