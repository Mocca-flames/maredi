import http.server
import socketserver
import os

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class CachedHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        path = self.translate_path(self.path)
        if os.path.exists(path):
            ext = os.path.splitext(path)[1].lower()
            if ext in (".html", ".css", ".js"):
                self.send_header("Cache-Control", "no-cache")
            elif ext in (".webp", ".png", ".jpg", ".jpeg", ".gif", ".svg", ".woff2"):
                self.send_header("Cache-Control", "public, max-age=31536000, immutable")
            elif ext == ".webm":
                self.send_header("Cache-Control", "public, max-age=604800")
        super().end_headers()

with socketserver.TCPServer(("", PORT), CachedHTTPRequestHandler) as httpd:
    print(f"Serving at http://localhost:{PORT}")
    print("Press Ctrl+C to stop")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
