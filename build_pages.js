const fs=require('fs'),vm=require('vm');
const R=__dirname, S=R+'/src/';
const SITE='https://victoruringtho.com/';
const API='https://script.google.com/macros/s/AKfycbwHq8KDHJHN5febSkLDoDGv4JFzNwCN89eAxcX9ACZRN0vtn-PPfbUSE5dxvYoIqiHDiQ/exec?format=json';
const ctx={console,JSON,Date,CacheService:{getScriptCache:()=>({get:()=>null,put:()=>{}})},
 PropertiesService:{getScriptProperties:()=>({getProperty:()=>null})},SpreadsheetApp:{getActiveSpreadsheet:()=>null},Session:{getScriptTimeZone:()=>'Africa/Kampala'}};
vm.createContext(ctx); vm.runInContext(fs.readFileSync(S+'Seed.gs','utf8')+fs.readFileSync(S+'Code.gs','utf8'),ctx);
const data=JSON.parse(JSON.stringify(ctx.getPortfolio_(false)).split('https://odoema.github.io/victor-uringtho-portfolio/').join('https://victoruringtho.com/')); data.meta.source='snapshot';
const title=ctx.CONFIG.SITE_TITLE, desc=ctx.CONFIG.SITE_DESCRIPTION;
let idx=fs.readFileSync(S+'Index.html','utf8');
const styles=fs.readFileSync(S+'Styles.html','utf8');
let scripts=fs.readFileSync(S+'Scripts.html','utf8').replace(/^<script>\n?/,'').replace(/<\/script>\s*$/,'');
const body=idx.slice(idx.indexOf('<a class="skip"'), idx.indexOf('<!-- Content from the Google Sheet'))
  .replace(/<\? if \(preview\) \{ \?>[\s\S]*?<\? \} \?>\n?/,'');
if(/<\?/.test(body)) throw 'scriptlet left';
const esc=s=>s.replace(/&/g,'&amp;').replace(/"/g,'&quot;');
// Structured data for Google (Person + business + album + website), built from the Sheet snapshot
const P=data.PROFILE||{}, priced=(data.PRICING||[]).filter(p=>Number(p.price_ugx)>0);
const offers=(data.SERVICES||[]).map(sv=>({"@type":"OfferCatalog","name":sv.service,
  "itemListElement":priced.filter(p=>p.service===sv.service).map(p=>({"@type":"Offer","name":p.item,"description":p.details||undefined,
    "priceSpecification":{"@type":"PriceSpecification","price":Number(p.price_ugx),"priceCurrency":"UGX","description":((p.prefix?p.prefix+' ':'')+(p.unit||'')).trim()||undefined},
    "itemOffered":{"@type":"Service","name":p.item}}))}));
const album=(data.MUSIC||[]).find(m=>m.id==='thank-you-lord');
const tracks=album?String(album.audio_url||'').split(/\n+/).map(l=>l.split('|')[0].trim()).filter(Boolean):[];
const ugx=priced.map(p=>Number(p.price_ugx));
const ld={"@context":"https://schema.org","@graph":[
 {"@type":"Person","@id":SITE+"#victor","name":"Victor Unyuthfua Uringtho","alternateName":["Victor Uringtho","Unyuthfua"],
  "birthDate":"1973-05-31","birthPlace":{"@type":"Place","name":"Kamuli, Uganda"},"nationality":"Ugandan",
  "jobTitle":["Music Producer","Songwriter","Arranger","Recording & Mixing Engineer","Live Sound Engineer"],
  "knowsAbout":["Gospel music","Music production","Mixing and mastering","Live sound engineering","Songwriting","Guitar","Keyboard"],
  "url":SITE,"image":SITE+"assets/victor-portrait.jpg","description":desc,
  "sameAs":(data.SOCIAL_LINKS||[]).map(s=>s.url).filter(u=>/^https?:/.test(u))},
 {"@type":"ProfessionalService","@id":SITE+"#studio","name":"Victor Uringtho — Music Production & Sound","url":SITE,
  "image":SITE+"assets/promo/victor-services-poster.jpg","logo":SITE+"assets/brand/logo-512.png","founder":{"@id":SITE+"#victor"},
  "description":"Studio recording, live performance recording, mixing & mastering, soundtracks & beats, and music training in Kampala, Uganda. Remote mixing for clients worldwide.",
  "areaServed":[{"@type":"City","name":"Kampala"},{"@type":"Country","name":"Uganda"},"Worldwide (remote mixing & mastering)"],
  "address":{"@type":"PostalAddress","addressLocality":"Kampala","addressCountry":"UG"},
  "priceRange":ugx.length?`UGX ${Math.min(...ugx).toLocaleString('en-US')} – ${Math.max(...ugx).toLocaleString('en-US')}`:undefined,
  "hasOfferCatalog":{"@type":"OfferCatalog","name":"Services & prices","itemListElement":offers}},
 album&&{"@type":"MusicAlbum","name":album.title,"byArtist":{"@id":SITE+"#victor"},"url":SITE+"#m-thank-you-lord","numTracks":tracks.length,
  "genre":"Gospel","track":{"@type":"ItemList","numberOfItems":tracks.length,"itemListElement":tracks.map((t,i)=>({"@type":"ListItem","position":i+1,"item":{"@type":"MusicRecording","name":t,"byArtist":{"@id":SITE+"#victor"}}}))}},
 {"@type":"WebSite","@id":SITE+"#site","url":SITE,"name":"Victor Uringtho","inLanguage":"en","publisher":{"@id":SITE+"#victor"}}
].filter(Boolean)};
fs.writeFileSync(R+'/docs/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url><loc>${SITE}</loc><lastmod>${new Date().toISOString().slice(0,10)}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority>
${(data.PHOTOS||[]).filter(p=>/^https:\/\/victoruringtho\.com/.test(p.image)).map(p=>`    <image:image><image:loc>${p.image}</image:loc></image:image>`).join('\n')}
  </url>
</urlset>
`);
const verify=fs.existsSync(R+'/google-verification.txt')?fs.readFileSync(R+'/google-verification.txt','utf8').trim():'';
const safe=o=>JSON.stringify(o).replace(/</g,'\\u003c').replace(new RegExp(String.fromCharCode(0x2028),'g'),'\\u2028').replace(new RegExp(String.fromCharCode(0x2029),'g'),'\\u2029');
const html=`<!DOCTYPE html>
<!-- GENERATED by build_pages.js from src/ — edit src/ and the Google Sheet, not this file. -->
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${SITE}">
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">
<meta name="keywords" content="Victor Uringtho, Unyuthfua, gospel music producer Uganda, music producer Kampala, mixing and mastering Uganda, recording studio Kampala, live sound engineer Uganda, beats for sale Uganda, music lessons Kampala, Friday gospel music Kampala">
<meta name="author" content="Victor Unyuthfua Uringtho">
<meta name="geo.region" content="UG-102"><meta name="geo.placename" content="Kampala">
<meta property="og:locale" content="en_UG">
<link rel="sitemap" type="application/xml" href="sitemap.xml">${verify?`\n<meta name="google-site-verification" content="${verify}">`:''}
<meta name="theme-color" content="#14110f">
<meta property="og:type" content="profile">
<meta property="og:site_name" content="Victor Uringtho">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${SITE}">
<meta property="og:image" content="${SITE}assets/share.jpg">
<meta property="og:image:alt" content="Victor Uringtho — music producer and sound engineer, Kampala">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${SITE}assets/share.jpg">
<link rel="icon" href="favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="assets/brand/favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="assets/brand/favicon-16.png">
<link rel="apple-touch-icon" href="assets/brand/apple-touch-icon.png">
<link rel="manifest" href="site.webmanifest">
<script type="application/ld+json">${safe(ld)}</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,700;1,9..144,400&family=Manrope:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,700;1,9..144,400&family=Manrope:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"></noscript>
<link rel="preload" as="image" href="assets/victor-portrait.jpg">
${styles}
</head>
<body>
  ${body}
  <script>
    // Photos served from this site; the Sheet can override with Drive links.
    window.VU_ASSETS = { portrait: 'assets/victor-portrait.jpg', casual: 'assets/victor-casual.jpg' };
    // Snapshot of the Google Sheet at build time — used if the live feed is unavailable.
    window.VU_SNAPSHOT = ${safe(data)};
    window.VU_API = ${JSON.stringify(API)};
  </script>
  <script id="vu-app" type="text/plain">${scripts.replace(/<\/script/gi,'<\\/script')}</script>
  <script>
    // Live content: read the Google Sheet through the Apps Script JSON feed (works once the
    // web app's access is "Anyone"). Remembers the last live copy for slow connections.
    (function () {
      var done = false, cached = null;
      try { cached = JSON.parse(localStorage.getItem('vu_live') || 'null'); } catch (e) {}
      function boot(d) {
        if (done) return; done = true;
        window.VU_DATA = d || cached || window.VU_SNAPSHOT;
        var s = document.createElement('script');
        s.textContent = document.getElementById('vu-app').textContent;
        document.body.appendChild(s);
      }
      // Live content usually arrives in 1-3 s; after 4 s use the last live copy this visitor saw (or the snapshot).
      setTimeout(function () { boot(); }, 4000);
      try {
        fetch(window.VU_API, { cache: 'no-store' })
          .then(function (r) { return r.ok ? r.json() : null; })
          .then(function (d) {
            if (d && d.PROFILE) { try { localStorage.setItem('vu_live', JSON.stringify(d)); } catch (e) {} boot(d); }
            else boot();
          })
          .catch(function () { boot(); });
      } catch (e) { boot(); }
    })();
  </script>
</body>
</html>
`;
fs.writeFileSync(R+'/docs/index.html',html);
console.log('built', html.length, 'bytes; chapters', data.CHAPTERS.length, 'music', data.MUSIC.length);
