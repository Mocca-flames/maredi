import os
import io
import re
from PIL import Image

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def ensure_dirs():
    os.makedirs(os.path.join(BASE_DIR, "assets", "optimized"), exist_ok=True)
    os.makedirs(os.path.join(BASE_DIR, "css"), exist_ok=True)
    os.makedirs(os.path.join(BASE_DIR, "js"), exist_ok=True)

def get_size(path):
    try:
        return os.path.getsize(path)
    except OSError:
        return 0

def optimize_webp_images():
    raw_dir = os.path.join(BASE_DIR, "assets", "raw")
    opt_dir = os.path.join(BASE_DIR, "assets", "optimized")
    results = []
    for fname in os.listdir(raw_dir):
        if not fname.lower().endswith(".webp"):
            continue
        src = os.path.join(raw_dir, fname)
        dst = os.path.join(opt_dir, fname)
        before = get_size(src)
        try:
            with Image.open(src) as img:
                img = img.convert("RGBA") if img.mode in ("P", "LA") else img.convert("RGB")
                img.save(dst, "WEBP", quality=80, method=6)
            after = get_size(dst)
            results.append((fname, before, after))
        except Exception as e:
            print(f"  [WARN] Failed to optimize {fname}: {e}")
    return results

def optimize_logo():
    src = os.path.join(BASE_DIR, "assets", "logo.png")
    opt_dir = os.path.join(BASE_DIR, "assets", "optimized")
    before = get_size(src)
    results = []
    try:
        with Image.open(src) as img:
            webp_path = os.path.join(opt_dir, "logo.webp")
            img.save(webp_path, "WEBP", quality=85, method=6)
            results.append(("logo.webp", before, get_size(webp_path)))

            if before > 100 * 1024:
                png_path = os.path.join(opt_dir, "logo.png")
                img.save(png_path, "PNG", optimize=True)
                results.append(("logo.png", before, get_size(png_path)))
    except Exception as e:
        print(f"  [WARN] Failed to optimize logo: {e}")
    return results

def minify_css(src_path, dst_path):
    with open(src_path, "r", encoding="utf-8") as f:
        css = f.read()

    css = re.sub(r"/\*.*?\*/", "", css, flags=re.DOTALL)

    css = css.replace("\r\n", "\n").replace("\r", "\n")
    lines = css.split("\n")
    cleaned = []
    for line in lines:
        line = line.strip()
        if line:
            cleaned.append(line)
    css = " ".join(cleaned)
    css = re.sub(r"\s*([{}:;,])\s*", r"\1", css)
    css = re.sub(r";}", "}", css)
    css = re.sub(r"\s*\{\s*", "{", css)
    css = re.sub(r"\s*\}\s*", "}", css)
    css = re.sub(r"\s*\(\s*", "(", css)
    css = re.sub(r"\s*\)\s*", ")", css)
    css = re.sub(r"\s*,\s*", ",", css)
    css = re.sub(r"\s*:\s*", ":", css)
    css = re.sub(r"\s*;\s*", ";", css)
    css = re.sub(r"[ \t]+", " ", css)
    css = css.strip()

    with open(dst_path, "w", encoding="utf-8") as f:
        f.write(css)
    return get_size(src_path), get_size(dst_path)

def minify_js(src_path, dst_path):
    with open(src_path, "r", encoding="utf-8") as f:
        js = f.read()

    def strip_comments(code):
        out = []
        i = 0
        length = len(code)
        in_string = None
        in_comment = None
        while i < length:
            ch = code[i]
            if in_comment:
                if in_comment == "block":
                    if ch == "*" and i + 1 < length and code[i + 1] == "/":
                        in_comment = None
                        i += 2
                    else:
                        i += 1
                elif in_comment == "line":
                    if ch == "\n":
                        in_comment = None
                        i += 1
                    else:
                        i += 1
                continue
            if in_string:
                out.append(ch)
                if ch == "\\" and i + 1 < length:
                    i += 1
                    out.append(code[i])
                elif ch == in_string:
                    in_string = None
                i += 1
                continue
            if ch == "'" or ch == '"' or ch == "`":
                in_string = ch
                out.append(ch)
                i += 1
                continue
            if ch == "/" and i + 1 < length:
                nxt = code[i + 1]
                if nxt == "*":
                    in_comment = "block"
                    i += 2
                    continue
                elif nxt == "/":
                    in_comment = "line"
                    i += 2
                    continue
            out.append(ch)
            i += 1
        return "".join(out)

    def collapse_whitespace(code):
        out = []
        i = 0
        length = len(code)
        in_string = None
        while i < length:
            ch = code[i]
            if in_string:
                out.append(ch)
                if ch == "\\" and i + 1 < length:
                    i += 1
                    out.append(code[i])
                elif ch == in_string:
                    in_string = None
                i += 1
                continue
            if ch == "'" or ch == '"' or ch == "`":
                in_string = ch
                out.append(ch)
                i += 1
                continue
            if ch in ("\r", "\n", "\t", " "):
                if out and out[-1] != " ":
                    out.append(" ")
                i += 1
                continue
            out.append(ch)
            i += 1
        return "".join(out)

    no_comments = strip_comments(js)
    minified = collapse_whitespace(no_comments)
    minified = re.sub(r"\s*([{}:;,])\s*", r"\1", minified)
    minified = re.sub(r";\s*}", ";}", minified)
    minified = re.sub(r"\s*\{\s*", "{", minified)
    minified = re.sub(r"\s*\}\s*", "}", minified)
    minified = re.sub(r"\s*\(\s*", "(", minified)
    minified = re.sub(r"\s*\)\s*", ")", minified)
    minified = re.sub(r"\s*,\s*", ",", minified)
    minified = re.sub(r"\s*\.\s*", ".", minified)
    minified = re.sub(r"\s*:\s*", ":", minified)
    minified = re.sub(r"\s*;\s*", ";", minified)
    minified = re.sub(r"\s*\+\s*", "+", minified)
    minified = re.sub(r"\s*-\s*", "-", minified)
    minified = re.sub(r"\s*=\s*", "=", minified)
    minified = re.sub(r"\s*>\s*", ">", minified)
    minified = re.sub(r"\s*<\s*", "<", minified)
    minified = re.sub(r"\s*\/\s*", "/", minified)
    minified = re.sub(r"\s*\*\s*", "*", minified)
    minified = re.sub(r"\s*&\s*", "&", minified)
    minified = re.sub(r"\s*\|\s*", "|", minified)
    minified = re.sub(r"\s*\?\s*", "?", minified)
    minified = re.sub(r"\s*!\s*", "!", minified)
    minified = re.sub(r"\s*~\s*", "~", minified)
    minified = re.sub(r"\s*%\s*", "%", minified)
    minified = re.sub(r"\s*\^\s*", "^", minified)
    minified = re.sub(r"[ \t]+", " ", minified)
    minified = minified.strip()

    with open(dst_path, "w", encoding="utf-8") as f:
        f.write(minified)
    return get_size(src_path), get_size(dst_path)

def write_gitkeep():
    path = os.path.join(BASE_DIR, "assets", "optimized", ".gitkeep")
    with open(path, "w", encoding="utf-8") as f:
        f.write("")

def write_report(report_lines):
    path = os.path.join(BASE_DIR, "optimization_report.txt")
    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(report_lines))

def format_size(size):
    if size < 1024:
        return f"{size} B"
    elif size < 1024 * 1024:
        return f"{size / 1024:.1f} KB"
    else:
        return f"{size / (1024 * 1024):.2f} MB"

def main():
    print("Starting optimization...")
    ensure_dirs()

    report_lines = []
    report_lines.append("=" * 60)
    report_lines.append("Maredi Site Optimization Report")
    report_lines.append("=" * 60)
    report_lines.append("")

    print("Optimizing WebP images in assets/raw/...")
    webp_results = optimize_webp_images()
    if webp_results:
        report_lines.append("WebP Image Optimization (assets/raw/ -> assets/optimized/)")
        report_lines.append("-" * 60)
        for fname, before, after in webp_results:
            pct = ((before - after) / before * 100) if before else 0
            report_lines.append(f"  {fname}: {format_size(before)} -> {format_size(after)} ({pct:.1f}% reduction)")
            print(f"  {fname}: {format_size(before)} -> {format_size(after)}")
        report_lines.append("")

    print("Optimizing logo...")
    logo_results = optimize_logo()
    if logo_results:
        report_lines.append("Logo Optimization")
        report_lines.append("-" * 60)
        logo_src = os.path.join(BASE_DIR, "assets", "logo.png")
        logo_before = get_size(logo_src)
        for fname, before, after in logo_results:
            pct = ((before - after) / before * 100) if before else 0
            report_lines.append(f"  {fname}: {format_size(before)} -> {format_size(after)} ({pct:.1f}% reduction)")
            print(f"  {fname}: {format_size(before)} -> {format_size(after)}")
        report_lines.append("")

    print("Minifying CSS...")
    css_files = [
        ("css/style.css", "css/style.min.css"),
        ("css/loading.css", "css/loading.min.css"),
    ]
    css_results = []
    for src, dst in css_files:
        src_path = os.path.join(BASE_DIR, src)
        dst_path = os.path.join(BASE_DIR, dst)
        if os.path.exists(src_path):
            before, after = minify_css(src_path, dst_path)
            css_results.append((dst, before, after))
            print(f"  {src} -> {dst}: {format_size(before)} -> {format_size(after)}")
    if css_results:
        report_lines.append("CSS Minification")
        report_lines.append("-" * 60)
        for fname, before, after in css_results:
            pct = ((before - after) / before * 100) if before else 0
            report_lines.append(f"  {fname}: {format_size(before)} -> {format_size(after)} ({pct:.1f}% reduction)")
        report_lines.append("")

    print("Minifying JS...")
    js_src = os.path.join(BASE_DIR, "js", "app.js")
    js_dst = os.path.join(BASE_DIR, "js", "app.min.js")
    if os.path.exists(js_src):
        before, after = minify_js(js_src, js_dst)
        pct = ((before - after) / before * 100) if before else 0
        report_lines.append("JS Minification")
        report_lines.append("-" * 60)
        report_lines.append(f"  app.min.js: {format_size(before)} -> {format_size(after)} ({pct:.1f}% reduction)")
        print(f"  app.js -> app.min.js: {format_size(before)} -> {format_size(after)}")

    print("Creating .gitkeep...")
    write_gitkeep()
    report_lines.append("")
    report_lines.append("Gitkeep")
    report_lines.append("-" * 60)
    report_lines.append("  assets/optimized/.gitkeep created")
    report_lines.append("")
    report_lines.append("=" * 60)
    report_lines.append("Optimization complete.")
    report_lines.append("=" * 60)

    write_report(report_lines)
    print("Done. Report written to optimization_report.txt")

if __name__ == "__main__":
    main()
