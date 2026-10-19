/**
 * AI / SiteGo Bridge — Stage C
 * Controlled read/write surface for external agents.
 * Write actions require Script Property AI_BRIDGE_SECRET.
 * Read actions are public and non-destructive.
 *
 * Usage:
 *   GET  ?action=summary
 *   GET  ?action=content&tab=MUSIC
 *   GET  ?action=health
 *   POST { "action": "update", "secret": "...", "tab": "MUSIC", "id": "...", "fields": {...} }
 *   POST { "action": "publish", "secret": "..." }
 */

var AI_SECRET_PROP = 'AI_BRIDGE_SECRET';

function checkSecret_(given) {
  var real = PropertiesService.getScriptProperties().getProperty(AI_SECRET_PROP);
  return !!real && String(given || '') === real;
}

/** Lightweight overview for AI agents. */
function apiSummary_() {
  var data = getPortfolio_(false);
  var health;
  try { health = getContentHealth(); } catch (e) { health = { missing: [] }; }
  var missingCount = (health && health.missing) ? health.missing.length : 0;
  return {
    ok: true,
    generated: new Date().toISOString(),
    site: SITE_URL,
    profile: {
      display_name: (data.PROFILE || {}).display_name || '',
      roles: (data.PROFILE || {}).roles || '',
      base_location: (data.PROFILE || {}).base_location || '',
      fridays_status: (data.PROFILE || {}).fridays_status || ''
    },
    counts: {
      chapters: (data.CHAPTERS || []).length,
      milestones: (data.MILESTONES || []).length,
      music: (data.MUSIC || []).length,
      artists: (data.ARTISTS || []).length,
      bands: (data.BANDS || []).length,
      events: (data.EVENTS || []).length,
      photos: (data.PHOTOS || []).length,
      pricing: (data.PRICING || []).length,
      services: (data.SERVICES || []).length
    },
    missing_placeholders: missingCount,
    source: (data.meta || {}).source || 'unknown'
  };
}

/** Return one tab or the whole public portfolio. */
function apiContent_(tab, statusFilter) {
  var data = getPortfolio_(false);
  if (!tab) return { ok: true, data: data };
  tab = String(tab).toUpperCase();
  if (!data[tab]) return { ok: false, error: 'Unknown or private tab: ' + tab };
  var rows = data[tab];
  if (statusFilter) {
    var sf = String(statusFilter).toLowerCase();
    rows = rows.filter(function (r) {
      return String(r.status || '').toLowerCase() === sf;
    });
  }
  return { ok: true, tab: tab, count: rows.length, rows: rows };
}

/** Update fields on an existing row. Identified by id / key or explicit row number. */
function apiUpdate_(payload) {
  if (!checkSecret_(payload.secret)) return { ok: false, error: 'Unauthorized — set AI_BRIDGE_SECRET first' };
  var tab = String(payload.tab || '').toUpperCase();
  var fields = payload.fields || {};
  if (!SCHEMA[tab] || PRIVATE_SHEETS[tab]) return { ok: false, error: 'Tab not writable: ' + tab };
  if (!Object.keys(fields).length) return { ok: false, error: 'No fields provided' };

  var ss = getSheet_();
  if (!ss) return { ok: false, error: 'Sheet not available' };
  var sh = ss.getSheetByName(tab);
  if (!sh || sh.getLastRow() < 2) return { ok: false, error: 'Tab empty or missing' };

  var headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(function (h) { return String(h).trim(); });
  var idCol = headers.indexOf('id');
  if (idCol < 0) idCol = headers.indexOf('key');
  var rows = sh.getDataRange().getValues();
  var targetRow = -1;

  if (payload.row) {
    targetRow = Number(payload.row);
  } else if (payload.id || payload.key) {
    var needle = String(payload.id || payload.key);
    for (var i = 1; i < rows.length; i++) {
      if (idCol >= 0 && String(rows[i][idCol]) === needle) { targetRow = i + 1; break; }
    }
  }
  if (targetRow < 2) return { ok: false, error: 'Row not found' };

  var updated = [];
  Object.keys(fields).forEach(function (colName) {
    var c = headers.indexOf(colName);
    if (c >= 0) {
      sh.getRange(targetRow, c + 1).setValue(fields[colName]);
      updated.push(colName);
    }
  });

  if (!updated.length) return { ok: false, error: 'No matching columns found' };

  CacheService.getScriptCache().removeAll([CONFIG.CACHE_KEY, CONFIG.CACHE_KEY + '_p']);
  return { ok: true, tab: tab, row: targetRow, updated: updated };
}

/** Explicit publish / cache clear. */
function apiPublish_(payload) {
  if (!checkSecret_(payload.secret)) return { ok: false, error: 'Unauthorized — set AI_BRIDGE_SECRET first' };
  CacheService.getScriptCache().removeAll([CONFIG.CACHE_KEY, CONFIG.CACHE_KEY + '_p']);
  return { ok: true, message: 'Cache cleared. Site will serve fresh content on next load.' };
}

/** Menu helper: show whether the secret is configured. */
function showAiBridgeStatus() {
  var has = !!PropertiesService.getScriptProperties().getProperty(AI_SECRET_PROP);
  SpreadsheetApp.getUi().alert('AI / SiteGo bridge',
    has
      ? 'AI_BRIDGE_SECRET is set. Write actions (update / publish) are enabled for agents that know the secret.'
      : 'AI_BRIDGE_SECRET is NOT set yet.\n\nIn Apps Script → Project Settings → Script properties, add:\nKey: AI_BRIDGE_SECRET\nValue: a long random string.\n\nUntil then, only read actions (summary / content / health) work.',
    SpreadsheetApp.getUi().ButtonSet.OK);
}
