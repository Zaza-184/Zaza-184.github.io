#!/usr/bin/env python3
"""التحديث:  python update.py
بيقرا: icons*/ + Originals.xlsx (غير معدّل) + Products.xlsx (أكونتات) + Accessories.xlsx (ملحقات) + Genres.xlsx (تصنيف الألعاب) + config.json
وبيكتب: data/catalog.js
الكتالوج مستقل تمامًا: كل بياناته جوه الفولدر ومش بيقرا أي داتابيز."""
import re, json, difflib, pathlib
from openpyxl import load_workbook

R = pathlib.Path(__file__).parent
cfg = json.loads((R / 'config.json').read_text('utf-8'))
SEC = cfg['sections']
icons_of = lambda d: sorted(p.name for p in (R / d).glob('*.webp')) if (R / d).exists() else []
stem = lambda f: re.sub(r'\s*\(ps2\)$', '', pathlib.PurePosixPath(f).name[:-5], flags=re.I)
norm = lambda s: re.sub(r'[^0-9a-z\u0600-\u06ff]', '', s.lower())
digits = lambda s: re.findall(r'\d+', s)
by = {}
for d in reversed([sc['folder'] for sc in SEC] + cfg.get('extra_icon_folders', [])):  # لو نفس اللعبة في أكتر من فولدر، أول قسم هو اللي يكسب
    by.update({norm(stem(f)): d + '/' + f for f in icons_of(d)})
alias = {k.lower(): v for k, v in cfg['aliases'].items()}
VAR = {'e': 'English', 'ar': 'عربي', 'عربي': 'عربي', 'ultimate': 'Ultimate', 'h': '', 'only': ''}
P45 = r'ps\s*\(?4\s*\+\s*(ps)?\s*5\)?'


def parse(raw):
    s, badges = raw, []
    if re.search(P45, s, re.I):
        s = re.sub(P45, ' ', s, flags=re.I); badges.append('PS4 + PS5')
    if re.search(r'ps5\s*only', s, re.I):
        s = re.sub(r'ps5\s*only', ' ', s, flags=re.I); badges.append('PS5 فقط')
    elif re.search(r'\bps5\b', s, re.I):
        s = re.sub(r'\bps5\b', ' ', s, flags=re.I); badges.append('PS5')
    out = []
    for p in (x.strip() for x in s.split('+') if x.strip()):
        w = p.split()
        while len(w) > 1 and w[-1].lower() in VAR:
            v = VAR[w.pop().lower()]
            if v and v not in badges: badges.append(v)
        out.append(' '.join(w))
    return out, badges


def match(c):
    key = norm(alias.get(c.lower(), c))
    if key in by: return by[key]
    for k in difflib.get_close_matches(key, list(by), 3, 0.86):
        if digits(k) == digits(key): return by[k]


# ---- تصنيف الألعاب: Genres.xlsx (A اللعبة | B التصنيف، وممكن أكتر من تصنيف بعلامة +)
def xrows(name):
    f = R / name
    return list(load_workbook(f, read_only=True).worksheets[0].iter_rows(min_row=2, values_only=True)) if f.exists() else []


gmap, gorder, grows = {}, [], []
for row in xrows('Genres.xlsx'):
    name, g = str(row[0] or '').strip(), str(row[1] or '').strip() if len(row) > 1 else ''
    if not name or not g: continue
    gs = [x.strip() for x in re.split(r'[+،,]', g) if x.strip()]
    f = match(name)
    gmap[norm(stem(f)) if f else norm(name)] = gs
    grows.append((name, f))
    gorder += [x for x in gs if x not in gorder]
pref = cfg.get('genre_order', [])
gorder = [g for g in pref if g in gorder] + [g for g in gorder if g not in pref]
gen_of = lambda title: gmap.get(norm(title), [])

# ---- ألعاب المعدّل: كل قسم = فولدر أيقونات + سعر (config.json ← sections)
games = {}
for sc in SEC:
    games[sc['id']] = [{'title': stem(f), 'icon': sc['folder'] + '/' + f, 'ps2': bool(re.search(r'\(ps2\)$', f[:-5], re.I)),
                        'price': cfg['modded_prices'].get(stem(f), sc['price']), 'genres': gen_of(stem(f))}
                       for f in icons_of(sc['folder'])]

# ---- الأكونتات: من الإكسيل (العمود B اختياري = السعر)
accounts, missing = [], set()
for row in load_workbook(R / 'Products.xlsx', read_only=True).active.iter_rows(min_row=2, values_only=True):
    raw = (row[0] or '').strip() if row else ''
    if not raw: continue
    comps, badges = parse(raw)
    pb = [b for b in badges if b in ('PS4 + PS5', 'PS5 فقط', 'PS5')]
    badges = [b for b in badges if b not in pb]
    cell = str(row[2] or '').upper() if len(row) > 2 else ''  # C = المنصة: PS4 / PS5 / PS4 + PS5
    if '4' in cell or '5' in cell: plats = [x for x, k in (('PS4', '4' in cell), ('PS5', '5' in cell)) if k]
    elif 'PS4 + PS5' in pb: plats = ['PS4', 'PS5']
    elif pb: plats = ['PS5']
    else: plats = ['PS4']
    if len(plats) == 2: badges.insert(0, 'PS4 + PS5')
    items = []
    for c in comps:
        f = match(c)
        if not f: missing.add(c)
        items.append({'title': stem(f) if f else ' '.join(w[:1].upper() + w[1:] for w in c.split()), 'icon': f})
    price = row[1] if len(row) > 1 and isinstance(row[1], (int, float)) else cfg['account_price']
    accounts.append({'name': ' + '.join(i['title'] for i in items), 'items': items, 'badges': badges, 'price': price, 'platforms': plats})

AP = cfg['account_tabs']  # الأكونت المشترك بيظهر في التبويبين
accts = {t['id']: [a for a in accounts if t['platform'] in a['platforms']] for t in AP}

# ---- غير معدّل: Originals.xlsx (A اللعبة | B Off | C Online | D Pr | E المنصة اختياري)
oc = cfg['originals']
originals = []
for row in xrows(oc['file']):
    n = str(row[0] or '').strip()
    if not n: continue
    f = match(n)
    prices = [[t, v] for t, v in zip(oc['types'], row[1:4]) if isinstance(v, (int, float)) and v]
    plat = str(row[4] or '').strip() if len(row) > 4 else ''
    originals.append({'title': n, 'icon': f, 'prices': prices, 'badges': [plat] if plat else [],
                      'genres': gen_of(n) or (gen_of(stem(f)) if f else [])})

# ---- الملحقات: Accessories.xlsx (A الاسم | B السعر | C متوفر نعم/لا | D التصنيف اختياري)
CATS = [('شاحن', 'شواحن'), ('وصلة', 'وصلات وكابلات'), ('كبل', 'وصلات وكابلات'), ('استند', 'استاندات'),
        ('جراب', 'جرابات وسكنات'), ('سكن', 'جرابات وسكنات'), ('شنط', 'جرابات وسكنات'), ('دراع', 'دراعات')]
NO = {'لا', 'no', 'n', '0', 'نفذ', 'نفذت', 'غير متوفر', 'false'}
products = []
for row in xrows('Accessories.xlsx'):
    n = str(row[0] or '').strip()
    if not n: continue
    price = row[1] if len(row) > 1 and isinstance(row[1], (int, float)) and row[1] else None
    st = row[2] if len(row) > 2 else None
    ok = st > 0 if isinstance(st, (int, float)) else str(st or '').strip().lower() not in NO
    cat = (str(row[3] or '').strip() if len(row) > 3 else '') or next((c for k, c in CATS if k in n), 'ملحقات أخرى')
    products.append({'name': n, 'price': price, 'cat': cat, 'in_stock': ok})

tabs = [{'id': sc['id'], 'title': sc['title'], 'symbol': sc.get('symbol', '△'), 'color': sc.get('color', '--tri'), 'kind': 'modded'}
        for sc in SEC if games[sc['id']]]
if originals: tabs.append({'id': 'originals', 'title': oc['title'], 'symbol': '□', 'color': '--sq', 'kind': 'originals'})
tabs += [{'id': t['id'], 'title': t['title'], 'symbol': '○', 'color': '--cir', 'kind': 'accounts'} for t in AP if accts[t['id']]]
tabs.append({'id': 'products', 'title': 'ملحقات', 'symbol': '✕', 'color': '--crs', 'kind': 'products'})
out = {'shop': cfg['shop'], 'phones': cfg['phones'], 'tabs': tabs, 'games': games, 'originals': originals,
       'accts': accts, 'products': products, 'genres': gorder}
(R / 'data').mkdir(exist_ok=True)
(R / 'data' / 'catalog.js').write_text('window.CATALOG=' + json.dumps(out, ensure_ascii=False) + ';', 'utf-8')
print(' | '.join(f"{sc['title']}: {len(games[sc['id']])}" for sc in SEC) +
      f' | {oc["title"]}: {len(originals)} | ' + ' | '.join(f"{t['title']}: {len(accts[t['id']])}" for t in AP) + f' | ملحقات: {len(products)}')
print('ألعاب في الأكونتات من غير أيقونة (ضيف الأيقونة في icons/ أو alias في config.json):')
print('  ' + ' | '.join(sorted(missing)))
allg = [i for l in [*games.values(), originals] for i in l]
nog = [i['title'] for i in allg if not i['genres']]
if nog: print('ألعاب من غير تصنيف (ضيفها في Genres.xlsx):\n  ' + ' | '.join(nog))
titles = {norm(i['title']) for i in allg}
orphan = [n for n, f in grows if not f and norm(n) not in titles]
if orphan: print('أسماء في Genres.xlsx مالهاش لعبة (راجع الاسم):\n  ' + ' | '.join(orphan))
noic = [i['title'] for i in originals if not i['icon']]
if noic: print('ألعاب غير معدّل من غير أيقونة (ضيفها في أي فولدر icons):\n  ' + ' | '.join(noic))
