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
 *    doGet(e) ?action=summary – AI/SiteGo lightweight overview
 *    doGet(e) ?action=content – AI/SiteGo tab content
 *    doGet(e) ?action=health  – AI/SiteGo content health
 *    setupPortfolio()         – run ONCE: builds the CMS tabs + seed content
 *    onOpen()                 – adds the "Portfolio" menu to the Sheet
 *    submitEnquiry(form)      – contact form → ENQUIRIES tab (+ email)
 * ============================================================================
 */

var CONFIG = {
  SITE_TITLE: 'Victor Uringtho | Gospel Music Producer & Sound Engineer, Kampala',
  SITE_DESCRIPTION:
    'Ugandan gospel music producer and sound engineer in Kampala: studio recording, mixing & mastering, ' +
    'live sound, beats, music lessons and Friday Gospel Music.',
  CACHE_KEY: 'vu_portfolio_v1',
  CACHE_SECONDS: 600,
  PLACEHOLDER_RE: /\[(ADD|CONFIRM)[^\]]*\]/i
};

/* See full file in repo history or local backup - this push is being split */
