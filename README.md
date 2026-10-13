# Unyuthfua — Victor Uringtho Portfolio

Artist story, legacy and digital portfolio for **Victor Unyuthfua Uringtho**, a Ugandan music producer, songwriter, arranger and sound engineer.

Built as a **Google Apps Script web app**, with a **Google Sheet** as the content manager.

## Structure

```
src/                 Apps Script project (pushed with clasp)
  Code.gs            doGet, data layer, cache, contact form, Sheet menu, setup
  Seed.gs            Confirmed starting content from Victor's memoir
  Index.html         Page structure
  Styles.html        Design system
  Scripts.html       Client renderer, players, filters, search, animations
  Assets.html        Optional embedded images (photos live on Google Drive)
  Admin.html         "Content health" sidebar in the Sheet
  appsscript.json    Manifest
docs/               Public website served by GitHub Pages (generated — see below)
  index.html
  assets/            Photos + social share image
guide/
  SETUP_GUIDE.md     Full brief: name, IA, data model, design system, deployment, testing
  preview.html       Offline preview with placeholders highlighted (not published)
build_pages.js       Rebuilds docs/index.html from src/
.clasp.json          Links this repo to the live Apps Script project
```

## Editing content

Edit the **Victor Uringtho — Portfolio CMS** Google Sheet, then use **Portfolio → Publish changes**. You don't need to change any code.

## Editing code

```bash
npm install -g @google/clasp
clasp login
clasp pull     # get the latest from Apps Script
clasp push     # send local changes to Apps Script
```

After `clasp push`, go to **Deploy → Manage deployments → ✏️ → New version** to update the live site.

## Public website (GitHub Pages)

The public site is `docs/index.html`, served at **https://odoema.github.io/victor-uringtho-portfolio/**. It has no Google banner, includes social-preview tags and is visible to search engines.

- It reads live content from the Google Sheet through the Apps Script JSON feed. This needs the web app's access set to **Anyone**.
- If the feed isn't reachable, it falls back to a snapshot that was built in at build time.
- To rebuild after code changes, run `node build_pages.js`, then commit `docs/`.
- `docs/assets/` holds the photos and the 1200×630 social share image.
- To use a custom domain later, go to **Settings → Pages → Custom domain**.

## Data endpoint

Add `?format=json` to the web-app URL to get all public content as JSON. A future custom-domain front end can read the same Sheet through it.

---
© 2026 Victor Unyuthfua Uringtho. All rights reserved.
