SCAMSHIELD AI — LOCAL SERVER

Requirements:
- Python 3 installed on your computer
- No internet connection or external libraries required

Run:
1. Extract this folder if it is in a ZIP file.
2. Double-click start_server.bat.
   Or open Command Prompt in this folder and run: python server.py
3. On the laptop, open: http://127.0.0.1:8000
4. To use it on your phone, connect the phone and laptop to the SAME trusted Wi-Fi. On the laptop, open Command Prompt and run: ipconfig. Find the Wi-Fi adapter IPv4 Address (for example, 192.168.1.20). On the phone browser, open http://192.168.1.20:8000 using your actual IPv4 address.
5. Keep the server window open on the laptop. If Windows Firewall asks, allow Python only on your private network.
6. Press Ctrl+C in the server window to stop it.

What works locally:
- Responsive layout for mobile phones, tablets and laptop/desktop screens
- Mobile navigation menu
- Use from a phone on the same trusted Wi-Fi as the laptop
- Message scam-pattern scanner (rule-based, not a real cloud AI model)
- Message, URL and phone/UPI input tabs
- Sample messages, character counter and clear button
- Scam radar, feature sections and FAQ accordion
- Scam report form, saved on this computer in reports.json
- No Google Fonts, external JavaScript, CSS libraries, remote APIs, or external page links are loaded.

Important:
- The scanner uses local pattern matching. It does not visit a URL or verify a live website.
- Submitted reports are saved only on this computer; they are NOT sent to police or any authority.
- Official reporting and live website checks require internet access and should be done separately.
- Keep reports.json private if reports contain phone numbers or other personal information.
