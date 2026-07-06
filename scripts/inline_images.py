#!/usr/bin/env python3
"""
Post-processing script to convert local image references in Zola's generated HTML files
into inline base64-encoded Data URLs using Python's standard library html.parser.HTMLParser.
No regular expressions are used for HTML parsing.
"""

import sys
import base64
import mimetypes
from pathlib import Path
from urllib.parse import urlparse, unquote
from html.parser import HTMLParser

MIME_MAP = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".avif": "image/avif",
    ".bmp": "image/bmp",
}


def get_image_data_url(image_path: Path) -> str:
    mime_type, _ = mimetypes.guess_type(image_path)
    if not mime_type:
        ext = image_path.suffix.lower()
        mime_type = MIME_MAP.get(ext, "application/octet-stream")

    data = image_path.read_bytes()
    b64_str = base64.b64encode(data).decode("utf-8")
    return f"data:{mime_type};base64,{b64_str}"


def resolve_local_path(src: str, html_file: Path, public_dir: Path) -> Path | None:
    parsed = urlparse(src)
    if parsed.scheme in ("http", "https", "data") or not parsed.path:
        return None

    clean_path = unquote(parsed.path)

    if clean_path.startswith("/"):
        # Root-relative path
        relative_part = clean_path.lstrip("/")
        target = public_dir / relative_part
    else:
        # Relative to HTML file location
        target = (html_file.parent / clean_path).resolve()

    if target.is_file():
        return target
    return None


class ImageInlinerHTMLParser(HTMLParser):
    def __init__(self, html_file: Path, public_dir: Path):
        super().__init__(convert_charrefs=False)
        self.html_file = html_file
        self.public_dir = public_dir
        self.output = []
        self.inlined_count = 0

    def handle_decl(self, decl: str):
        self.output.append(f"<!{decl}>")

    def handle_comment(self, data: str):
        self.output.append(f"<!--{data}-->")

    def handle_pi(self, data: str):
        self.output.append(f"<?{data}>")

    def handle_data(self, data: str):
        self.output.append(data)

    def handle_endtag(self, tag: str):
        self.output.append(f"</{tag}>")

    def _process_tag(self, tag: str, attrs: list[tuple[str, str | None]], is_startend: bool):
        raw_tag = self.get_starttag_text()
        tag_lower = tag.lower()

        if tag_lower in ("img", "source"):
            new_attrs = []
            modified = False

            for attr_name, attr_val in attrs:
                if attr_val is None:
                    new_attrs.append((attr_name, None))
                    continue

                attr_name_lower = attr_name.lower()

                if tag_lower == "img" and attr_name_lower == "src":
                    target_path = resolve_local_path(attr_val, self.html_file, self.public_dir)
                    if target_path:
                        try:
                            data_url = get_image_data_url(target_path)
                            new_attrs.append((attr_name, data_url))
                            modified = True
                            self.inlined_count += 1
                        except Exception as e:
                            print(f"Warning: Failed to inline image {attr_val} in {self.html_file}: {e}")
                            new_attrs.append((attr_name, attr_val))
                    else:
                        new_attrs.append((attr_name, attr_val))

                elif tag_lower == "source" and attr_name_lower == "srcset":
                    parts = attr_val.split(",")
                    new_parts = []
                    srcset_modified = False
                    for part in parts:
                        part_str = part.strip()
                        if not part_str:
                            new_parts.append(part)
                            continue
                        subparts = part_str.split(maxsplit=1)
                        url = subparts[0]
                        target_path = resolve_local_path(url, self.html_file, self.public_dir)
                        if target_path:
                            try:
                                data_url = get_image_data_url(target_path)
                                descriptor = f" {subparts[1]}" if len(subparts) > 1 else ""
                                new_parts.append(f"{data_url}{descriptor}")
                                srcset_modified = True
                                self.inlined_count += 1
                            except Exception as e:
                                print(f"Warning: Failed to inline srcset image {url} in {self.html_file}: {e}")
                                new_parts.append(part)
                        else:
                            new_parts.append(part)

                    if srcset_modified:
                        new_attrs.append((attr_name, ", ".join(new_parts)))
                        modified = True
                    else:
                        new_attrs.append((attr_name, attr_val))
                else:
                    new_attrs.append((attr_name, attr_val))

            if modified:
                formatted_attrs = []
                for k, v in new_attrs:
                    if v is None:
                        formatted_attrs.append(k)
                    else:
                        formatted_attrs.append(f'{k}="{v}"')
                attr_str = (" " + " ".join(formatted_attrs)) if formatted_attrs else ""
                end_slash = " /" if is_startend and raw_tag and raw_tag.rstrip().endswith("/>") else ""
                self.output.append(f"<{tag}{attr_str}{end_slash}>")
                return

        if raw_tag:
            self.output.append(raw_tag)

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]):
        self._process_tag(tag, attrs, is_startend=False)

    def handle_startendtag(self, tag: str, attrs: list[tuple[str, str | None]]):
        self._process_tag(tag, attrs, is_startend=True)


def process_html_file(html_file: Path, public_dir: Path) -> int:
    content = html_file.read_text(encoding="utf-8")
    parser = ImageInlinerHTMLParser(html_file, public_dir)
    parser.feed(content)
    parser.close()

    if parser.inlined_count > 0:
        new_content = "".join(parser.output)
        html_file.write_text(new_content, encoding="utf-8")

    return parser.inlined_count


def main():
    public_dir_arg = sys.argv[1] if len(sys.argv) > 1 else "public"
    public_dir = Path(public_dir_arg).resolve()

    if not public_dir.exists() or not public_dir.is_dir():
        print(f"Error: Directory '{public_dir}' does not exist.")
        sys.exit(1)

    html_files = list(public_dir.rglob("*.html"))
    total_inlined = 0
    modified_files = 0

    for html_file in html_files:
        count = process_html_file(html_file, public_dir)
        if count > 0:
            modified_files += 1
            total_inlined += count

    print(f"Inlined {total_inlined} image(s) across {modified_files} HTML file(s) in '{public_dir}'.")


if __name__ == "__main__":
    main()
