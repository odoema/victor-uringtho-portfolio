/**
 * ============================================================================
 *  Victor Uringtho — BEATS STORE TEST PROJECT (isolated)
 * ----------------------------------------------------------------------------
 *  SEPARATE Apps Script project. NOT the production Unyuthfua deployment.
 *  Bound to / reads ONLY the development spreadsheet:
 *    Victor Portfolio Dev — Beats Catalogue
 *    SHEET_ID = 15USt3XZHz7EOMRXqOf-3jgAmkECNKyOu3MB3tcFzLSc
 *
 *  Public JSON (?format=json) exposes ONLY approved storefront fields.
 *  Never returns: mp3_file_ref, wav_file_ref, notes, internal terms drafts
 *  for private delivery, or beats with status sold/reserved/sold exclusively.
 *
 *  Missing tabs on the dev sheet are handled safely (empty arrays).
 *  No contact form, visit logging, or email side-effects in this test project.
 * ============================================================================
 */

var CONFIG = {
  CACHE_KEY: 'vu_beats_test_v1',
  CACHE_SECONDS: 120,
  // Development spreadsheet only — never the live Portfolio CMS
  DEV_SHEET_ID: '15USt3XZHz7EOMRXqOf-3jgAmkECNKyOu3MB3tcFzLSc'
};

/** Full column list for reading the BEATS tab. */
var BEATS_COLUMNS = [
  'id', 'title', 'slug', 'genre', 'bpm', 'musical_key', 'mood', 'description',
  'preview_url', 'mp3_file_ref', 'wav_file_ref',
  'nonexclusive_price_ugx', 'nonexclusive_price_usd',
  'exclusive_price_ugx', 'exclusive_price_usd',
  'nonexclusive_terms', 'exclusive_terms',
  'status', 'visible', 'featured', 'order', 'tags', 'notes'
];

/**
 * Public allowlist — only these fields may leave the server in JSON.
 * Private delivery refs and internal notes are never included.
 */
var PUBLIC_BEAT_FIELDS = [
  'id', 'title', 'slug', 'genre', 'bpm', 'musical_key', 'mood', 'description',
  'preview_url',
  'nonexclusive_price_ugx', 'nonexclusive_price_usd',
  'exclusive_price_ugx', 'exclusive_price_usd',
  'status', 'featured', 'order', 'tags'
];

var SOLD_STATUSES = {
  'sold': true,
  'sold exclusively': true,
  'reserved': true
};

/* ===========================================================================
 *  WEB APP — JSON only for this test project
 * ========================================================================= */
function doGet(e) {
  var p = (e && e.parameter) || {};
  if (p.format === 'json' || !p.format) {
    var data = getBeatsPublic_();
    return ContentService
      .createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService
    .createTextOutput(JSON.stringify({
      ok: false,
      error: 'This is the isolated BEATS test project. Use ?format=json',
      project: 'beat-store-test'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Optional no-op POST so accidental POSTs from the main site do not error loudly. */
function doPost(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: false, error: 'POST not enabled on beat-store test project' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ===========================================================================
 *  DATA LAYER
 * ========================================================================= */
function getBeatsPublic_() {
  var cache = CacheService.getScriptCache();
  var hit = cache.get(CONFIG.CACHE_KEY);
  if (hit) {
    try { return JSON.parse(hit); } catch (err) { /* rebuild */ }
  }

  var rows = readBeatsSheet_();
  var publicBeats = rows
    .filter(isPubliclyListable_)
    .map(toPublicBeat_)
    .sort(function (a, b) {
      return (Number(a.order) || 999) - (Number(b.order) || 999);
    });

  var out = {
    meta: {
      project: 'beat-store-test',
      generated: new Date().toISOString(),
      source: 'dev-sheet',
      sheet_id_suffix: CONFIG.DEV_SHEET_ID.slice(-8),
      count: publicBeats.length
    },
    BEATS: publicBeats
  };

  try {
    cache.put(CONFIG.CACHE_KEY, JSON.stringify(out), CONFIG.CACHE_SECONDS);
  } catch (err) { /* payload size — skip cache */ }

  return out;
}

function isPubliclyListable_(row) {
  if (!row) return false;
  if (row.visible === false || row.visible === 'FALSE' || row.visible === 'false') return false;
  var st = String(row.status || '').trim().toLowerCase();
  if (SOLD_STATUSES[st]) return false;
  if (st === 'placeholder' || st === 'draft') {
    if (st === 'placeholder') return false;
    return false;
  }
  if (!String(row.id || '').trim() && !String(row.title || '').trim()) return false;
  return true;
}

function toPublicBeat_(row) {
  var o = {};
  PUBLIC_BEAT_FIELDS.forEach(function (k) {
    if (row[k] !== undefined && row[k] !== null && row[k] !== '') {
      o[k] = row[k];
    }
  });
  if (o.bpm !== undefined) o.bpm = Number(o.bpm) || o.bpm;
  if (o.order !== undefined) o.order = Number(o.order) || o.order;
  if (o.featured === 'TRUE' || o.featured === true) o.featured = true;
  if (o.featured === 'FALSE' || o.featured === false) o.featured = false;
  ['nonexclusive_price_ugx', 'nonexclusive_price_usd',
   'exclusive_price_ugx', 'exclusive_price_usd'].forEach(function (k) {
    if (o[k] !== undefined) o[k] = Number(o[k]) || o[k];
  });
  return o;
}

function readBeatsSheet_() {
  var ss = openDevSheet_();
  if (!ss) return [];
  var sh = ss.getSheetByName('BEATS');
  if (!sh) return [];
  return sheetToObjects_(sh);
}

function openDevSheet_() {
  var id = PropertiesService.getScriptProperties().getProperty('SHEET_ID') || CONFIG.DEV_SHEET_ID;
  try {
    return SpreadsheetApp.openById(id);
  } catch (err) {
    return null;
  }
}

function sheetToObjects_(sh) {
  var values = sh.getDataRange().getValues();
  if (!values || values.length < 2) return [];
  var headers = values[0].map(function (h) { return String(h || '').trim(); });
  var tz = Session.getScriptTimeZone();
  return values.slice(1)
    .filter(function (row) { return row.join('').trim() !== ''; })
    .map(function (row) {
      var o = {};
      headers.forEach(function (h, i) {
        if (!h) return;
        var v = row[i];
        if (v instanceof Date) {
          v = Utilities.formatDate(v, tz, 'd MMM yyyy');
        }
        if (v === 'TRUE') v = true;
        if (v === 'FALSE') v = false;
        o[h] = v;
      });
      return o;
    });
}

/* ===========================================================================
 *  ONE-TIME SETUP helpers (run from the Apps Script editor)
 * ========================================================================= */

/** Run once after creating this project: stores SHEET_ID as a Script Property. */
function setupTestSheetId() {
  PropertiesService.getScriptProperties().setProperty('SHEET_ID', CONFIG.DEV_SHEET_ID);
  return 'SHEET_ID set to ' + CONFIG.DEV_SHEET_ID;
}

/** Quick check from the editor: returns public JSON shape without deploying. */
function debugPublicJson() {
  return getBeatsPublic_();
}

/** Confirms the project cannot see production private sheets by design. */
function debugSheetTabs() {
  var ss = openDevSheet_();
  if (!ss) return { ok: false, error: 'Could not open sheet. Run setupTestSheetId() and grant access.' };
  var names = ss.getSheets().map(function (s) { return s.getName(); });
  return {
    ok: true,
    sheet_id_suffix: (PropertiesService.getScriptProperties().getProperty('SHEET_ID') || CONFIG.DEV_SHEET_ID).slice(-8),
    tabs: names,
    has_BEATS: names.indexOf('BEATS') !== -1
  };
}
