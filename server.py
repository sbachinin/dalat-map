from http.server import HTTPServer, SimpleHTTPRequestHandler

# this server is meant to provide immediate cache expiration
# to test changes on mobile.
# It works (but it might be that simple http-server provides the same).

# visit it from mobile: [ip address]:8080
# how to get ip address:
    # "ipconfig" in powershell
    # Look for "IPv4 Address" in the section "Wireless LAN adapter Wi-Fi"
# other ports won't work (8080 is made available by "port forwarding" btw windows and wsl)
# comp and mobile must be connected to same wifi
# after both connect to a new wifi, ip needs to be changed

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
