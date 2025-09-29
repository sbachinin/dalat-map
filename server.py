from http.server import HTTPServer, SimpleHTTPRequestHandler

# this server is meant to provide immediate cache expiration
# to test changes on mobile.
# For now, it's not clear if it really works

# visit it from mobile: 192.168.110.64:8080
# other ports won't work (8080 is made available by "port forwarding" btw windows and wsl)

class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add no-cache headers
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

if __name__ == "__main__":
    port = 8080
    server_address = ("", port)
    httpd = HTTPServer(server_address, NoCacheHandler)
    print(f"Serving on http://localhost:{port}")
    httpd.serve_forever()
