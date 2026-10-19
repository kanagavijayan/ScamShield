# 🛡️ ScamShield AI - Web Application

A modern, fast, and simple web application for **ScamShield AI** designed to protect users against digital frauds, phishing messages, fake KYC alerts, and scam phone numbers.

Built with **pure HTML, CSS, and Vanilla JavaScript** — no complex build tools, `npm`, or heavy frameworks required.

---

## 🚀 How to Run the Website

### Option 1: Double Click (Simplest)
1. Open File Explorer and navigate to:
   ```
   D:\leraning\scamshield
   ```
2. Double-click **`index.html`** to open it in your default web browser (Google Chrome, Microsoft Edge, Firefox, etc.).

### Option 2: Using VS Code Live Server
1. Open the folder `D:\leraning\scamshield` in VS Code.
2. Right-click on `index.html` and click **"Open with Live Server"**.

---

## 🌟 Key Features

1. **Interactive AI Scam & Fraud Analyzer**:
   - Paste any suspicious SMS, WhatsApp message, email, URL, or UPI handle.
   - Click one-tap sample buttons (`Electricity Bill Cut-off`, `WFH Job Scam`, `Bank KYC Deactivation`, `Lottery Win`, `Safe message`) to test right away.
   - Animated AI scanning progress with multi-stage heuristic analysis.
   - Dynamic Risk Meter (0–100%) with categorized severity:
     - 🚨 **High Risk Scam** (Urgency, fake domains, identity harvesting, remote APK triggers)
     - ⚠️ **Suspicious / Potential Risk**
     - ✅ **Safe & Low Risk**
   - Detailed breakdown of detected red flags and clear, actionable defense recommendations.

2. **Trending Scam Radar Feed**:
   - Highlights the most common emerging scams (Electricity Bill Disconnection, Digital Arrest / Police Impersonation, Part-Time Telegram Task Scams) and teaches users the exact trap mechanisms.

3. **Community Scam Reporting**:
   - Interactive report submission form to crowdsource and flag new fraud numbers, links, and scripts.

4. **Emergency Helplines & Awareness**:
   - Quick links and direct helpline details for National Cybercrime Portal (`1930`), Sanchar Saathi, and RBI security guidelines.

5. **Cybersecurity Dark Mode Aesthetic**:
   - Glassmorphism, neon glow accents, responsive mobile navigation, and interactive FAQ accordion.

---

## 📁 File Structure

```
d:\leraning\scamshield\
│
├── index.html        # Semantic HTML structure, sections, and forms
├── style.css         # Modern cybersecurity dark theme, animations & responsive styles
├── script.js         # AI scam heuristic detection engine & UI interactions
└── README.md         # Documentation & guide
```

---

## 💡 How the Detection Engine Works (`script.js`)

The engine checks messages for 6 key fraud indicators:
- **Urgency & Panic Tactics**: Words like *"immediately"*, *"account suspended"*, *"tonight"*, *"power cut"*.
- **Financial Bait**: *"Won ₹25 Lakhs"*, *"daily income ₹5000"*, *"lottery"*, *"prepaid crypto task"*.
- **Sensitive Credential Harvesting**: Requests for *"KYC update"*, *"Aadhaar"*, *"PAN"*, *"OTP"*, *"PIN"*.
- **Suspicious URLs & Domains**: Shortlinks (`bit.ly`, `tinyurl`) and suspicious TLDs (`.xyz`, `.top`).
- **Remote Access Tools**: Prompting downloads of `AnyDesk`, `TeamViewer`, or unofficial `.apk` files.
- **Authority Impersonation**: Pretending to be police, electricity boards, or CBI officers.

