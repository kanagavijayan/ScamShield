SCAMSHIELD AI — LOCAL SERVER

Requirements:
- Python 3 installed on your computer
- No internet connection or external libraries required

Run:
1. Extract this folder if it is in a ZIP file.
2. Double-click start_server.bat.
   Or open Command Prompt in this folder and run: python server.py
3. Open your browser and go to: http://127.0.0.1:8000
4. Keep the server window open while using the website.
5. Press Ctrl+C in the server window to stop it.

What works locally:
- Responsive navigation and section links
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
