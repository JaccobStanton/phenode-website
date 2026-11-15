"""Digital-stage illustrations for home 04, drawn to match the PheNode app diagrams
(Soil_Probe / Wireless-Sensors / Diagnostics wireframe): #0d56ff outlines, navy #013ec7→#012656
fills, cyan #48f7f5 lights with a blurred blue halo, top-fading body faces.

  python3 scripts/gen-journey-art.py <out-dir> [--dark]

--dark is for a dark page (home 04 is dark blue since Nov 15): the panels are lit blue glass instead of
translucent white (which turns grey on navy), the faint content bars are stronger, and the navy line work
(JSON braces, slider tracks) is lifted so it doesn't disappear into the background."""
import math, sys, os

OUT = sys.argv[1]
DARK = '--dark' in sys.argv[2:]
BLUE, CYAN, NAVY, NAVY2 = '#0d56ff', '#48f7f5', '#002b70', '#012656'
NAVY_LINE = '#2a5bd8' if DARK else NAVY  # navy strokes: lifted on a dark page
PANEL = 'fill="url(#glass)"' if DARK else 'fill="#fff" fill-opacity=".35"'  # window / back sheet
CARD = 'fill="url(#glass)"' if DARK else 'fill="#fff" fill-opacity=".55"'  # the database's row card
op = (lambda x: min(1.0, round(x * 1.7, 2))) if DARK else (lambda x: x)  # faint content bars read stronger on dark

DEFS = f'''<defs>
<linearGradient id="navy" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#013ec7"/><stop offset="1" stop-color="{NAVY2}"/></linearGradient>
<linearGradient id="face" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#013ab5" stop-opacity=".7"/><stop offset=".14" stop-color="#01318b" stop-opacity=".38"/><stop offset=".32" stop-color="#012a6d" stop-opacity=".12"/><stop offset=".55" stop-color="{NAVY2}" stop-opacity="0"/></linearGradient>
<filter id="halo" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="4.5"/></filter>
<filter id="haze" x="-50%" y="-200%" width="200%" height="500%"><feGaussianBlur stdDeviation="9"/></filter>
<linearGradient id="glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b3fb8" stop-opacity=".46"/><stop offset="1" stop-color="#03154a" stop-opacity=".62"/></linearGradient>
<linearGradient id="sheet" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1452d6" stop-opacity=".55"/><stop offset="1" stop-color="#062466" stop-opacity=".7"/></linearGradient>
</defs>'''


def svg(body, w=400, h=300):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" fill="none">{DEFS}{body}</svg>\n'


def light_circle(cx, cy, r, halo=1.0):
    """Cyan light with a blue halo, like the node's hex light and the probe prongs."""
    return (f'<circle cx="{cx}" cy="{cy}" r="{r * 2.1:.1f}" fill="{BLUE}" opacity="{0.75 * halo:.2f}" filter="url(#halo)"/>'
            f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{CYAN}" stroke="{BLUE}" stroke-width="1.2"/>')


def light_path(d, w=2.6):
    return (f'<path d="{d}" stroke="{BLUE}" stroke-width="{w * 3:.1f}" stroke-linecap="round" stroke-linejoin="round" opacity=".7" filter="url(#halo)"/>'
            f'<path d="{d}" stroke="{CYAN}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round"/>')


def haze(cx, cy, rx, ry=8, op=0.22):
    return f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="{BLUE}" opacity="{op}" filter="url(#haze)"/>'


OUTLINE = f'stroke="{BLUE}" stroke-width="2.2" stroke-linejoin="round"'
THIN = f'stroke="{BLUE}" stroke-width="1.2" stroke-opacity=".55"'


# ---------------------------------------------------------------- backend: server stack fed by the field
def backend():
    b = [haze(200, 262, 118)]
    # three field sources converging on the stack (dotted links, packets in flight)
    links = ['M26 92 C 66 92 70 150 104 152', 'M26 156 H104', 'M26 220 C 66 220 70 162 104 160']
    b.append(f'<g stroke="{BLUE}" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="0.5 7">' + ''.join(f'<path d="{d}"/>' for d in links) + '</g>')
    for y in (92, 156, 220):
        b.append(f'<circle cx="22" cy="{y}" r="5.5" fill="url(#navy)" stroke="{BLUE}" stroke-width="1.2"/>')
    for (x, y) in ((60, 107), (70, 156), (60, 205)):
        b.append(light_circle(x, y, 3.4, 0.9))
    # lid + units + plinth
    b.append(f'<rect x="146" y="54" width="108" height="12" rx="3" fill="url(#navy)" stroke="{BLUE}" stroke-width="1.4"/>')
    for i, y in enumerate((66, 128, 190)):
        b.append(f'<rect x="104" y="{y}" width="192" height="56" rx="10" fill="url(#face)" {OUTLINE}/>')
        cy = y + 28
        for k in range(4):  # vents
            b.append(f'<rect x="{121 + k * 11}" y="{cy - 12}" width="5" height="24" rx="2.5" fill="url(#navy)"/>')
        b.append(f'<rect x="178" y="{cy - 4}" width="62" height="8" rx="4" fill="{BLUE}" opacity=".22"/>')  # drive bay
        b.append(f'<circle cx="258" cy="{cy}" r="3" fill="{BLUE}"/>')
        b.append(light_circle(276, cy, 5, 1.0 if i != 1 else 0.8))
    b.append(f'<path d="M118 246 H282 L292 260 H108 Z" fill="url(#navy)" stroke="{BLUE}" stroke-width="1.4" stroke-linejoin="round"/>')
    return svg(f'<g transform="translate(42 0)">{"".join(b)}</g>')


# ---------------------------------------------------------------- processing: noisy in → your rules → clean out
def processing():
    b = [haze(200, 264, 80, 7, 0.2)]
    raw1 = 'M30 158 L40 150 L48 162 L57 146 L65 157 L73 151 L80 156'
    raw2 = 'M100 152 L108 160 L114 147 L120 84 L126 150 L134 158 L141 149 L148 156 L156 152'
    b.append(f'<g stroke="{BLUE}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity=".85"><path d="{raw1}"/><path d="{raw2}"/></g>')
    b.append(f'<path d="M82 155 H98" stroke="{BLUE}" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="0.5 5" opacity=".7"/>')  # gap
    b.append(f'<circle cx="120" cy="84" r="6" stroke="{BLUE}" stroke-width="1.5" fill="none"/>')  # outlier, flagged
    # the gate: three preference sliders
    gx, gw = 162, 76
    b.append(f'<rect x="{gx + 20}" y="38" width="{gw - 40}" height="10" rx="3" fill="url(#navy)" stroke="{BLUE}" stroke-width="1.4"/>')
    b.append(f'<rect x="{gx}" y="48" width="{gw}" height="206" rx="15" fill="url(#face)" {OUTLINE}/>')
    for y, kx in ((100, gx + 24), (152, gx + 52), (204, gx + 36)):
        b.append(f'<path d="M{gx + 14} {y} H{gx + gw - 14}" stroke="{NAVY_LINE}" stroke-width="3.4" stroke-linecap="round" opacity=".5"/>')
        b.append(f'<path d="M{gx + 14} {y} H{kx}" stroke="{BLUE}" stroke-width="3.4" stroke-linecap="round"/>')
        b.append(light_circle(kx, y, 6.2, 1.0))
    # clean, evenly sampled output
    x0, x1 = 244, 374
    xs = [x0 + i * 0.5 for i in range(int((x1 - x0) / 0.5) + 1)]
    f = lambda x: 151 - 20 * math.sin((x - x0) / (x1 - x0) * 2 * math.pi * 0.95)
    d = 'M' + ' L'.join(f'{x:.1f} {f(x):.1f}' for x in xs)
    b.append(light_path(d, 2.8))
    for x in range(x0 + 10, x1 + 1, 20):
        b.append(f'<circle cx="{x}" cy="{f(x):.1f}" r="3.3" fill="{CYAN}" stroke="{BLUE}" stroke-width="1.2"/>')
    return svg(''.join(b))


# ---------------------------------------------------------------- database: drum stack + standardized rows
def database():
    cx, rx, ry, top, bot = 150, 82, 17, 70, 232
    g = [haze(cx, bot + 22, 96)]
    g.append(f'<path d="M{cx - rx} {top} V{bot} A{rx} {ry} 0 0 0 {cx + rx} {bot} V{top}" fill="url(#face)" {OUTLINE}/>')
    for y in (124, 178):
        g.append(light_path(f'M{cx - rx} {y} A{rx} {ry} 0 0 0 {cx + rx} {y}', 2.4))
    g.append(f'<ellipse cx="{cx}" cy="{top}" rx="{rx}" ry="{ry}" fill="url(#navy)" {OUTLINE}/>')
    g.append(f'<ellipse cx="{cx}" cy="{top}" rx="{rx - 16}" ry="{ry - 6}" stroke="{CYAN}" stroke-opacity=".35" stroke-width="1"/>')
    for y in (104, 158, 212):  # activity lights on each drum
        g.append(f'<circle cx="{cx + 52}" cy="{y + 6}" r="2.6" fill="{BLUE}"/>')
        g.append(light_circle(cx + 64, y + 4, 3.4, 0.8))
    # link + row card
    g.append(f'<path d="M{cx + rx + 2} 150 H262" stroke="{BLUE}" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="0.5 6"/>')
    g.append(light_circle(248, 150, 3.4, 0.9))
    x0, y0, w, h = 262, 88, 128, 128
    g.append(f'<rect x="{x0}" y="{y0}" width="{w}" height="{h}" rx="10" {CARD} {OUTLINE}/>')
    g.append(f'<path d="M{x0 + 10} {y0} H{x0 + w - 10} A10 10 0 0 1 {x0 + w} {y0 + 10} V{y0 + 24} H{x0} V{y0 + 10} A10 10 0 0 1 {x0 + 10} {y0} Z" fill="url(#navy)"/>')
    for k, cw in enumerate((24, 34, 22)):
        cxk = x0 + 12 + sum((24, 34, 22)[:k]) + k * 12
        g.append(f'<rect x="{cxk}" y="{y0 + 9}" width="{cw}" height="6" rx="3" fill="{CYAN}" opacity=".85"/>')
    for r in range(4):
        y = y0 + 40 + r * 22
        if r:
            g.append(f'<path d="M{x0 + 10} {y - 11} H{x0 + w - 10}" stroke="{BLUE}" stroke-width="1" stroke-opacity="{op(.22)}"/>')
        for k, cw in enumerate((24, 34, 22)):
            cxk = x0 + 12 + sum((24, 34, 22)[:k]) + k * 12
            if r == 3:
                g.append(f'<rect x="{cxk - 2}" y="{y - 5}" width="{cw + 4}" height="10" rx="5" fill="{BLUE}" opacity=".6" filter="url(#halo)"/>')
                g.append(f'<rect x="{cxk}" y="{y - 3}" width="{cw}" height="6" rx="3" fill="{CYAN}" stroke="{BLUE}" stroke-width=".8"/>')
            else:
                g.append(f'<rect x="{cxk}" y="{y - 3}" width="{cw}" height="6" rx="3" fill="{BLUE}" opacity="{op(.3)}"/>')
    return svg(f'<g transform="translate(-29 0)">{"".join(g)}</g>')


# ---------------------------------------------------------------- dashboard: the PheNode software window
def dashboard():
    b = [haze(200, 266, 140, 8, 0.2)]
    x0, y0, w, h = 40, 44, 320, 214
    b.append(f'<rect x="{x0}" y="{y0}" width="{w}" height="{h}" rx="12" {PANEL}/>')
    b.append(f'<path d="M{x0 + 12} {y0} H{x0 + w - 12} A12 12 0 0 1 {x0 + w} {y0 + 12} V{y0 + 26} H{x0} V{y0 + 12} A12 12 0 0 1 {x0 + 12} {y0} Z" fill="url(#navy)"/>')
    b.append(f'<rect x="{x0}" y="{y0}" width="{w}" height="{h}" rx="12" {OUTLINE}/>')
    b.append(light_circle(x0 + 18, y0 + 13, 3.6, 0.8))
    for k in (1, 2):
        b.append(f'<circle cx="{x0 + 18 + k * 13}" cy="{y0 + 13}" r="3.6" fill="{BLUE}" stroke="#7bfff8" stroke-opacity=".5" stroke-width=".8"/>')
    b.append(f'<rect x="{x0 + 120}" y="{y0 + 9}" width="120" height="8" rx="4" fill="{CYAN}" opacity=".25"/>')
    # chart panel
    cx0, cy0, cw, ch = 56, 86, 196, 104
    b.append(f'<rect x="{cx0}" y="{cy0}" width="{cw}" height="{ch}" rx="7" {THIN}/>')
    for y in (112, 138, 164):
        b.append(f'<path d="M{cx0 + 10} {y} H{cx0 + cw - 10}" stroke="{BLUE}" stroke-width="1" stroke-opacity="{op(.16)}"/>')
    xs = [cx0 + 12 + i for i in range(cw - 23)]
    f1 = lambda x: 150 - 22 * math.sin((x - cx0) / 52) - 8 * math.sin((x - cx0) / 17)
    f2 = lambda x: 162 - 10 * math.sin((x - cx0) / 38 + 1.4)
    b.append(f'<path d="M{" L".join(f"{x} {f2(x):.1f}" for x in xs)}" stroke="{BLUE}" stroke-width="1.6" stroke-opacity=".7" stroke-linejoin="round"/>')
    b.append(light_path('M' + ' L'.join(f'{x} {f1(x):.1f}' for x in xs), 2.4))
    b.append(light_circle(xs[-1], round(f1(xs[-1]), 1), 3.6))
    # map tile: a small mesh of nodes
    mx0, my0 = 266, 86
    b.append(f'<rect x="{mx0}" y="{my0}" width="78" height="64" rx="7" {THIN}/>')
    b.append(f'<path d="M{mx0 + 6} {my0 + 46} C {mx0 + 26} {my0 + 30} {mx0 + 46} {my0 + 54} {mx0 + 72} {my0 + 36} M{mx0 + 6} {my0 + 24} C {mx0 + 30} {my0 + 10} {mx0 + 50} {my0 + 30} {mx0 + 72} {my0 + 14}" stroke="{BLUE}" stroke-width="1" stroke-opacity=".25"/>')
    nodes = [(mx0 + 16, my0 + 18), (mx0 + 58, my0 + 14), (mx0 + 30, my0 + 46), (mx0 + 56, my0 + 44)]
    b.append(f'<path d="M{nodes[0][0]} {nodes[0][1]} L{nodes[3][0]} {nodes[3][1]} L{nodes[1][0]} {nodes[1][1]} M{nodes[2][0]} {nodes[2][1]} L{nodes[3][0]} {nodes[3][1]}" stroke="{BLUE}" stroke-width="1" stroke-dasharray="1 3" stroke-opacity=".7"/>')
    for (x, y) in nodes[:3]:
        b.append(f'<circle cx="{x}" cy="{y}" r="3" fill="{BLUE}"/>')
    b.append(f'<circle cx="{nodes[3][0]}" cy="{nodes[3][1]}" r="8" stroke="{CYAN}" stroke-opacity=".6" stroke-width="1"/>')
    b.append(light_circle(*nodes[3], 3.6))
    # image tile
    ix0, iy0 = 266, 160
    b.append(f'<rect x="{ix0}" y="{iy0}" width="78" height="82" rx="7" {THIN}/>')
    b.append(f'<path d="M{ix0 + 6} {iy0 + 74} L{ix0 + 26} {iy0 + 46} L{ix0 + 38} {iy0 + 58} L{ix0 + 52} {iy0 + 40} L{ix0 + 72} {iy0 + 74} Z" fill="url(#navy)" opacity=".9"/>')
    b.append(light_circle(ix0 + 56, iy0 + 20, 6, 0.9))
    # status cards under the chart
    for k in range(3):
        x = 56 + k * 69
        b.append(f'<rect x="{x}" y="202" width="58" height="40" rx="7" {THIN}/>')
        b.append(f'<rect x="{x + 10}" y="213" width="{30 - k * 4}" height="7" rx="3.5" fill="url(#navy)"/>')
        b.append(f'<rect x="{x + 10}" y="227" width="38" height="4" rx="2" fill="{BLUE}" opacity="{op(.3)}"/>')
    b.append(light_circle(56 + 46, 216, 3, 0.8))
    return svg(''.join(b))


# ---------------------------------------------------------------- export: CSV + JSON you can download
def export():
    b = [haze(210, 268, 120, 8, 0.2)]
    # back sheet: JSON / API (content sits in the part the CSV sheet doesn't cover)
    bx, by, bw, bh = 200, 30, 130, 166
    b.append(f'<rect x="{bx}" y="{by}" width="{bw}" height="{bh}" rx="9" {PANEL}/>')
    b.append(f'<rect x="{bx}" y="{by}" width="{bw}" height="{bh}" rx="9" fill="url(#face)" {OUTLINE}/>')
    top = by + 46
    brace = lambda x, s: (f'M{x + 7 * s} {top} C{x + 2 * s} {top} {x + 2 * s} {top + 4} {x + 2 * s} {top + 9} V{top + 18} '
                          f'C{x + 2 * s} {top + 23} {x - 1 * s} {top + 25} {x - 4 * s} {top + 25} C{x - 1 * s} {top + 25} {x + 2 * s} {top + 27} {x + 2 * s} {top + 32} '
                          f'V{top + 41} C{x + 2 * s} {top + 46} {x + 2 * s} {top + 50} {x + 7 * s} {top + 50}')
    lx, rx_ = bx + 42, bx + bw - 14
    b.append(f'<path d="{brace(lx, 1)}" stroke="{NAVY_LINE}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>')
    b.append(f'<path d="{brace(rx_, -1)}" stroke="{NAVY_LINE}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>')
    for k, (wk, wv) in enumerate(((16, 30), (12, 38), (20, 22))):
        y = top + 10 + k * 13
        b.append(f'<rect x="{lx + 14}" y="{y}" width="{wk}" height="6" rx="3" fill="{BLUE}" opacity=".55"/>')
        b.append(f'<rect x="{lx + 19 + wk}" y="{y}" width="{wv}" height="6" rx="3" fill="{CYAN}" opacity=".95"/>')
    b.append(f'<rect x="{lx - 6}" y="{by + 16}" width="44" height="7" rx="3.5" fill="url(#navy)"/>')
    for k in range(3):
        b.append(f'<rect x="{lx - 4}" y="{by + 118 + k * 13}" width="{70 - k * 16}" height="5" rx="2.5" fill="{BLUE}" opacity="{op(.22)}"/>')
    # front sheet: CSV with a folded corner
    fx, fy, fw, fh, fold = 84, 64, 140, 178, 26
    sheet = (f'M{fx + 9} {fy} H{fx + fw - fold} L{fx + fw} {fy + fold} V{fy + fh - 9} A9 9 0 0 1 {fx + fw - 9} {fy + fh} '
             f'H{fx + 9} A9 9 0 0 1 {fx} {fy + fh - 9} V{fy + 9} A9 9 0 0 1 {fx + 9} {fy} Z')
    if DARK:
        b.append(f'<path d="{sheet}" fill="url(#sheet)"/>')
    else:
        b.append(f'<path d="{sheet}" fill="#f4f2ec"/>')
        b.append(f'<path d="{sheet}" fill="#fff" fill-opacity=".6"/>')
    b.append(f'<path d="{sheet}" fill="url(#face)" {OUTLINE}/>')
    b.append(f'<path d="M{fx + fw - fold} {fy} V{fy + fold - 4} A4 4 0 0 0 {fx + fw - fold + 4} {fy + fold} H{fx + fw} Z" fill="url(#navy)" stroke="{BLUE}" stroke-width="1.6" stroke-linejoin="round"/>')
    cols = ((26, 0), (36, 38), (28, 86))
    b.append(f'<rect x="{fx + 14}" y="{fy + 40}" width="{fw - 28}" height="14" rx="4" fill="url(#navy)"/>')
    b.append(f'<path d="M{fx + 50} {fy + 54} V{fy + fh - 12} M{fx + 96} {fy + 54} V{fy + fh - 12}" stroke="{BLUE}" stroke-width="1" stroke-opacity="{op(.18)}"/>')
    for r in range(5):
        y = fy + 70 + r * 20
        b.append(f'<path d="M{fx + 14} {y + 10} H{fx + fw - 14}" stroke="{BLUE}" stroke-width="1" stroke-opacity="{op(.18)}"/>')
        for cw, off in cols:
            b.append(f'<rect x="{fx + 16 + off}" y="{y - 3}" width="{cw}" height="6" rx="3" fill="{BLUE}" opacity="{op(0.42 if off == 0 else 0.26)}"/>')
    # download into a tray
    ax = 290
    b.append(f'<path d="M{ax - 40} 236 V256 A6 6 0 0 0 {ax - 34} 262 H{ax + 34} A6 6 0 0 0 {ax + 40} 256 V236" stroke="{BLUE}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>')
    b.append(light_path(f'M{ax} 204 V246 M{ax - 14} 232 L{ax} 246 L{ax + 14} 232', 3.2))
    return svg(f'<g transform="translate(-7 0)">{"".join(b)}</g>')


for name, fn in (('backend', backend), ('processing', processing), ('database', database), ('dashboard', dashboard), ('export', export)):
    with open(os.path.join(OUT, f'{name}.svg'), 'w') as fh:
        fh.write(fn())
    print('wrote', name)
