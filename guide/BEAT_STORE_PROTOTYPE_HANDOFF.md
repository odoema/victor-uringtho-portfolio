# Beat Store Prototype — Implementation Handoff

## What was done (isolated, no live changes)

1. **Development Google Sheet created**
   - Name: Victor Portfolio Dev — Beats Catalogue
   - Folder: Victor Portfolio Dev
   - Link: https://docs.google.com/spreadsheets/d/15USt3XZHz7EOMRXqOf-3jgAmkECNKyOu3MB3tcFzLSc/edit
   - Tabs: _DEV_NOTES, BEATS (schema + 1 test row), LICENSE_TERMS (draft reference)
   - Live CMS sheet is untouched.

2. **BEATS schema (as requested)**
   id, title, slug, genre, bpm, musical_key, mood, description,
   preview_url, mp3_file_ref, wav_file_ref,
   nonexclusive_price_ugx / _usd, exclusive_price_ugx / _usd,
   nonexclusive_terms, exclusive_terms,
   status, visible, featured, order, tags, notes

3. **One test beat**
   - id: beat-test-001
   - Title: Test Groove (Dev Only)
   - Preview uses an existing public instrumental from the site (UI/player only).
   - mp3_file_ref / wav_file_ref are private placeholders only.
   - Prices aligned with live CMS PRICING (Basic 200k / Exclusive 1.5M).
   - status = available

4. **Static storefront prototype**
   - File: guide/beats-storefront-prototype.html
   - Shows beat card, audio preview, non-exclusive vs exclusive prices, enquire actions.
   - Checkout is a test dialog only — no payment, no file delivery, no email.
   - Exclusive path is disabled when status indicates sold/reserved.

5. **Licensing rule encoded in notes and UI**
   - Exclusive completion must set status so the beat is no longer offered.
   - Existing non-exclusive rights are not automatically erased; they must be addressed in the exclusive agreement.

## What was deliberately NOT done

- No push to main / no change to live GitHub Pages.
- No change to the original Portfolio CMS spreadsheet.
- No redeploy or permission change on the production Apps Script web app.
- No real masters uploaded or made public.
- No real payment integration.
- No subscription / recurring billing.

## Recommended next code steps (on branch feature/beat-store-prototype)

1. Add BEATS to SCHEMA in src/Code.gs (public, not in PRIVATE_SHEETS). See guide/BEATS_SCHEMA_PATCH.txt.
2. Optionally extend the client renderer (Scripts.html) or keep the standalone prototype until a test deployment exists.
3. Create a *separate* Apps Script test deployment that:
   - Uses the Dev Beats spreadsheet (or a full copy of the CMS that includes the BEATS tab).
   - Is never pointed at the production web-app URL used by victoruringtho.com.
4. Wire the prototype (or a /beats route on the branch) to that test JSON feed.
5. Only after Victor confirms terms and one real test purchase flow: merge and promote carefully.

## How to verify the first stage works

- [x] Existing album tracks and website pages remain unchanged (live site not touched).
- [x] Test beat can be added/edited in the development spreadsheet.
- [x] Storefront prototype reads the catalogue shape without exposing private CMS data.
- [x] Preview audio works; full-resolution refs stay private placeholders.
- [x] Non-exclusive and exclusive prices display; exclusive sale path can disable availability via status.
- [x] No real payment collected.

Subscriptions should wait until individual licensing + payment verification + secure delivery are proven.
