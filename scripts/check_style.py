#!/usr/bin/env python3
"""Kontrola stylu DoRoboty.ai: wykrywa wartości poza tokenami.

Użycie (z katalogu repo):
  python3 scripts/check_style.py            # porównaj z bazą znanych odstępstw landingu
  python3 scripts/check_style.py --update   # zapisz obecny stan jako bazę (po świadomej zmianie landingu)
  python3 scripts/check_style.py --all      # pokaż wszystkie znaleziska, także z bazy

Reguły: surowy kolor (#hex, rgb/rgba/hsl), promień w px, rozmiar czcionki w px (poza var/clamp),
nieużywana lub niezdefiniowana zmienna var(--x), klasa z HTML bez definicji w CSS.
tokens.css jest wyjątkiem (tam wartości powstają). Nowe pliki (np. app.css) nie mają bazy: zero tolerancji.
Kod wyjścia 1, gdy są znaleziska spoza bazy.
"""
import json, re, sys, pathlib, collections

ROOT = pathlib.Path(__file__).resolve().parent.parent
BASE = ROOT / 'scripts' / 'style_baseline.json'
CSS = [p for p in sorted(list(ROOT.glob('*.css')) + list(ROOT.glob('app/*.css'))) if p.name != 'tokens.css']
HTML = sorted(list(ROOT.glob('*.html')) + list(ROOT.glob('app/*.html')))
TOKENS = ROOT / 'tokens.css'
LEGACY = {'styles.css', 'index.html'}  # stary kod landingu: baza znanych odstępstw; nowe pliki mają zero tolerancji

COLOR = re.compile(r'#(?!000\b)[0-9a-fA-F]{3,8}\b|\brgba?\([^)]*\)|\bhsla?\([^)]*\)')
RADIUS = re.compile(r'border-radius\s*:\s*([^;}]*)')
FONT = re.compile(r'font-size\s*:\s*([^;}]*)')
VAR = re.compile(r'var\((--[a-zA-Z0-9-]+)')
DEF = re.compile(r'(--[a-zA-Z0-9-]+)\s*:')

def strip_comments(t):
    return re.sub(r'/\*.*?\*/', lambda m: re.sub(r'[^\n]', ' ', m.group(0)), t, flags=re.S)

def findings():
    out = []
    defined = set(DEF.findall(strip_comments(TOKENS.read_text())))
    texts = {}
    for p in CSS:
        texts[p.name] = strip_comments(p.read_text())
        defined |= set(DEF.findall(texts[p.name]))  # lokalne zmienne (np. --v, --c)
    for h in HTML:
        t = h.read_text()
        for m in re.finditer(r'<style[^>]*>(.*?)</style>', t, flags=re.S):
            texts[h.name + '<style>'] = strip_comments(m.group(1))
        for m in re.finditer(r'style="([^"]*)"', t):
            defined |= set(DEF.findall(m.group(1)))
            texts.setdefault(h.name + '[style=]', '')
            texts[h.name + '[style=]'] += m.group(1) + ';\n'
    for name, t in texts.items():
        for i, line in enumerate(t.splitlines(), 1):
            for m in COLOR.finditer(line):
                out.append((name, 'surowy-kolor', m.group(0).replace(' ', ''), i))
            for m in RADIUS.finditer(line):
                v = m.group(1).strip()
                px = re.findall(r'(\d+(?:\.\d+)?)px', v)
                if px and 'var(' not in v and v != '0' and max(float(x) for x in px) > 4:
                    out.append((name, 'promien-px', v, i))
            for m in FONT.finditer(line):
                v = m.group(1).strip()
                if re.search(r'\d+(\.\d+)?px', v) and 'var(' not in v and 'clamp(' not in v:
                    out.append((name, 'czcionka-px', v, i))
            for v in VAR.findall(line):
                if v not in defined:
                    out.append((name, 'zmienna-niezdefiniowana', v, i))
    # klasy z HTML bez definicji w CSS
    css_all = ' '.join(texts[k] for k in texts if k.endswith('.css'))
    css_all += TOKENS.read_text()
    known = set(re.findall(r'\.([a-zA-Z_][\w-]*)', css_all))
    for h in HTML:
        for i, line in enumerate(h.read_text().splitlines(), 1):
            for m in re.finditer(r'class="([^"]*)"', line):
                for c in m.group(1).split():
                    if c not in known:
                        out.append((h.name, 'klasa-bez-css', c, i))
    return out

def key(f):
    return f'{f[0]}|{f[1]}|{f[2]}'

def main():
    fs = findings()
    cnt = collections.Counter(key(f) for f in fs)
    if '--update' in sys.argv:
        legacy = {k: v for k, v in cnt.items() if k.split('|')[0] in LEGACY}
        BASE.write_text(json.dumps(dict(sorted(legacy.items())), ensure_ascii=False, indent=1))
        print(f'Zapisano bazę (tylko stary kod: {", ".join(sorted(LEGACY))}): {len(legacy)} wzorców, {sum(legacy.values())} znalezisk.')
        return 0
    base = json.loads(BASE.read_text()) if BASE.exists() else {}
    new, seen = [], collections.Counter()
    for f in fs:
        k = key(f); seen[k] += 1
        if seen[k] > base.get(k, 0):
            new.append(f)
    by = collections.Counter((f[0], f[1]) for f in fs)
    print('Znaleziska (wszystkie) wg pliku i reguły:')
    for (n, r), c in sorted(by.items()):
        print(f'  {n:24} {r:24} {c}')
    if '--all' in sys.argv:
        for f in fs: print(f'    {f[0]}:{f[3]} {f[1]} {f[2]}')
    print(f'\nSpoza bazy (nowe odstępstwa): {len(new)}')
    for f in new:
        print(f'  {f[0]}:{f[3]}  {f[1]}  {f[2]}')
    return 1 if new else 0

if __name__ == '__main__':
    sys.exit(main())
