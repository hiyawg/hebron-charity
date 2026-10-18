# Hebron Charity — website

Static site, no build step and no dependencies. Hosted on Vercel from the `main`
branch of `hiyawg/hebron-charity` at https://www.hebcharty.com.

## Pages

| URL | File |
|---|---|
| `/` | `index.html` |
| `/about`, `/impact`, `/accountability`, `/partner`, `/gallery`, `/privacy` | `<name>.html` |
| `/projects/<slug>` | `projects/<slug>.html` (five project pages) |
| not found | `404.html` |

`vercel.json` turns on clean URLs (`/about` serves `about.html`). Shared styles are in
`styles.css` (colours and fonts are the variables at the top) and behaviour is in
`script.js`. The header and footer are repeated in every page: change all of them together.

## Placeholders

Information the organisation still has to supply is marked in the pages as
`<div class="todo">…</div>` (shown as a dashed "To be provided" box) or
`<span class="tbc">To confirm</span>`. Search for `class="todo"` and `class="tbc"` to find them.
Do not replace them with invented figures, names or registration details.

## Inquiry form

`/partner` has no backend. It validates the form and builds a WhatsApp message to
+251 924 401 884 that the visitor sends themselves; nothing is stored by the site.

## Photos

Put photos in `images/`. Do not publish photos in which girls receiving feminine
hygiene products can be identified.

## Preview locally

Clean URLs need a server that maps `/about` to `about.html`; with plain
`python3 -m http.server 8080`, open the `.html` files directly
(e.g. http://localhost:8080/about.html).

## Search engines

`sitemap.xml` and `robots.txt` are in the root. Add new pages to `sitemap.xml`.
