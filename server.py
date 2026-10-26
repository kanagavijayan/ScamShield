from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import json
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parent
REPORTS_FILE = ROOT / 'reports.json'
HOST = '0.0.0.0'
PORT = 8000

class ScamShieldHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def do_GET(self):
        if self.path.split('?', 1)[0] == '/api/reports':
            reports = []
            if REPORTS_FILE.exists():
                try:
                    reports = json.loads(REPORTS_FILE.read_text(encoding='utf-8'))
                except (json.JSONDecodeError, OSError):
                    reports = []
            body = json.dumps({'reports': reports}, ensure_ascii=False).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        if self.path == '/':
            self.path = '/index.html'
        return super().do_GET()

    def do_POST(self):
        if self.path.split('?', 1)[0] != '/api/reports':
            self.send_error(404, 'Not found')
            return
        try:
            length = int(self.headers.get('Content-Length', '0'))
            if length <= 0 or length > 100_000:
                raise ValueError('Invalid request size')
            report = json.loads(self.rfile.read(length).decode('utf-8'))
            category = str(report.get('category', '')).strip()[:80]
            sender = str(report.get('sender', '')).strip()[:500]
            details = str(report.get('details', '')).strip()[:5000]
            if not category or not sender or not details:
                self.send_error(400, 'Category, sender and details are required')
                return
            reports = []
            if REPORTS_FILE.exists():
                try:
                    reports = json.loads(REPORTS_FILE.read_text(encoding='utf-8'))
                except (json.JSONDecodeError, OSError):
                    reports = []
            saved = {
                'id': len(reports) + 1,
                'category': category,
                'sender': sender,
                'details': details,
                'createdAt': str(report.get('createdAt') or datetime.now(timezone.utc).isoformat())
            }
            reports.append(saved)
            REPORTS_FILE.write_text(json.dumps(reports, ensure_ascii=False, indent=2), encoding='utf-8')
            body = json.dumps({'ok': True, 'report': saved}, ensure_ascii=False).encode('utf-8')
            self.send_response(201)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        except (ValueError, UnicodeDecodeError, json.JSONDecodeError):
            self.send_error(400, 'Invalid report data')

if __name__ == '__main__':
    print(f'ScamShield AI is running on this computer at http://127.0.0.1:{PORT}')
    print('To open it on your phone: connect both devices to the same Wi-Fi, run ipconfig on this computer, then open http://YOUR-PC-IP:8000 on the phone.')
    print('Use only on a trusted private Wi-Fi. Press Ctrl+C to stop. Reports are stored in reports.json on this computer.')
    ThreadingHTTPServer((HOST, PORT), ScamShieldHandler).serve_forever()
