# Victor Uringtho — Unyuthfua: Show Us Our Home
### Artist story, legacy and digital portfolio · Google Apps Script web app

---

## A. Project name

**Recommended name:** **UNYUTHFUA — The Story, Sound & Legacy of Victor Uringtho**
**Short form for the site and nav:** *Victor Uringtho*. **Tagline:** *Show us our home.*

**Why this name:** It comes straight from the source. In the memoir Victor says his middle name, *Unyuthfua*, means "Show us our home" in Alur. That phrase also fits the site's purpose, which is to show where he came from, what he built and where he is going. No other musician can use it, so the site can't read like a template. The memoir's own title, *A Journey of Faith, Passion and Music*, becomes the heading of the Story section.

## B. Positioning statement

> **Victor Uringtho is a Ugandan producer, arranger and sound engineer. He started on a guitar he made from a piece of wood, an old pan and motorcycle clutch wires, and has spent four decades turning other people's musical ideas into finished sound, in the studio and on stage.**

## C. Website copy

All of the copy lives in the Sheet. `Seed.gs` holds the first version, written from the memoir, and the Sheet is filled from it automatically. The chapters keep Victor's own first-person voice, lightly edited, because that is more honest than retelling his story in the third person.

| # | Chord | Chapter | Period |
|---|---|---|---|
| 01 | C | Show Us Our Home | 1973 |
| 02 | G7 | The Boy Who Made His Own Guitar | Childhood |
| 03 | F | First Chords in Nairobi | 1986 |
| 04 | D | A Guitar of My Own | c. 1988 |
| 05 | A | Growing Through Church and Fellowship | 1991–1995 |
| 06 | Am | The Anglican Youth Fellowship Band | 1995 |
| 07 | Em | Four Tracks in Wandegeya | c. 2000 |
| 08 | Dm | "Thank You Lord" — and Beyond | 2002–today |

**Signature device:** each chapter is marked with a chord diagram. The chords run in the order Victor learned them: Stephen taught him C, G7, F and D, then Peter taught him A, Am, Em and Dm.

---

## Content inventory — what the source confirms and what is missing

### 1. Confirmed from the memoir and the notes file
- **Identity:** Victor Unyuthfua Uringtho. Born 31 May 1973 in Kamuli. Alur by heritage, born in Busoga. Firstborn, with two brothers and two sisters. Parents: the late Edith Basirika Uringtho (nurse) and Fred Binego Uringtho (haematologist).
- **Roles:** music producer, songwriter, instrumentalist, arranger, recording and mixing engineer, live sound engineer.
- **Instruments:** guitar, keyboard/piano, drums, bass guitar.
- **Mentors:** Stephen Kasamba (first chords; bought him his first guitar in Germany), Peter Kasamba (the Sunday-school guitarist; more chords; AYF band), Patrick Kasamba (keyboard, swapped for guitar lessons), Arthur Mutesasira (keyboard).
- **Milestones:**
  - 1986: first chords, Nairobi (date from the notes file).
  - About two years later: a guitar of his own.
  - 1991–95: fellowship and church playing; picks up drums and bass.
  - 1995: joins the Anglican Youth Fellowship band.
  - c. 2000: first production, for Zephaniah Mukalere in Wandegeya. Gear: Roland XP-80 and a four-track tape recorder, later a Korg N264 and Akai DPS16.
  - 2002: album *Thank You Lord*.
  - UK study in rhythm programming, recording and production.
- **Artists and groups:** Isaiah Katumwa, Judith Babirye, Michael Kitanda, The Heralds, God's Image, Dove 7, plus choirs and solo artists.
- **Live sound:** Qwela Band, Zauka, Soul Beat, Code 9. Three Blankets & Wine events and two Roast & Rhyme events.
- **Remote work:** mixing and mastering for artists outside Uganda.
- **Philosophy and motivation:** quoted directly in the Legacy section.

### 2. Needs confirmation (shown on the site, but Victor should check)
- The year he got his own guitar. "c. 1988" is worked out from "two years later".
- The memoir says "He told me I was the first student he had taught who learned so quickly". It is unclear whether "he" means Stephen or Peter.
- **What exactly Victor did with each named artist** (produced, played, mixed or live sound). The memoir doesn't say. Their role tags are left as `[CONFIRM ROLE]`, so the public site shows the names without any role.
- His roles on *Thank You Lord*.
- His instrument in the AYF band.
- Where the "between sessions" photo was taken.

### 3. Content Victor can provide
- **Photos:** studio, live sound / front of house, the AYF band, events, and the homemade guitar (or an illustration of it). Only two real photos exist so far; the other "face" files are crops of the same portrait.
- **Album artwork and Spotify links:** *Thank You Lord* and every production credit.
- **The project title for Zephaniah Mukalere**, plus the title, artist and Victor's role for `victor_track.mp3`.
- **UK study:** year(s) and institution.
- **Event dates and venues:** Blankets & Wine and Roast & Rhyme.
- **His current band or project and any upcoming releases.** This is the biggest gap. The memoir describes his work today, but it doesn't name a current band.
- **Contact details:** email, phone/WhatsApp, the email that should receive enquiries, and social links.
- **Vocals:** whether to list them. The memoir doesn't mention them, so they are not shown yet.

**How to see every gap at any time:** use *Portfolio → Content health* in the Sheet.

---

## D. Information architecture

```
HOME (hero: name · meaning · roles · statement · 3 CTAs · six-string motif)
 ├─ IN NUMBERS        years since first chords · c.2000 first master · 2002 album · bands mixed live
 ├─ STORY  (TRK 01)   8 chord-marked chapters with pull quotes + photos
 │   └─ PEOPLE        mentors and first client
 ├─ MUSIC  (TRK 02)   archive cards → role tags → lazy Spotify/Drive/SoundCloud/YouTube player · filters
 ├─ ARTISTS (TRK 03)  cards · filter: Artists & Groups / Produced / Live Sound / Mix & Master
 ├─ BANDS  (TRK 04)   current band (highlighted, "NOW") + past/live-sound bands
 ├─ WORK   (TRK 05)   skills as console "channel strips", each with evidence · services
 ├─ EVENTS (TRK 06)   event cards (×3, ×2 editions) + masonry gallery + lightbox
 ├─ MILESTONES (TRK 07) animated timeline
 ├─ NEW CHAPTER (TRK 08) current projects · upcoming music
 ├─ LEGACY            what he has contributed, in his words
 └─ CONTACT           details · socials · enquiry form → Sheet + email
Global: sticky nav with scroll-spy and progress bar · "/" search across everything · mobile full-screen menu
```

**The "TRK" labels:** sections are labelled like tracks on a tape. This nods to the four-track recorder he started on.

## E. Data model (Google Sheets CMS)

The Sheet has one tab per content type, and each row is one item. Most tabs share these columns:
- **`visible`** (checkbox): hides a row without deleting it.
- **`order`**: sets the sort order on the page.
- **`status`**:
  - `confirmed` / `needs-confirmation`: shown on the public site.
  - `placeholder`: hidden from the public and shown only in preview.

| Tab | Columns |
|---|---|
| PROFILE | key, value, status, notes — keys: full_name, display_name, name_meaning, roles, hero_statement, positioning, born, heritage, first_chords_year, signature_quote, motivation_quote, lesson_quote, hero_image, email, phone, base_location, enquiry_inbox, share_image_url |
| CHAPTERS | order, id, chord, title, period, summary, body *(blank line = new paragraph)*, quote, image, image_caption, visible, status |
| MILESTONES | order, year, date_label, title, description, category, visible, status |
| MUSIC | order, id, type, title, artist, year, roles *(comma-separated)*, description, cover_image, spotify_url, youtube_url, audio_url, related_artist, related_band, related_chapter, featured, visible, status |
| ARTISTS | order, name, category, roles, project, year, image, spotify_url, story, visible, status |
| BANDS | order, name, relationship, period, role, description, members, image, is_current, visible, status |
| EVENTS | order, title, category, date, location, count, people, description, image, visible, status |
| PHOTOS | order, image, alt, caption, category, event, date, location, people, visible, status |
| SKILLS | order, group, skill, evidence, visible, status |
| PEOPLE | order, name, relationship, contribution, image, visible, status |
| PROJECTS | order, title, type, stage, description, image, link, visible, status |
| SERVICES | order, service, description, visible, status |
| SOCIAL_LINKS | order, platform, url, label, visible, status |
| ENQUIRIES | timestamp, name, email, enquiry_type, message *(private — never sent to the browser)* |

**Placeholder text:** any text containing `[ADD …]` or `[CONFIRM …]` is removed from the public page automatically. Only the preview link highlights it.

## F. Visual design system

The idea is a studio at night, a sepia photograph, and brass and wire. Each part comes from Victor's story: the old pan (brass), the clutch-cable strings (fine lines), the tape machine (mono labels) and his sepia portraits.

- **Colour:**
  - Ink `#14110F` / `#1C1815` (backgrounds)
  - Paper `#EFE6D6` (text)
  - Brass `#C98D4B` / `#E4B57F` (accent)
  - Muted `#A99D8B`
  - Contrast is AA or better for body text.
- **Typography:**
  - **Fraunces** for display. The light weight is used for the name, with the surname in brass italic.
  - **Manrope** for body text.
  - **JetBrains Mono** for small "track labels" (kickers, tags, metadata).
  - Headings use fluid `clamp()` sizes.
- **Spacing:** a scale from `.25rem` to `7rem`. Sections get 5–9rem vertical padding, and the gutter is a 16px minimum on phones.
- **Buttons:** pill-shaped.
  - Primary is filled brass.
  - Ghost has a hairline border.
  - Text buttons have an arrow.
  - All of them lift by 2px on hover.
- **Cards:**
  - 14px radius with hairline borders; on hover they lift and the border turns brass.
  - Artist cards carry a large italic initial as a watermark.
  - Skills are shown as "channel strips", each with a glowing status LED and the moment the skill was earned. There are no percentage bars.
- **Album artwork:**
  - Square covers that zoom on hover.
  - When there's no artwork, the card shows a generated vinyl cover (title and year) that spins on hover.
  - Type badge top left; role tags below the title.
- **Photography:**
  - Light sepia treatment (`sepia(.2–.35)`); full colour on hover.
  - The hero photo has a slow zoom, a gradient scrim and film grain.
  - The gallery is a CSS-column masonry layout with a full-screen `<dialog>` lightbox (keyboard arrows, swipe, Esc).
- **Motion:**
  - The hero name slides up line by line.
  - Sections reveal on scroll with a staggered delay.
  - Counters count up, the timeline line fills as you scroll, and the hero has subtle parallax.
  - The **six guitar strings are "plucked"** on load and on hover.
  - All motion switches off under `prefers-reduced-motion`.
- **Responsive:**
  - Built for 360px phones first.
  - The nav collapses into a full-screen menu that opens with a circle-reveal animation.
  - Chapters change from a sticky side column to a stacked layout.
  - No horizontal scrolling at any width. This was tested at 390px and 1366px.

## G. Files

| File | Purpose |
|---|---|
| `Code.gs` | `doGet`, data layer + cache, placeholder filtering, contact form, Sheet menu, setup |
| `Seed.gs` | Confirmed starting content from the memoir (also the fallback if no Sheet) |
| `Index.html` | Page structure (semantic sections, nav, dialogs) |
| `Styles.html` | Full design system |
| `Scripts.html` | Renderer, players, filters, search, lightbox, animations |
| `Assets.html` | Two confirmed photos embedded (≈130 KB) so the site works on day one |
| `Admin.html` | "Content health" sidebar in the Sheet |
| `PREVIEW.html` | Local preview with placeholders highlighted, so you can see the site before deploying |

---

## H. Setup — step by step

1. Create a new **Google Sheet** at sheets.google.com and name it **Victor Uringtho — Portfolio CMS**.
2. In the Sheet, open **Extensions → Apps Script**. This creates a script attached to the Sheet.
3. Rename the project (top left) to **Unyuthfua — Victor Uringtho**.
4. Add `Code.gs`:
   1. Replace the contents of the default `Code.gs` with this project's **Code.gs**.
   2. Click **＋ → Script**, name it `Seed`, and paste in **Seed.gs**.
5. Add the HTML files. For each file in this list, click **＋ → HTML**, type the name exactly as shown (no `.html`; Apps Script adds it) and paste in the content:
   - `Index`
   - `Styles`
   - `Scripts`
   - `Assets`
   - `Admin`
6. Save with Ctrl+S.
7. Run the setup:
   1. Choose `setupPortfolio` in the function dropdown and click **Run**.
   2. Approve the permissions (Google warns that the app is unverified because it's your own script; click **Advanced → Go to project**).
   3. When it finishes, the Sheet has 14 tabs filled with the confirmed content, and a toast shows your **preview key**.
8. Reload the Sheet. A **Portfolio** menu appears.

## I. Editing content in Google Sheets

- **To change content:** edit any cell, then click **Portfolio → Publish changes**. The site caches content for 10 minutes; Publish clears that cache straight away.
- **To add a song or album:** add a row to **MUSIC**.
  - Give it a unique `id`.
  - Choose a `type`: Album, Single, EP, Track, Project or Live recording.
  - List `roles` separated by commas (for example `Produced, Mixed, Keyboards`).
  - Paste a `spotify_url`.
  - Set `status` to `confirmed`.
- **To show a band as the current band:** tick `is_current` on its row in **BANDS**. It then appears highlighted with a "NOW" badge.
- **To fill the gaps:** use **Portfolio → Content health**, which lists every `[ADD …]` cell by tab and row.
- **To see the draft:** use **Portfolio → Show my preview link key**, then open `…/exec?preview=KEY`. Placeholders appear highlighted in yellow.
- **For other tools:** `…/exec?format=json` returns all public content as JSON. A future custom-domain site, EPK or app can read it.

## J. Spotify (and other audio)

1. On Spotify, open the album or track, then choose **Share → Copy link to album/track**.
2. Paste the link (for example `https://open.spotify.com/album/…`) into `spotify_url`. The site converts it to the official embed by itself.

**How the players behave:**
- Players are **lazy-loaded**: nothing loads from Spotify until the visitor taps **Play**. This keeps the page fast on mobile data.
- No API keys or credentials are used. If you later want Spotify statistics, that needs a server-side call from `Code.gs`, with the client secret stored in **Project Settings → Script properties** and never in the HTML.
- **Order of preference** when a row has more than one link: Spotify, then `audio_url`, then YouTube.
- **`audio_url` accepts:**
  - a Google Drive file link, played through Drive's player;
  - a SoundCloud link;
  - a direct `.mp3` link.
- **For `victor_track.mp3`:**
  1. Upload it to Drive.
  2. Set it to **Share → Anyone with the link → Viewer**.
  3. Paste the link into the MUSIC row, add the title, artist and role, and set status to `confirmed`.

## K. Images

- **Recommended storage:** a Drive folder called *Victor Portfolio Images*, shared as **Anyone with the link → Viewer**.
- **Before uploading:** resize to about 1600px on the long edge, JPEG at roughly 75% quality, about 150–300 KB each.
- **What the `image` field accepts:** the Drive share link, the bare file ID, any public image URL, or `asset:portrait` / `asset:casual` for the two embedded photos.
- **How they are served:** Drive images go through `lh3.googleusercontent.com` at the right width (700px thumbnails, 1600px in the lightbox). They lazy-load and decode asynchronously.
- **Alt text:** always fill the `alt` column in PHOTOS. Screen readers and search engines rely on it.
- **To change the hero photo:** in PROFILE, set `hero_image` to the new image. A landscape performance or studio shot will work best.

## L. Deployment

1. In the Apps Script editor, click **Deploy → New deployment**.
2. Click the gear icon and choose **Web app**.
3. Set **Description** to *v1*.
4. Set **Execute as** to *Me*. This lets the site read the Sheet and save enquiries.
5. Set **Who has access** to **Anyone**.
6. Click **Deploy** and copy the **Web app URL** (`https://script.google.com/macros/s/…/exec`). That is the website.
7. **After changing code:** go to **Deploy → Manage deployments → ✏️ → Version: New version → Deploy**. The URL stays the same. Content edits in the Sheet don't need a redeploy; just use **Publish changes**.
8. Optional: in PROFILE, set `enquiry_inbox` to an email address so each form message is also emailed. Messages are always saved in the **ENQUIRIES** tab either way.

**Honest limits of Apps Script hosting:**
- The URL is long.
- Google shows a small banner on the page.
- Search engines and WhatsApp/Facebook link previews **can't read the page's meta and Open Graph tags**, because Google serves the page inside its own wrapper.

**For SEO and a short address, there are two upgrades:**
- **Quick:** embed the web app in a free **Google Site** with a custom domain (this is why `ALLOWALL` is set).
- **Best:** host the same `Index`/`Styles`/`Scripts` on a custom domain (Netlify, GitHub Pages or Firebase) and have them read `…/exec?format=json`. The Sheet stays the CMS and nothing needs rebuilding.

## M. Testing checklist

| Area | Check |
|---|---|
| Mobile | 360 px & 390 px: no sideways scroll; menu opens/closes, Esc closes; tap targets ≥ 42 px |
| Desktop | 1366 & 1920 px: nav highlights current section; progress bar moves |
| Animations | Hero name slides in; sections reveal; counters run; strings pluck; turn on OS "reduce motion" → everything static and visible |
| Images | Drive images load when shared "Anyone with link"; lightbox opens, arrows/swipe/Esc work |
| Spotify/audio | Play button swaps in the embed; album = tall player, track = compact; Drive audio plays |
| Filters | Music by type/role, Artists by category, Photos by category; "All" resets |
| Search | Press `/`; type "1995", "Zauka", "Kasamba" → results jump to section |
| Sheet data | Edit a cell → Publish changes → reload shows it; untick `visible` hides the row; `placeholder` rows hidden publicly, visible in `?preview=KEY` |
| Contact | Invalid email rejected; valid enquiry lands in ENQUIRIES (+ email if set); honeypot blocks bots |
| Performance | First load on 3G: text visible immediately (data is inlined, no spinner); players load only on tap |
| Accessibility | Tab through: skip link, visible focus rings, dialogs trap focus; headings in order; all images have alt |

**Already verified while building:**
- Rendered with headless Chromium at 1366px and 390px.
- No JavaScript errors.
- No horizontal overflow.
- Public mode hides every placeholder.
- Preview mode shows all of them.

## Future expansion (the foundation is already in place)

The JSON endpoint, the separate tabs and the per-row `status` field make each of these an additional tab or section rather than a rebuild:
- an EPK or downloadable press kit (a PRESS tab with PDF links);
- upcoming events (EVENTS with future dates);
- YouTube video wall;
- newsletter sign-up (same pattern as ENQUIRIES);
- artist CV page;
- booking calendar.
