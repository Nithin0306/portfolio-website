import os

HERO_MAP = [
    "kkkkkkkkkk",
    "kKKKKKKKKk",
    "kKgKKKKKKk",
    "kKKgKKKKKk",
    "kKgKKggKKk",
    "kkkkkkkkkk",
    "..rrrrrr..",
    ".rrrrrrrr.",
    ".rrrrrrrr.",
    "..nnnnnn..",
    "..nn..nn..",
    ".kkk..kkk."
]

PAL = {
    "k": "#1a1208",
    "K": "#0e1f14",
    "g": "#8be28b",
    "r": "#ff5c5c",
    "n": "#3a5bd9"
}

rects = []
scale = 16
for y, row in enumerate(HERO_MAP):
    for x, ch in enumerate(row):
        if ch in PAL:
            rects.append(f'  <rect x="{x*scale}" y="{y*scale}" width="{scale}" height="{scale}" fill="{PAL[ch]}" />')

svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {10*scale} {12*scale}" width="{10*scale}" height="{12*scale}" shape-rendering="crispEdges">
{'\\n'.join(rects)}
</svg>
'''

with open("assets/favicon.svg", "w") as f:
    f.write(svg_content)

print("Favicon SVG generated successfully!")
