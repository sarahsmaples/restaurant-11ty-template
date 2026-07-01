# Post-Deploy Checklist

QA pass to run **after** deploying, against the **live** site. It fetches the
production URL and verifies the deployed result matches the source.

## How to use

Tell Claude: **"Run the post-deploy checklist."**

**Rules for Claude:**
- First, read **`client.domain`** from `src/_data/client.js` — this is the base
  URL for every check below. Substitute it for `{domain}` throughout.
- Use WebFetch for each check against the live site.
- Produce a results table with three states: **✅ Pass**, **❌ Fail**,
  **⚠️ Needs review** — each with the evidence (status code, the value found).
- **Report only — do not modify any files.** After the table, list recommended
  fixes for the user to approve.

---

## 1. Site is live

- [ ] Fetch `{domain}/` → HTTP 200, HTML renders.
- [ ] The rendered `<title>` contains the correct restaurant name (matches
      `client.name`).
- [ ] Fetch `{domain}/menus/` → HTTP 200.

## 2. Live meta & social

- [ ] The live `<title>`, `description`, and `canonical` match the client and
      use `{domain}`.
- [ ] `og:title`, `og:description`, `og:url`, and `og:image` are present in the
      live HTML.
- [ ] `og:image` is an **absolute** URL and is **reachable** — fetch it → 200.
- [ ] **Manual (note in report):** run `{domain}` through the
      [Google Rich Results Test](https://search.google.com/test/rich-results)
      and a social-share debugger (e.g. Facebook Sharing Debugger) to confirm
      the preview renders.

## 3. Live structured data

- [ ] Fetch `{domain}/`, extract the `application/ld+json` block, and confirm it
      parses as valid JSON.
- [ ] Every URL inside the schema (`url`, `logo`) resolves to `{domain}` — no
      `example.com` or placeholder values.

## 4. Google Analytics (live)

- [ ] The live HTML for `{domain}/` includes the gtag script
      (`googletagmanager.com/gtag/js?id=…`) with the real measurement ID.
- [ ] **Manual (note in report):** confirm a hit appears in GA Realtime after
      loading the page.

## 5. Sitemap & robots (live)

- [ ] Fetch `{domain}/sitemap.xml` → 200 and confirm it parses as valid XML
      (well-formed `<urlset>` with `<url>` entries).
- [ ] Every `<loc>` URL uses the production `{domain}` — no `www.example.com`,
      `localhost`, or other placeholder hosts.
- [ ] **Fetch every `<loc>` URL in the sitemap and confirm each returns 200**
      (no 404/redirect to a dead page). Report any that fail.
- [ ] The sitemap covers all live pages — at minimum the homepage (`{domain}/`)
      and the menu page (`{domain}/menus/`). Flag any published page missing
      from the sitemap.
- [ ] `<lastmod>` dates (if present) are sane — not in the future.
- [ ] Fetch `{domain}/robots.txt` → 200; the `Sitemap:` line points to
      `{domain}/sitemap.xml` (and that URL is the one verified above).

## 6. Dead links & assets

- [ ] Extract all `<a href>` links from the live homepage, fetch each, and
      report any non-200. **Log how many links were checked** (cap if large).
- [ ] Extract asset URLs (`<img>`, CSS, JS) from the homepage, fetch each, and
      report any non-200 (missing images / broken assets).
- [ ] `{domain}/assets/css/styles.css` → 200.
- [ ] `{domain}/assets/js/main.js` → 200.

## 7. Render & integration spot-checks

- [ ] `{domain}/assets/images/og-image.webp` → 200.
- [ ] `{domain}/assets/images/logo.png` → 200.
- [ ] A few gallery images (e.g. `/assets/images/gallery/g1.jpg`) → 200.
- [ ] The 88restaurants ordering iframe URL
      (`https://88restaurants.com/{client.id}/online_orders/frame`) loads.
- [ ] The site is served over **HTTPS**.
- [ ] **Manual (note in report):** open `{domain}` in a browser and confirm it
      renders with no console errors.

---

## Recommended fixes

After running, Claude lists here every ❌ Fail and ⚠️ Needs review item with a
concrete suggested fix, for the user to approve.
