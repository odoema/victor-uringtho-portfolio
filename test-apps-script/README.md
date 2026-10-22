# Isolated BEATS test Apps Script project

This folder holds the **source** for a brand-new Apps Script project used only for the beat-store JSON feed.

It is **not** the production Unyuthfua project (`scriptId` in `.clasp.json`).

## Spreadsheet binding

- Development sheet only: `15USt3XZHz7EOMRXqOf-3jgAmkECNKyOu3MB3tcFzLSc`
- Script Property `SHEET_ID` must point at that id (helper: `setupTestSheetId()`).

## Public JSON contract

`GET .../exec?format=json` returns:

```json
{
  "meta": { "project": "beat-store-test", "generated": "...", "source": "dev-sheet", "count": N },
  "BEATS": [ { approved fields only } ]
}
```

**Included:** id, title, slug, genre, bpm, musical_key, mood, description, preview_url, prices, status, featured, order, tags  

**Never included:** mp3_file_ref, wav_file_ref, notes, nonexclusive_terms, exclusive_terms (full text kept server-side / sheet only), sold/reserved/draft/placeholder rows.

## Create & deploy (separate project — do not touch production)

1. Open the **dev** spreadsheet:  
   https://docs.google.com/spreadsheets/d/15USt3XZHz7EOMRXqOf-3jgAmkECNKyOu3MB3tcFzLSc/edit
2. **Extensions → Apps Script**  
   This creates a **new bound project** (separate from production clasp project).
3. Rename the project (top left) to: `Victor Beats Store TEST`
4. Delete any default `Code.gs` content and paste the contents of `Code.gs` from this folder.
5. (Optional) File → Project settings → paste `appsscript.json` values, or leave defaults; timezone Africa/Kampala is preferred.
6. In the editor, select function `setupTestSheetId` → **Run** → approve permissions (spreadsheet access).
7. Select function `debugSheetTabs` → **Run** → confirm `has_BEATS: true`.
8. Select function `debugPublicJson` → **Run** → confirm one test beat and **no** `mp3_file_ref` / `wav_file_ref` / `notes`.
9. **Deploy → New deployment → Web app**
   - Description: `beats-test-v1`
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Deploy → copy the Web app URL
10. Open `WEB_APP_URL?format=json` in a private window and verify JSON.

**Do not** open the production project, change its deployments, or set SHEET_ID to the live CMS id.

## After verification

Only then wire the storefront prototype to this test URL (not the production feed).
