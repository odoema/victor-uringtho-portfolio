/**
 * ============================================================================
 *  UNYUTHFUA — The Story, Sound & Legacy of Victor Uringtho
 *  Google Apps Script Web App  ·  Code.gs (server)
 * ----------------------------------------------------------------------------
 *  Architecture
 *    Google Sheet (CMS)  →  Code.gs reads + caches  →  Index.html template
 *    (content lives in    (filters placeholders,      (Styles + Scripts +
 *     13 tabs)             strips private fields)       Assets included)
 *
 *  Entry points
 *    doGet(e)                 – the website
 *    doGet(e) ?format=json    – the same content as JSON (for a future
 *                               custom-domain front end, EPK, app, etc.)
 *    doGet(e) ?preview=KEY    – shows every [ADD …] placeholder highlighted
 *    setupPortfolio()         – run ONCE: builds the CMS tabs + seed content
 *    onOpen()                 – adds the "Portfolio" menu to the Sheet
 *    submitEnquiry(form)      – contact form → ENQUIRIES tab (+ email)
 * ============================================================================
 */

var CONFIG = {
  SITE_TITLE: 'Victor Uringtho — Unyuthfua: Show Us Our Home',
  SITE_DESCRIPTION:
    'Ugandan music producer, songwriter, arranger, recording & mixing engineer and live sound engineer. ' +
    'A journey of faith, passion and music that began with a homemade guitar.',
  CACHE_KEY: 'vu_portfolio_v1',
  CACHE_SECONDS: 600,            // 10 minutes; "Publish changes" clears it instantly
  PLACEHOLDER_RE: /\[(ADD|CONFIRM)[^\]]*\]/i
};

/* ---------------------------------------------------------------------------
 *  Sheet schema — one tab per content type, one row per item.
 *  Column order here is the column order created in the Sheet.
 * ------------------------------------------------------------------------- */
var SCHEMA = {
  PROFILE:      ['key', 'value', 'status', 'notes'],
  CHAPTERS:     ['order', 'id', 'chord', 'title', 'period', 'summary', 'body', 'quote', 'image', 'image_caption', 'visible', 'status'],
  MILESTONES:   ['order', 'year', 'date_label', 'title', 'description', 'category', 'visible', 'status'],
  MUSIC:        ['order', 'id', 'type', 'title', 'artist', 'year', 'roles', 'description', 'cover_image', 'spotify_url', 'youtube_url', 'audio_url', 'related_artist', 'related_band', 'related_chapter', 'featured', 'visible', 'status'],
  ARTISTS:      ['order', 'name', 'category', 'roles', 'project', 'year', 'image', 'spotify_url', 'story', 'visible', 'status'],
  BANDS:        ['order', 'name', 'relationship', 'period', 'role', 'description', 'members', 'image', 'is_current', 'visible', 'status'],
  EVENTS:       ['order', 'title', 'category', 'date', 'location', 'count', 'people', 'description', 'image', 'visible', 'status'],
  PHOTOS:       ['order', 'image', 'alt', 'caption', 'category', 'event', 'date', 'location', 'people', 'visible', 'status'],
  SKILLS:       ['order', 'group', 'skill', 'evidence', 'visible', 'status'],
  PEOPLE:       ['order', 'name', 'relationship', 'contribution', 'image', 'visible', 'status'],
  PROJECTS:     ['order', 'title', 'type', 'stage', 'description', 'image', 'link', 'visible', 'status'],
  SERVICES:     ['order', 'service', 'description', 'visible', 'status'],
  SOCIAL_LINKS: ['order', 'platform', 'url', 'label', 'visible', 'status'],
  PRICING:      ['order', 'service', 'item', 'prefix', 'price_ugx', 'price_usd', 'unit', 'details', 'highlight', 'visible', 'status'],
  SPONSORS:     ['order', 'name', 'slot', 'tagline', 'logo', 'link', 'start', 'end', 'visible', 'status'],
  UPRS_WORKS:   ['order', 'title', 'album', 'year', 'duration', 'writers_composers', 'splits', 'performers', 'isrc', 'uprs_status', 'notes'],
  ENQUIRIES:    ['timestamp', 'name', 'email', 'enquiry_type', 'message'],
  FANS:         ['timestamp', 'name', 'contact', 'interests', 'source'],
  STATS:        ['date', 'visits', 'from_social', 'from_search', 'from_other', 'sponsor_clicks', 'signups', 'enquiries'],
  WEEKLY_POSTS: ['week_of', 'day', 'theme', 'post']
};

// never sent to the browser
var PRIVATE_SHEETS = { ENQUIRIES: true, UPRS_WORKS: true, FANS: true, STATS: true, WEEKLY_POSTS: true };
var SITE_URL = 'https://odoema.github.io/victor-uringtho-portfolio/';

/* ===========================================================================
 *  WEB APP
 * ========================================================================= */
function doGet(e) {
  var p = (e && e.parameter) || {};
  var preview = isPreview_(p.preview);
  var data = getPortfolio_(preview);

  if (p.format === 'json') {
    return ContentService.createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var t = HtmlService.createTemplateFromFile('Index');
  t.dataJson = safeJson_(data);
  t.preview = preview;
  t.siteTitle = CONFIG.SITE_TITLE;
  t.siteDescription = CONFIG.SITE_DESCRIPTION;

  return t.evaluate()
    .setTitle(CONFIG.SITE_TITLE)
    .setFaviconUrl('https://odoema.github.io/victor-uringtho-portfolio/assets/brand/favicon-32.png')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, viewport-fit=cover')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL); // allows embedding in Google Sites
}

/** <?!= include('Styles') ?> inside templates. */
function include(name) {
  return HtmlService.createHtmlOutputFromFile(name).getContent();
}

/* ===========================================================================
 *  DATA LAYER
 * ========================================================================= */

/** Returns the whole portfolio as { PROFILE:{key:value}, CHAPTERS:[…], … }. */
function getPortfolio_(preview) {
  var cache = CacheService.getScriptCache();
  var key = CONFIG.CACHE_KEY + (preview ? '_p' : '');
  var hit = cache.get(key);
  if (hit) return JSON.parse(hit);

  var raw = readAll_();
  var out = { meta: { preview: preview, generated: new Date().toISOString(), source: raw._source } };

  Object.keys(SCHEMA).forEach(function (name) {
    if (PRIVATE_SHEETS[name]) return;
    var rows = raw[name] || [];
    if (name === 'PROFILE') {
      var prof = {};
      rows.forEach(function (r) {
        if (!r.key) return;
        if (!preview && isPlaceholder_(r.value)) return;
        prof[String(r.key).trim()] = r.value;
      });
      out.PROFILE = prof;
      return;
    }
    out[name] = rows
      .filter(function (r) { return r.visible !== false; })
      .filter(function (r) { return preview || String(r.status).toLowerCase() !== 'placeholder'; })
      .map(function (r) { return preview ? r : stripPlaceholders_(r); })
      .sort(function (a, b) { return (Number(a.order) || 999) - (Number(b.order) || 999); });
  });
  // Sponsors switch themselves on and off by their start / end dates
  var now = new Date();
  out.SPONSORS = (out.SPONSORS || []).filter(function (s) {
    if (!String(s.name || '').trim()) return false;
    var a = s.start ? new Date(s.start) : null, b = s.end ? new Date(s.end) : null;
    if (a && !isNaN(a) && now < a) return false;
    if (b && !isNaN(b) && now > new Date(b.getTime() + 864e5)) return false;
    return true;
  });

  try { cache.put(key, JSON.stringify(out), CONFIG.CACHE_SECONDS); } catch (err) { /* >100KB: skip cache */ }
  return out;
}

/** Reads every tab of the CMS Sheet; falls back to Seed.gs if no Sheet yet. */
function readAll_() {
  var ss = getSheet_();
  if (!ss) { var s = getSeed_(); s._source = 'seed'; return s; }
  var result = { _source: 'sheet' };
  Object.keys(SCHEMA).forEach(function (name) {
    var sh = ss.getSheetByName(name);
    result[name] = sh ? sheetToObjects_(sh) : [];
  });
  return result;
}

function sheetToObjects_(sh) {
  var values = sh.getDataRange().getValues();
  if (values.length < 2) return [];
  var headers = values[0].map(function (h) { return String(h).trim(); });
  var tz = Session.getScriptTimeZone();
  return values.slice(1)
    .filter(function (row) { return row.join('').trim() !== ''; })
    .map(function (row) {
      var o = {};
      headers.forEach(function (h, i) {
        if (!h) return;
        var v = row[i];
        if (v instanceof Date) v = Utilities.formatDate(v, tz, 'd MMM yyyy');
        if (v === 'TRUE') v = true;
        if (v === 'FALSE') v = false;
        o[h] = v;
      });
      return o;
    });
}

function getSheet_() {
  var id = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  try {
    if (id) return SpreadsheetApp.openById(id);
    return SpreadsheetApp.getActiveSpreadsheet();   // bound script fallback
  } catch (err) { return null; }
}

/* ---------- placeholder handling ---------- */
function isPlaceholder_(v) { return CONFIG.PLACEHOLDER_RE.test(String(v || '')); }

/** Public mode: blank any field that is still an [ADD …] / [CONFIRM …] marker. */
function stripPlaceholders_(row) {
  var o = {};
  Object.keys(row).forEach(function (k) {
    var v = row[k];
    if (typeof v === 'string' && isPlaceholder_(v)) {
      // Inline markers inside longer text are removed; pure markers become ''
      v = v.replace(new RegExp(CONFIG.PLACEHOLDER_RE.source, 'gi'), '').replace(/\s{2,}/g, ' ').replace(/\s+([.,;:])/g, '$1').trim();
      if (/^[\s,·—\-()]*$/.test(v)) v = '';
    }
    o[k] = v;
  });
  return o;
}

function isPreview_(key) {
  if (!key) return false;
  var real = PropertiesService.getScriptProperties().getProperty('PREVIEW_KEY');
  return !!real && key === real;
}

/** JSON that is safe to print inside <script>. */
function safeJson_(obj) {
  return JSON.stringify(obj)
    .replace(/</g, '\\u003c').replace(/>/g, '\\u003e')
    .replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
}

/* ===========================================================================
 *  CONTACT FORM
 * ========================================================================= */
function submitEnquiry(form) {
  form = form || {};
  if (form.website) return { ok: true };                     // honeypot: bots fill it
  var name = String(form.name || '').trim().slice(0, 120);
  var email = String(form.email || '').trim().slice(0, 160);
  var type = String(form.type || '').trim().slice(0, 60);
  var message = String(form.message || '').trim().slice(0, 3000);
  if (!name || !message || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { ok: false, error: 'Please add your name, a valid email and a message.' };
  }
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = getSheet_();
    if (!ss) return { ok: false, error: 'The enquiry inbox is not set up yet.' };
    var sh = ss.getSheetByName('ENQUIRIES') || ss.insertSheet('ENQUIRIES');
    if (sh.getLastRow() === 0) sh.appendRow(SCHEMA.ENQUIRIES);
    sh.appendRow([new Date(), name, email, type, message]);
  } finally { lock.releaseLock(); }
  bump_({ enquiries: 1 });

  var to = (getPortfolio_(false).PROFILE || {}).enquiry_inbox;
  if (to && /@/.test(to)) {
    try {
      MailApp.sendEmail({
        to: to, replyTo: email,
        subject: 'Website enquiry (' + (type || 'General') + ') — ' + name,
        body: message + '\n\n— ' + name + ' <' + email + '>'
      });
    } catch (err) { /* quota or permission — the row is still saved */ }
  }
  return { ok: true };
}

/* ===========================================================================
 *  GROWTH ENGINE — fan list, audience counts, sponsor clicks
 *  The public site (GitHub Pages) POSTs here; the Apps Script page calls siteAction().
 * ========================================================================= */
function doPost(e) {
  var body = {};
  try { body = JSON.parse((e && e.postData && e.postData.contents) || '{}'); } catch (err) {}
  return ContentService.createTextOutput(JSON.stringify(siteAction(body))).setMimeType(ContentService.MimeType.JSON);
}

/** One door for everything the website sends: a = hit | click | join | enquiry */
function siteAction(b) {
  b = b || {};
  try {
    if (b.a === 'hit') { var src = { social: 'from_social', search: 'from_search' }[b.src] || 'from_other', o = { visits: 1 }; o[src] = 1; bump_(o); return { ok: true }; }
    if (b.a === 'click') { bump_({ sponsor_clicks: 1 }); return { ok: true }; }
    if (b.a === 'join') return joinFans_(b);
    if (b.a === 'enquiry') return submitEnquiry(b);
  } catch (err) { return { ok: false, error: 'Something went wrong. Please try again.' }; }
  return { ok: false };
}

function joinFans_(f) {
  if (f.website) return { ok: true };                                    // honeypot
  var name = String(f.name || '').trim().slice(0, 120);
  var contact = String(f.contact || '').trim().slice(0, 160);
  var isEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contact), digits = contact.replace(/[^\d]/g, '');
  if (!name || !(isEmail || (digits.length >= 9 && digits.length <= 15))) {
    return { ok: false, error: 'Please add your name and a WhatsApp number or email.' };
  }
  var interests = String(f.interests || '').slice(0, 200), source = String(f.source || '').slice(0, 60);
  var ss = getSheet_(); if (!ss) return { ok: false, error: 'Sign-ups open soon.' };
  var lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    var sh = ss.getSheetByName('FANS') || ss.insertSheet('FANS');
    if (sh.getLastRow() === 0) sh.appendRow(SCHEMA.FANS);
    var have = sh.getLastRow() > 1 ? sh.getRange(2, 3, sh.getLastRow() - 1, 1).getValues().map(function (r) { return String(r[0]).replace(/[^\d@a-z.]/gi, '').toLowerCase(); }) : [];
    var key = isEmail ? contact.toLowerCase() : digits;
    if (have.indexOf(key.replace(/[^\d@a-z.]/gi, '')) > -1) return { ok: true, already: true };
    sh.appendRow([new Date(), name, isEmail ? contact : "'" + contact, interests, source]);
  } finally { lock.releaseLock(); }
  bump_({ signups: 1 });
  return { ok: true };
}

/** Adds to today's row in STATS (one row per day keeps the Sheet small). */
function bump_(add) {
  var ss = getSheet_(); if (!ss) return;
  var lock = LockService.getScriptLock(); if (!lock.tryLock(4000)) return;
  try {
    var sh = ss.getSheetByName('STATS') || ss.insertSheet('STATS');
    if (sh.getLastRow() === 0) sh.appendRow(SCHEMA.STATS);
    var tz = Session.getScriptTimeZone(), today = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
    var last = sh.getLastRow(), row = null;
    if (last > 1) {
      var d = sh.getRange(last, 1).getValue();
      if ((d instanceof Date ? Utilities.formatDate(d, tz, 'yyyy-MM-dd') : String(d)) === today) row = last;
    }
    if (!row) { sh.appendRow(["'" + today, 0, 0, 0, 0, 0, 0, 0]); row = sh.getLastRow(); }
    var vals = sh.getRange(row, 2, 1, 7).getValues()[0];
    SCHEMA.STATS.slice(1).forEach(function (h, i) { if (add[h]) vals[i] = (Number(vals[i]) || 0) + add[h]; });
    sh.getRange(row, 2, 1, 7).setValues([vals]);
  } finally { lock.releaseLock(); }
}

/** Totals for the last n days from STATS. */
function audience_(days) {
  var ss = getSheet_(), sh = ss && ss.getSheetByName('STATS'), tot = {};
  SCHEMA.STATS.slice(1).forEach(function (h) { tot[h] = 0; });
  if (!sh || sh.getLastRow() < 2) return tot;
  var cut = Utilities.formatDate(new Date(Date.now() - days * 864e5), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  sh.getRange(2, 1, sh.getLastRow() - 1, 8).getValues().forEach(function (r) {
    var d = r[0] instanceof Date ? Utilities.formatDate(r[0], Session.getScriptTimeZone(), 'yyyy-MM-dd') : String(r[0]);
    if (d > cut) SCHEMA.STATS.slice(1).forEach(function (h, i) { tot[h] += Number(r[i + 1]) || 0; });
  });
  return tot;
}
function audienceText_() {
  var w = audience_(7), m = audience_(30), fans = 0, ss = getSheet_(), sh = ss && ss.getSheetByName('FANS');
  if (sh) fans = Math.max(0, sh.getLastRow() - 1);
  function line(t) { return t.visits + ' visits (' + t.from_social + ' from social posts, ' + t.from_search + ' from search) · ' +
    t.sponsor_clicks + ' sponsor clicks · ' + t.signups + ' new fans · ' + t.enquiries + ' enquiries'; }
  return 'Last 7 days: ' + line(w) + '\nLast 30 days: ' + line(m) + '\nFriends of Victor list: ' + fans + ' people';
}
function showAudienceReport() {
  SpreadsheetApp.getUi().alert('Audience report', audienceText_() +
    '\n\nUse these numbers when you talk to advertisers. They count real visits to the public website.', SpreadsheetApp.getUi().ButtonSet.OK);
}

/* ---------- Weekly autopilot: seven ready-to-post messages, every Monday ---------- */
function makeWeeklyPosts_() {
  var D = getPortfolio_(false), P = D.PROFILE || {}, tz = Session.getScriptTimeZone();
  var wk = Number(Utilities.formatDate(new Date(), tz, 'w')), weekOf = Utilities.formatDate(new Date(), tz, 'd MMM yyyy');
  var url = function (hash, src) { return SITE_URL + '?utm_source=' + (src || 'whatsapp') + '&utm_campaign=week-' + wk + (hash || ''); };
  var pick = function (arr, k) { return arr.length ? arr[(wk + (k || 0)) % arr.length] : null; };
  var slug = function (v) { return String(v || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); };
  var ugx = function (p) { return (p.prefix ? p.prefix + ' ' : '') + 'UGX ' + Number(p.price_ugx).toLocaleString('en-US') + (p.unit ? ' ' + p.unit : ''); };
  var first = function (s) { return String(s || '').split(/\n/)[0].split(/(?<=[.!?])\s/)[0]; };
  var price = function (svc) { return (D.PRICING || []).filter(function (p) { return p.service === svc && p.price_ugx; }); };
  var sponsor = (D.SPONSORS || []).filter(function (s) { return s.slot === 'fridays'; })[0];
  var by = sponsor ? ' Presented by ' + sponsor.name + '.' : '';
  var posts = [];
  var svc = pick((D.SERVICES || []).filter(function (s) { return s.service !== 'Training & mentorship'; }));
  if (svc) { var sp = price(svc.service)[0]; posts.push(['Monday', 'Service', svc.service + ' with Victor Uringtho. ' + first(svc.description) + (sp ? ' ' + sp.item + ': ' + ugx(sp) + '.' : '') + '\nBook or ask: ' + url('#svc-' + slug(svc.service))]); }
  var tr = pick(price('Training & mentorship'), 1);
  if (tr) posts.push(['Tuesday', 'Training', 'Learn with Victor: ' + tr.item + '. ' + (tr.details || '') + ' Price: ' + ugx(tr) + '.\nDetails and booking: ' + url('#svc-training-mentorship')]);
  var tracks = [];
  (D.MUSIC || []).forEach(function (m) { String(m.audio_url || '').split(/\n+/).forEach(function (l) { var t = l.split('|')[0].trim(); if (t && /\|/.test(l)) tracks.push([t, m]); }); });
  var tk = pick(tracks, 2);
  if (tk) posts.push(['Wednesday', 'Music', 'Throwback Wednesday: "' + tk[0] + '" from Victor\'s album ' + tk[1].title + '. Listen free on his website: ' + url('#m-' + (tk[1].id || slug(tk[1].title)))]);
  if (P.fridays_title) {
    var fr = P.fridays_title + '. One hour of gospel music' + (P.fridays_menu ? ', with ' + String(P.fridays_menu).toLowerCase() : '') + '. ' + (P.fridays_rule || '') + '.' + by;
    posts.push(['Thursday', 'Friday reminder', 'Tomorrow evening: ' + fr + '\nWhere and when: ' + url('#fridays')]);
    posts.push(['Friday', 'Friday tonight', 'Tonight: ' + fr + ' Bring a friend.\nGet the weekly reminder: ' + url('#fridays')]);
  }
  var lic = pick(price('Beat licences'), 3);
  if (lic) posts.push(['Saturday', 'Beats', 'Need a beat? Victor\'s ' + lic.item.toLowerCase() + ' is ' + ugx(lic) + '. ' + first(lic.details) + '.\nSee all three licences: ' + url('#licences')]);
  var ch = pick((D.CHAPTERS || []).filter(function (c) { return c.quote || c.summary; }), 4);
  if (ch) posts.push(['Sunday', 'Story', 'From Victor\'s story, "' + ch.title + '": ' + (ch.quote || first(ch.summary)) + '\nRead the journey: ' + url('#ch-' + ch.id)]);
  posts.push(['Any day', 'Advertisers', 'Advertise with Victor Uringtho: reach gospel music lovers, churches and musicians every week on his website and at Friday Gospel Music in Kampala.\nRates: ' + url('#partners')]);
  var ss = getSheet_(), sh = ss.getSheetByName('WEEKLY_POSTS') || ss.insertSheet('WEEKLY_POSTS');
  if (sh.getLastRow() === 0) sh.appendRow(SCHEMA.WEEKLY_POSTS);
  posts.forEach(function (p) { sh.appendRow(["'" + weekOf, p[0], p[1], p[2]]); });
  return { weekOf: weekOf, posts: posts };
}
function weeklyAutopilot() {
  var r = makeWeeklyPosts_(), P = getPortfolio_(false).PROFILE || {}, to = P.enquiry_inbox || Session.getEffectiveUser().getEmail();
  var body = 'Good morning Victor,\n\nHere are this week\'s posts. Copy each one to your WhatsApp status, WhatsApp channel, Facebook and TikTok on its day. ' +
    'Every link brings people back to your website, and the numbers below show it working.\n\n' +
    r.posts.map(function (p) { return '— ' + p[0].toUpperCase() + ' (' + p[1] + ')\n' + p[2]; }).join('\n\n') +
    '\n\n— YOUR AUDIENCE\n' + audienceText_() + '\n\nAll posts are also saved in the WEEKLY_POSTS tab of the Sheet.';
  try { MailApp.sendEmail({ to: to, subject: 'This week\'s posts — week of ' + r.weekOf, body: body }); } catch (err) {}
  return r;
}
function makeWeeklyPostsNow() {
  var r = weeklyAutopilot();
  toast_(r.posts.length + ' posts saved in WEEKLY_POSTS and emailed.');
}
function turnOnAutopilot() {
  ScriptApp.getProjectTriggers().forEach(function (t) { if (t.getHandlerFunction() === 'weeklyAutopilot') ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('weeklyAutopilot').timeBased().onWeekDay(ScriptApp.WeekDay.MONDAY).atHour(7).create();
  SpreadsheetApp.getUi().alert('Autopilot is on', 'Every Monday morning, seven ready-to-post messages and the audience report will be emailed and saved in WEEKLY_POSTS.', SpreadsheetApp.getUi().ButtonSet.OK);
}

/* ===========================================================================
 *  SHEET MENU, SETUP & CONTENT HEALTH
 * ========================================================================= */
function onOpen() {
  SpreadsheetApp.getUi().createMenu('Portfolio')
    .addItem('Publish changes (clear cache)', 'publishChanges')
    .addItem('Content health — what is missing', 'showContentHealth')
    .addItem('Show my preview link key', 'showPreviewKey')
    .addItem('Sync new content from code (keeps your edits)', 'syncSeedToSheet')
    .addSeparator()
    .addItem('Audience report', 'showAudienceReport')
    .addItem('Make this week\'s posts now', 'makeWeeklyPostsNow')
    .addItem('Turn on weekly autopilot (every Monday)', 'turnOnAutopilot')
    .addSeparator()
    .addItem('First-time setup (build tabs + seed content)', 'setupPortfolio')
    .addToUi();
}

function publishChanges() {
  CacheService.getScriptCache().removeAll([CONFIG.CACHE_KEY, CONFIG.CACHE_KEY + '_p']);
  toast_('Published. Reload the website to see your changes.');
}

function showPreviewKey() {
  var k = PropertiesService.getScriptProperties().getProperty('PREVIEW_KEY');
  SpreadsheetApp.getUi().alert('Preview link',
    'Add this to the end of your web-app URL to see every placeholder highlighted:\n\n?preview=' + k,
    SpreadsheetApp.getUi().ButtonSet.OK);
}

function showContentHealth() {
  var html = HtmlService.createTemplateFromFile('Admin').evaluate().setTitle('Content health');
  SpreadsheetApp.getUi().showSidebar(html);
}

/** Called from Admin.html: every placeholder still waiting for real content. */
function getContentHealth() {
  var raw = readAll_();
  var missing = [], counts = {};
  Object.keys(SCHEMA).forEach(function (name) {
    if (PRIVATE_SHEETS[name]) return;
    var rows = raw[name] || [];
    counts[name] = rows.length;
    rows.forEach(function (r, i) {
      Object.keys(r).forEach(function (col) {
        var v = r[col];
        if (typeof v === 'string' && isPlaceholder_(v)) {
          missing.push({ sheet: name, row: i + 2, column: col,
            label: r.title || r.name || r.key || r.skill || r.service || r.platform || '', value: v.match(CONFIG.PLACEHOLDER_RE)[0] });
        }
      });
    });
  });
  return { counts: counts, missing: missing, source: raw._source };
}

/**
 * Run ONCE from the Apps Script editor (or the Portfolio menu).
 * Creates every tab with headers, formatting and the confirmed seed content.
 * Existing tabs with data are left untouched.
 */
function setupPortfolio() {
  var props = PropertiesService.getScriptProperties();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    ss = SpreadsheetApp.create('Victor Uringtho — Portfolio CMS');
    Logger.log('Created CMS Sheet: ' + ss.getUrl());
  }
  props.setProperty('SHEET_ID', ss.getId());
  if (!props.getProperty('PREVIEW_KEY')) props.setProperty('PREVIEW_KEY', Utilities.getUuid().slice(0, 8));

  var seed = getSeed_();
  Object.keys(SCHEMA).forEach(function (name) {
    var headers = SCHEMA[name];
    var sh = ss.getSheetByName(name) || ss.insertSheet(name);
    if (sh.getLastRow() > 1) return;                       // never overwrite real content
    sh.clear();
    sh.getRange(1, 1, 1, headers.length).setValues([headers])
      .setFontWeight('bold').setBackground('#1b1714').setFontColor('#e9dcc4');
    sh.setFrozenRows(1);
    var rows = (seed[name] || []).map(function (o) {
      return headers.map(function (h) { return o[h] === undefined ? '' : o[h]; });
    });
    if (rows.length) sh.getRange(2, 1, rows.length, headers.length).setValues(rows).setWrap(true).setVerticalAlignment('top');

    // Helpful validation
    var statusCol = headers.indexOf('status') + 1;
    if (statusCol) {
      sh.getRange(2, statusCol, 500, 1).setDataValidation(SpreadsheetApp.newDataValidation()
        .requireValueInList(['confirmed', 'needs-confirmation', 'placeholder'], true).build());
    }
    ['visible', 'featured', 'is_current', 'highlight'].forEach(function (c) {
      var idx = headers.indexOf(c) + 1;
      if (idx) sh.getRange(2, idx, 500, 1).insertCheckboxes();
    });
    if (rows.length) {
      // re-apply checkbox values (insertCheckboxes resets blanks to FALSE)
      ['visible', 'featured', 'is_current', 'highlight'].forEach(function (c) {
        var idx = headers.indexOf(c);
        if (idx < 0) return;
        sh.getRange(2, idx + 1, rows.length, 1).setValues(rows.map(function (r) { return [r[idx] === true]; }));
      });
    }
    sh.autoResizeColumns(1, Math.min(headers.length, 4));
  });

  var def = ss.getSheetByName('Sheet1');
  if (def && ss.getSheets().length > 1 && def.getLastRow() === 0) ss.deleteSheet(def);
  publishChanges();
  toast_('Setup complete. ' + Object.keys(SCHEMA).length + ' tabs ready. Preview key: ' + props.getProperty('PREVIEW_KEY'));
}

/**
 * Re-runnable. Copies NEW content from Seed.gs into the Sheet WITHOUT overwriting
 * anything already edited in the Sheet:
 *  - appends rows that don't exist yet (PHOTOS by image, others by title/name)
 *  - fills image cells that are empty, [ADD …] or old asset: references
 *  - applies wording fixes listed in TEXT_FIXES
 */
var TEXT_FIXES = [
  ['CHAPTERS', 'body', 'Akai DPS16 — sixteen tracks', 'Akai DPS16 Digital Multi-track Recorder — sixteen tracks'],
  ['SERVICES', 'description', 'Original soundtracks made to order. Or buy one of Victor’s existing tracks and beats outright, copyright included.\n• Commission an original soundtrack\n• Buy a ready-made track or beat\n• Buy the copyright', 'Original soundtracks and jingles made to order. Or take one of Victor’s beats — license it, make it exclusive, or buy it outright with the copyright.\n• Commission an original soundtrack or jingle\n• License a beat (basic or exclusive)\n• Buy a beat outright, copyright included'],
  ['SERVICES', 'description', 'Including remote work — send your stems from anywhere.', 'Send your stems or your studio mix from anywhere in the world. Artists already send Victor jobs online — one came all the way from Dubai.\n• Send your stems or studio mix online\n• Victor mixes and masters the track\n• The finished track is sent back to you'],
  ['SERVICES', 'description', '• One-on-one lessons, in the studio or online\n• Short courses in production and live sound\n• Workshops for church, choir and band sound teams', '• One-on-one lessons on guitar, keyboard, drums and bass, in the studio or online\n• Courses in music production, recording, mixing and mastering\n• Live sound: setting up the equipment for a live band and mixing the show\n• Workshops for church, choir and band sound teams, at your venue'],
  ['PRICING', 'details', 'Half a day, up to 15 people, for churches, choirs and bands.', 'Half a day at your church or venue, up to 15 people: setting up the band’s equipment, mics, monitors and the desk.'],
  ['MUSIC', 'description', 'chose to invest in his own music.', 'chose to invest in his own music. Twelve tracks, featuring Paul Mugarura and Peter Basaza. [CONFIRM YEAR: the album files say 2001, the memoir says 2002]']
];
// Tabs whose rows are swapped for the new seed, but only if every row still has one of these old default names
var REPLACE_IF_DEFAULT = { SERVICES: ['service', ['Music production', 'Recording', 'Mixing & mastering', 'Live sound', 'Songwriting & arranging']] };
// Cells filled from the seed when they are still empty in the Sheet (never overwrites your text)
var FILL_FIELDS = { MUSIC: ['id', ['audio_url']], ARTISTS: ['name', ['project', 'year']] };
// Re-number rows to make room for new ones: [tab, key column, key, old order, new order] — only if the order is still the old one
var ORDER_FIXES = [
  ['PRICING', 'item', 'Music production & recording course', 17, 18],
  ['PRICING', 'item', 'Sound team workshop', 18, 21],
  ['PRICING', 'item', 'Artist & producer mentorship', 19, 22],
  ['PRICING', 'item', 'Basic licence', 20, 23],
  ['PRICING', 'item', 'Exclusive licence', 21, 24],
  ['PRICING', 'item', 'Full buyout', 22, 25]
];
function syncSeedToSheet() {
  var ss = getSheet_(), seed = getSeed_(), log = [];
  if (!ss) throw new Error('No Sheet connected.');
  function rows(name) { return sheetToObjects_(ss.getSheetByName(name)); }
  function col(name, header) { return SCHEMA[name].indexOf(header) + 1; }
  function emptyish(v) { v = String(v == null ? '' : v); return !v || isPlaceholder_(v) || v.indexOf('asset:') === 0; }
  var seedPhotoByAsset = {};
  seed.PROFILE.forEach(function (r) { if (r.key === 'hero_image') seedPhotoByAsset['asset:portrait'] = r.value; });
  seed.PHOTOS.forEach(function (r) { if (/victor-casual/.test(r.image)) seedPhotoByAsset['asset:casual'] = r.image; });

  // 1. Replace old embedded-asset references with hosted image URLs
  ['PROFILE', 'PHOTOS'].forEach(function (name) {
    var sh = ss.getSheetByName(name), c = col(name, name === 'PROFILE' ? 'value' : 'image');
    rows(name).forEach(function (r, i) {
      var v = name === 'PROFILE' ? r.value : r.image;
      if (seedPhotoByAsset[v]) { sh.getRange(i + 2, c).setValue(seedPhotoByAsset[v]); log.push(name + ' row ' + (i + 2) + ': ' + v + ' → hosted image'); }
    });
  });

  // 1a. Create any new tabs (e.g. PRICING, UPRS_WORKS) with their starting content
  var missing = Object.keys(SCHEMA).filter(function (n) { return !ss.getSheetByName(n); });
  if (missing.length) { setupPortfolio(); log.push('New tabs created: ' + missing.join(', ')); }

  // 1b. Replace tabs that still hold only the old default rows
  Object.keys(REPLACE_IF_DEFAULT).forEach(function (name) {
    var k = REPLACE_IF_DEFAULT[name][0], olds = REPLACE_IF_DEFAULT[name][1], sh = ss.getSheetByName(name);
    var cur = rows(name);
    cur = cur.filter(function (r) { return String(r[k] || '').trim(); });     // ignore empty checkbox-only rows
    if (!cur.length || !cur.every(function (r) { return olds.indexOf(String(r[k])) > -1; })) return;
    if (sh.getLastRow() > 1) sh.getRange(2, 1, sh.getLastRow() - 1, sh.getLastColumn()).clearContent();
    var vals = seed[name].map(function (o) { return SCHEMA[name].map(function (h) { return o[h] === undefined ? '' : o[h]; }); });
    sh.getRange(2, 1, vals.length, SCHEMA[name].length).setValues(vals);
    log.push(name + ': replaced with the new list (' + vals.length + ' rows)');
  });

  // 1c. If the new rows were appended next to the old defaults, remove the old ones and re-order
  Object.keys(REPLACE_IF_DEFAULT).forEach(function (name) {
    var k = REPLACE_IF_DEFAULT[name][0], newNames = seed[name].map(function (o) { return String(o[k]); });
    var olds = REPLACE_IF_DEFAULT[name][1].filter(function (n) { return newNames.indexOf(n) < 0; });
    var sh = ss.getSheetByName(name), kc = col(name, k) - 1, oc = col(name, 'order');
    var vals = sh.getDataRange().getValues();                  // raw rows, so row numbers are exact
    var have = vals.slice(1).map(function (r) { return String(r[kc]).trim(); });
    if (!newNames.every(function (n) { return have.indexOf(n) > -1; })) return;
    for (var i = vals.length - 1; i >= 1; i--) {
      var nm = String(vals[i][kc]).trim();
      if (olds.indexOf(nm) > -1) { sh.deleteRow(i + 1); log.push(name + ': removed old ' + nm); }
    }
    sh.getDataRange().getValues().forEach(function (r, j) {
      var at = j ? newNames.indexOf(String(r[kc]).trim()) : -1;
      if (at > -1 && Number(r[oc - 1]) !== at + 1) sh.getRange(j + 1, oc).setValue(at + 1);
    });
  });

  // 2. Append rows that are new in the seed
  var keyOf = { PROFILE: 'key', PRICING: 'item', PHOTOS: 'image', EVENTS: 'title', MILESTONES: 'title', BANDS: 'name', ARTISTS: 'name', MUSIC: 'id', PEOPLE: 'name', PROJECTS: 'title', SERVICES: 'service', SKILLS: 'skill' };
  Object.keys(keyOf).forEach(function (name) {
    var sh = ss.getSheetByName(name), k = keyOf[name];
    var have = rows(name).map(function (r) { return String(r[k]); });
    (seed[name] || []).forEach(function (o) {
      if (have.indexOf(String(o[k])) > -1) return;
      sh.appendRow(SCHEMA[name].map(function (h) { return o[h] === undefined ? '' : o[h]; }));
      log.push(name + ': added ' + o[k]);
    });
  });

  // 3. Fill empty image cells on chapters and bands
  [['CHAPTERS', 'id'], ['BANDS', 'name']].forEach(function (pair) {
    var name = pair[0], k = pair[1], sh = ss.getSheetByName(name);
    var bySeed = {}; seed[name].forEach(function (o) { bySeed[o[k]] = o; });
    rows(name).forEach(function (r, i) {
      var s = bySeed[r[k]]; if (!s || !s.image || isPlaceholder_(s.image)) return;
      if (emptyish(r.image)) {
        sh.getRange(i + 2, col(name, 'image')).setValue(s.image);
        if (name === 'CHAPTERS' && !r.image_caption && s.image_caption) sh.getRange(i + 2, col(name, 'image_caption')).setValue(s.image_caption);
        log.push(name + ': image for ' + r[k]);
      }
    });
  });

  // 3b. Fill empty media cells (e.g. the album tracklist)
  Object.keys(FILL_FIELDS).forEach(function (name) {
    var k = FILL_FIELDS[name][0], fields = FILL_FIELDS[name][1], sh = ss.getSheetByName(name);
    var bySeed = {}; (seed[name] || []).forEach(function (o) { bySeed[o[k]] = o; });
    rows(name).forEach(function (r, i) {
      var s = bySeed[r[k]]; if (!s) return;
      fields.forEach(function (f) {
        if (s[f] && !isPlaceholder_(s[f]) && emptyish(r[f])) { sh.getRange(i + 2, col(name, f)).setValue(s[f]); log.push(name + ': ' + f + ' for ' + r[k]); }
      });
    });
  });

  // 4. Wording fixes (only where the old wording is still present)
  TEXT_FIXES.forEach(function (f) {
    var sh = ss.getSheetByName(f[0]), c = col(f[0], f[1]);
    rows(f[0]).forEach(function (r, i) {
      var v = String(r[f[1]] || '');
      if (v.indexOf(f[2]) > -1 && v.indexOf(f[3]) === -1) { sh.getRange(i + 2, c).setValue(v.split(f[2]).join(f[3])); log.push(f[0] + ' row ' + (i + 2) + ': wording fix'); }
    });
  });

  // 5. Re-number rows (only rows still on their old default order)
  ORDER_FIXES.forEach(function (f) {
    var sh = ss.getSheetByName(f[0]), kc = col(f[0], f[1]) - 1, oc = col(f[0], 'order');
    sh.getDataRange().getValues().forEach(function (r, j) {
      if (j && String(r[kc]).trim() === f[2] && Number(r[oc - 1]) === f[3]) { sh.getRange(j + 1, oc).setValue(f[4]); log.push(f[0] + ': ' + f[2] + ' moved to ' + f[4]); }
    });
  });

  publishChanges();
  Logger.log(log.join('\n') || 'Nothing new to sync.');
  return log;
}

function toast_(msg) {
  try { SpreadsheetApp.getActiveSpreadsheet().toast(msg, 'Portfolio', 6); } catch (e) { Logger.log(msg); }
}
