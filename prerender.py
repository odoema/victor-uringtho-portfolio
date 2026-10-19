"""Optional SEO step: after `node build_pages.js`, bake the rendered page into docs/index.html
so search engines and slow phones see the full content before JavaScript runs.
The live Sheet content still replaces it a moment later in the browser."""
import asyncio, sys, pathlib, threading, http.server, functools
from playwright.async_api import async_playwright
DOCS = pathlib.Path(__file__).parent / 'docs'
SITE = 'https://victoruringtho.com/'
CLEAN = r"""() => {
  document.body.classList.remove('loaded', 'is-preview');
  const app = document.getElementById('vu-app').textContent;
  [...document.body.querySelectorAll('script:not([id]):not([type])')].forEach(s => { if (s.textContent === app) s.remove(); });
  document.querySelectorAll('dialog[open]').forEach(d => d.removeAttribute('open'));
  document.querySelectorAll('.nav.scrolled').forEach(n => n.classList.remove('scrolled'));
  document.documentElement.setAttribute('data-prerendered', '1');
  return '<!DOCTYPE html>\n' + document.documentElement.outerHTML;
}"""
def size_images(html):
    """Add width/height to <img> tags of our own photos so the page doesn't jump while they load."""
    import re
    try:
        from PIL import Image
    except ImportError:
        return html
    cache = {}
    def dims(src):
        m = re.match(r'(?:https://victoruringtho\.com/|https://odoema\.github\.io/victor-uringtho-portfolio/)?(assets/[^"?#]+)', src)
        if not m: return None
        f = DOCS / m.group(1)
        if f not in cache:
            try:
                with Image.open(f) as im: cache[f] = im.size
            except Exception: cache[f] = None
        return cache[f]
    def fix(m):
        tag = m.group(0)
        if ' width=' in tag: return tag
        src = re.search(r'src="([^"]+)"', tag)
        d = src and dims(src.group(1))
        return tag[:-1] + f' width="{d[0]}" height="{d[1]}">' if d else tag
    return re.sub(r'<img [^>]*>', fix, html)

async def main():
    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(DOCS))
    srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), handler); port = srv.server_address[1]
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width': 1280, 'height': 900})
        await pg.route('**/script.google.com/**', lambda r: r.abort())
        await pg.route('**/fonts.g*/**', lambda r: r.abort())
        def serve(site):
            return lambda r: r.fulfill(path=str(DOCS / (r.request.url[len(site):].split('?')[0] or 'index.html')))
        for site in (SITE, 'https://odoema.github.io/victor-uringtho-portfolio/'):
            await pg.route(site + '**', serve(site))
        await pg.goto(f'http://127.0.0.1:{port}/', wait_until='domcontentloaded'); await pg.wait_for_timeout(5500)
        html = await pg.evaluate(CLEAN); await b.close()
    srv.shutdown()
    html = size_images(html)
    assert 'id="vu-app"' in html and 'VU_SNAPSHOT' in html
    (DOCS / 'index.html').write_text(html, encoding='utf-8'); print('prerendered', len(html), 'bytes')
asyncio.run(main())
