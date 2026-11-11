"""
Turkish font subsets (Stage 7).

Fontsource splits each variable font into unicode-range subsets. A Turkish page
downloads two of them per family: "latin" (needed) and "latin-ext" (15–33 KB),
of which Turkish uses only five letters: Ğ ğ İ Ş ş. (ı is already in "latin".)

This script cuts those letters (plus the combining marks the latin-ext face
declares) out of the fontsource latin-ext files into small variable WOFF2
files in src/assets/fonts/. Axes, hinting and OpenType layout are kept.
src/styles/global.css serves them with a matching unicode-range.

Reproduce (needs fontTools + brotli):
    python3 scripts/subset-fonts.py

The fonts are SIL OFL 1.1 without Reserved Font Names; modified versions may
be redistributed under the same licence (see each package's LICENSE).
"""

from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "src" / "assets" / "fonts"

# Ğ ğ İ Ş ş + combining macron / diaeresis / dot below (decomposed input).
TURKISH = [0x011E, 0x011F, 0x0130, 0x015E, 0x015F, 0x0304, 0x0308, 0x0329]

FAMILIES = {
    "manrope": "node_modules/@fontsource-variable/manrope/files/manrope-latin-ext-wght-normal.woff2",
    "cormorant-garamond": "node_modules/@fontsource-variable/cormorant-garamond/files/cormorant-garamond-latin-ext-wght-normal.woff2",
}


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for name, source in FAMILIES.items():
        font = TTFont(ROOT / source)
        options = subset.Options()
        options.flavor = "woff2"
        options.layout_features = ["*"]
        options.name_IDs = ["*"]
        options.name_languages = ["*"]
        options.notdef_outline = True
        options.hinting = True
        subsetter = subset.Subsetter(options=options)
        subsetter.populate(unicodes=TURKISH)
        subsetter.subset(font)
        missing = [hex(u) for u in TURKISH[:5] if u not in font.getBestCmap()]
        if missing:
            raise SystemExit(f"{name}: missing {missing}")
        target = OUT / f"{name}-turkish-wght-normal.woff2"
        font.flavor = "woff2"
        font.save(target)
        print(f"{target.relative_to(ROOT)}: {target.stat().st_size} bytes")


if __name__ == "__main__":
    main()
