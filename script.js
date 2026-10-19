/**
 * ScamShield AI - Interactive Security & AI Analysis Engine
 * Pure vanilla JavaScript - Lightweight, fast, and easy to understand.
 */

// --- Pre-loaded Real-World Scam & Safe Samples ---
const scamSamples = {
    electricity: "Dear Consumer, your electricity power supply will be disconnected tonight at 9:30 PM from the electricity office because your previous month's bill was not updated. Please immediately contact our officer at +91 9876543210 or visit bit.ly/power-pay to avoid blackout.",
    job: "Hello! We have an urgent part-time work-from-home vacancy. Earn ₹3,500 to ₹8,000 daily by simply rating Google Map locations and liking YouTube videos. No experience needed. Join our Telegram coordinator now: @EarnDailyTask_Official.",
    bank: "URGENT ALERT: Your Bank Savings Account has been temporarily restricted due to pending KYC deactivation. Update your PAN & Aadhaar immediately at https://hdfc-kyc-verify-portal.xyz/login to prevent permanent account freeze.",
    lottery: "Congratulations! You have been selected as the grand winner of ₹25,00,000 in the 2026 Kaun Banega Crorepati WhatsApp Lucky Draw! To process your payout, send your PAN copy and a processing fee of ₹1,499 via UPI to prize-claim@okaxis.",
    safe: "Hi dad, I reached the college campus safely. Classes start at 10 AM today. Will call you during lunch break around 1:30 PM!"
};

// ==== ENGINE START ====

// --- Whole-word term matching (so "pan" does not match "company") ---
function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function findTerms(lower, terms) {
    return terms.filter(term => {
        const startsWord = /[a-z0-9]/.test(term[0]);
        const endsWord = /[a-z0-9]/.test(term[term.length - 1]);
        const pattern = (startsWord ? '(?<![a-z0-9])' : '') +
            escapeRegex(term) +
            (endsWord ? '(?![a-z0-9])' : '');
        return new RegExp(pattern, 'i').test(lower);
    });
}

// --- Build the final verdict object from a score + flags ---
function buildResult(rawScore, flags, mode) {
    const score = Math.min(Math.max(rawScore, 5), 98);

    let category = 'safe';
    let title = 'Appears Safe & Low Risk';
    let icon = '✅';
    let summary = 'ScamShield AI did not detect common scam patterns, phishing domains, urgency language, or financial traps in this text.';
    let recommendations = [
        'Content looks standard and normal.',
        'Still remain cautious when sharing sensitive personal data with unknown contacts.'
    ];

    if (mode === 'url') {
        summary = 'ScamShield AI did not detect common phishing traits in this web address.';
        recommendations = [
            'Even if an address looks fine, type the official website yourself instead of following links from messages.',
            'Never enter OTP, PIN or card details on a page you reached from an unexpected message.'
        ];
    }

    if (score >= 65) {
        category = 'high';
        title = 'High Risk Scam Detected!';
        icon = '🚨';
        summary = 'DANGER: This exhibits classic social engineering or phishing tactics used in fraudulent operations. Interacting with this sender or clicking links poses severe risk of financial loss or identity theft.';
        recommendations = [
            'DO NOT click any links, download files, or transfer money.',
            'NEVER share OTP, CVV, ATM PIN, or banking credentials.',
            'Block and report this number/contact immediately.',
            'Remember: Legitimate banks and government officials NEVER threaten disconnection or arrest over text messages.'
        ];
    } else if (score >= 35) {
        category = 'moderate';
        title = 'Suspicious / Potential Risk';
        icon = '⚠️';
        summary = 'CAUTION: This contains moderate fraud indicators such as unverified links or vague requests. Verify authenticity before taking any action.';
        recommendations = [
            'Contact the official service provider via their verified customer support phone number.',
            'Do not rush or panic — scammers rely on urgency to deceive you.',
            'Verify the web address carefully before entering any information.'
        ];
    } else if (mode === 'contact') {
        // A number or UPI ID alone can never be proven genuine, so never say "safe".
        category = 'unknown';
        title = 'Cannot Verify From This Alone';
        icon = 'ℹ️';
        summary = 'ScamShield can only check the format of a phone number or UPI ID. It cannot tell whether the person behind it is genuine, and scammers often use ordinary-looking numbers.';
        recommendations = [
            'Never pay in order to receive money. A genuine refund or prize never needs your UPI PIN or an upfront payment.',
            'Check the name shown in your UPI app before you pay.',
            'If you were contacted unexpectedly, call the organisation back on its official number.',
            'Report suspicious numbers at cybercrime.gov.in or call 1930.'
        ];
    }

    if (flags.length === 0) {
        flags.push(mode === 'contact'
            ? 'No suspicious pattern found in the format, but a number or UPI ID alone cannot be verified.'
            : 'No obvious phishing triggers, urgency tactics, or malicious keywords identified.');
    }

    return { score, category, title, icon, summary, flags, recommendations };
}

// --- Message / SMS / Chat analysis ---
function analyzeMessage(text) {
    const lower = text.toLowerCase();
    const flags = [];
    let score = 5;

    // 1. Psychological urgency triggers
    const urgencyKeywords = [
        'urgent', 'immediately', 'tonight', 'right now', 'within 24 hours', 'last warning',
        'final notice', 'account suspended', 'blocked', 'restricted', 'disconnected',
        'will be disconnected', 'power cut', 'penalty', 'legal action', 'freeze', 'frozen',
        'deactivated', 'you will be arrested'
    ];
    const foundUrgency = findTerms(lower, urgencyKeywords);
    if (foundUrgency.length > 0) {
        score += 25;
        flags.push(`Urgency & Panic Tactics: Uses pressure words ("${foundUrgency.slice(0, 3).join('", "')}") to force hasty decisions.`);
    }

    // 2. Financial bait & unreal rewards (one weak hit counts less than several)
    const rewardKeywords = [
        'lottery', 'winner', 'congratulations', 'you have won', 'you won', 'lucky draw', 'prize',
        '25,00,000', 'earn ₹', 'earn rs', 'daily income', 'part-time', 'part time', 'telegram',
        'crypto', 'bonus', 'claim your', 'cashback', 'jackpot'
    ];
    const foundRewards = findTerms(lower, rewardKeywords);
    if (foundRewards.length > 0) {
        score += foundRewards.length >= 2 ? 30 : 15;
        flags.push('Financial Bait & Unrealistic Offers: Mentions easy cash, high daily returns, or unsolicited lottery winnings.');
    }

    // 3. Phishing, KYC & credential harvesting
    const strongPhishing = [
        'kyc', 'pan card', 'pan copy', 'pan number', 'your pan', 'pan &', 'aadhaar', 'aadhar',
        'debit card', 'credit card', 'cvv', 'net banking', 'otp', 'atm pin', 'upi pin', 'your pin'
    ];
    const weakPhishing = ['password', 'verify', 'update your', 'login to prevent'];
    const foundStrong = findTerms(lower, strongPhishing);
    const foundWeak = findTerms(lower, weakPhishing);
    if (foundStrong.length > 0 || foundWeak.length > 0) {
        score += foundStrong.length > 0 ? 25 : 10;
        flags.push('Sensitive Identity / Credential Request: Inquires about banking info, KYC update, Aadhaar/PAN, or verification.');
    }

    // 4. Suspicious links & shorteners
    const suspiciousLinkTerms = [
        '.xyz', '.top', '.tk', '.online', '.click', '.icu', '.site',
        'bit.ly', 'tinyurl', 'cutt.ly', 't.me', 'wa.me', 'is.gd', 'rb.gy'
    ];
    if (findTerms(lower, suspiciousLinkTerms).length > 0) {
        score += 20;
        flags.push('Suspicious URL / Shortlink: Contains an unverified external link or shortened address masking the real destination.');
    } else if (/https?:\/\//.test(lower)) {
        score += 5;
        flags.push('Contains a link: check the domain carefully before opening it.');
    }

    // 5. Remote access & dangerous software
    const foundRemote = findTerms(lower, [
        'anydesk', 'teamviewer', 'quicksupport', 'rustdesk', 'ultraviewer',
        '.apk', 'apk file', 'install apk', 'download apk'
    ]);
    if (foundRemote.length > 0) {
        score += 35;
        flags.push(`Dangerous Remote Tool / APK Request: Asks to download software ("${foundRemote.join(', ')}") that can take over your phone.`);
    }

    // 6. Impersonation of authorities / utility providers (several hits count much more)
    const foundAuthority = findTerms(lower, [
        'police', 'cbi', 'customs', 'narcotics', 'electricity office', 'electricity board',
        'officer', 'court', 'arrest', 'arrested', 'arrest warrant', 'digital arrest',
        'video call', 'income tax', 'enforcement directorate'
    ]);
    if (foundAuthority.length > 0) {
        score += foundAuthority.length >= 2 ? 35 : 15;
        flags.push('Authority Impersonation: Claims to represent law enforcement, electricity boards, or government agencies.');
    }

    // 7. Upfront payment demands
    const foundPayment = findTerms(lower, [
        'processing fee', 'registration fee', 'security deposit', 'refundable deposit',
        'pay rs', 'pay ₹', 'send ₹', 'send rs', 'via upi', 'transfer money', 'gift card'
    ]);
    if (foundPayment.length > 0) {
        score += 25;
        flags.push(`Upfront Payment Demand: Asks you to pay or send money first ("${foundPayment.slice(0, 2).join('", "')}").`);
    }

    // 8. Fake job / task-scam wording
    const foundJob = findTerms(lower, [
        'work from home', 'work-from-home', 'no experience needed', 'liking youtube',
        'like youtube videos', 'rating google', 'google map', 'telegram coordinator', 'daily by simply'
    ]);
    if (foundJob.length > 0) {
        score += 25;
        flags.push('Fake Job / Task Scam Pattern: Matches common work-from-home "rate, like and earn" task fraud wording.');
    }

    return buildResult(score, flags, 'message');
}

// --- Website / URL analysis ---
const OFFICIAL_DOMAINS = [
    'sbi.co.in', 'onlinesbi.sbi', 'hdfcbank.com', 'icicibank.com', 'axisbank.com', 'kotak.com',
    'paytm.com', 'phonepe.com', 'npci.org.in', 'rbi.org.in', 'cybercrime.gov.in',
    'sancharsaathi.gov.in', 'gov.in', 'nic.in'
];
const URL_SHORTENERS = ['bit.ly', 'tinyurl.com', 'cutt.ly', 't.me', 'rb.gy', 'is.gd', 'goo.gl', 'shorturl.at', 'wa.me'];
const BRAND_WORDS = ['sbi', 'hdfc', 'icici', 'axis', 'paytm', 'phonepe', 'gpay', 'npci', 'rbi', 'kotak', 'pnb', 'upi', 'kyc', 'aadhaar', 'epfo', 'irctc', 'amazon', 'flipkart'];
const LURE_WORDS = ['verify', 'login', 'secure', 'update', 'reward', 'rewards', 'refund', 'claim', 'prize', 'redeem', 'bonus', 'portal'];

function analyzeUrl(text) {
    const raw = text.trim().split(/\s+/)[0];
    const hasProtocol = /^https?:\/\//i.test(raw);
    let url;
    try {
        url = new URL(hasProtocol ? raw : 'http://' + raw);
    } catch (e) {
        return null;
    }
    const host = url.hostname.toLowerCase();
    if (!host.includes('.')) return null;

    const isOfficial = OFFICIAL_DOMAINS.some(d => host === d || host.endsWith('.' + d));
    if (isOfficial) return buildResult(5, [], 'url');

    const flags = [];
    let score = 5;
    const labels = host.split(/[.-]/);

    if (URL_SHORTENERS.includes(host)) {
        score += 30;
        flags.push(`Shortened Link: "${host}" hides the real destination.`);
    }
    if (/\.(xyz|top|tk|ml|ga|cf|gq|click|icu|online|site|live|buzz|link|rest)$/.test(host)) {
        score += 25;
        flags.push(`Risky Domain Ending: "${host}" uses a cheap extension often seen in phishing sites.`);
    }
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) {
        score += 35;
        flags.push('Raw IP Address: Genuine banks and services use proper domain names.');
    }
    if (hasProtocol && url.protocol === 'http:') {
        score += 10;
        flags.push('Not Encrypted: The address uses http instead of https.');
    }
    const brand = BRAND_WORDS.find(b => labels.some(l => l === b || (b.length >= 4 && l.includes(b))));
    if (brand) {
        score += 30;
        flags.push(`Possible Brand Impersonation: Uses "${brand}" in the name but is not the official domain.`);
    }
    if (LURE_WORDS.some(w => labels.some(l => l.includes(w)))) {
        score += 15;
        flags.push('Lure Words in Domain: Words like verify, login, rewards or refund are common in fake sites.');
    }
    if ((host.match(/-/g) || []).length >= 2) {
        score += 15;
        flags.push('Many Hyphens: Long hyphenated names are a common look-alike domain trick.');
    }
    if (labels.length >= 5) {
        score += 10;
        flags.push('Many Subdomains: Deeply nested subdomains can disguise the real site.');
    }
    if (raw.includes('@')) {
        score += 25;
        flags.push('Contains "@": Text before "@" in a link can disguise the real destination.');
    }
    if (host.includes('xn--')) {
        score += 30;
        flags.push('Look-alike Characters: Punycode (xn--) domains can imitate real brands.');
    }
    if (/\.apk$/i.test(url.pathname)) {
        score += 40;
        flags.push('APK Download: Links that install an app file outside the official store are dangerous.');
    }

    return buildResult(score, flags, 'url');
}

// --- Phone number / UPI ID analysis (format-based only, can never prove "safe") ---
const KNOWN_UPI_HANDLES = [
    'okaxis', 'okhdfcbank', 'oksbi', 'okicici', 'ybl', 'ibl', 'axl', 'paytm', 'apl',
    'upi', 'sbi', 'icici', 'hdfcbank', 'axisbank', 'kotak', 'pnb', 'barodampay', 'fbl'
];
const UPI_LURE_WORDS = [
    'refund', 'prize', 'claim', 'reward', 'lottery', 'winner', 'cashback', 'kyc', 'helpdesk',
    'support', 'customercare', 'official', 'officer', 'police', 'gov', 'jackpot'
];

function analyzeContact(text) {
    const t = text.trim();
    const compact = t.replace(/[\s\-()]/g, '');
    const isUpi = /^[a-z0-9._-]{2,}@[a-z]{2,}$/i.test(t);
    const isPhone = /^\+?\d{6,15}$/.test(compact);
    if (!isUpi && !isPhone) return null;

    const flags = [];
    let score = 5;

    if (isUpi) {
        const [name, handle] = t.toLowerCase().split('@');
        const lure = UPI_LURE_WORDS.find(w => name.includes(w));
        if (lure) {
            score += 40;
            flags.push(`Lure Word in UPI ID: "${lure}" is typical of fake refund, prize and support IDs.`);
        }
        if (!KNOWN_UPI_HANDLES.includes(handle)) {
            score += 15;
            flags.push(`Unrecognised UPI Handle: "@${handle}" is not a common bank handle.`);
        }
    } else {
        const indian = /^(\+?91|0)?[6-9]\d{9}$/.test(compact);
        if (!indian) {
            score += 15;
            flags.push('Not a standard Indian mobile number: international and unusual numbers are often used in scam calls.');
        }
        if (compact.startsWith('+') && !compact.startsWith('+91')) {
            score += 10;
            flags.push('International Prefix: Unexpected calls or messages from abroad deserve extra caution.');
        }
    }

    return buildResult(score, flags, 'contact');
}

// --- Pick the right analyzer for the selected tab (falls back to message analysis) ---
function runAnalysis(text, tab) {
    let result = null;
    if (tab === 'url') result = analyzeUrl(text);
    else if (tab === 'upi') result = analyzeContact(text);
    return result || analyzeMessage(text);
}

// ==== ENGINE END ====

// --- DOM Element References ---
const scanInput = document.getElementById('scanInput');
const scanBtn = document.getElementById('scanBtn');
const clearBtn = document.getElementById('clearBtn');
const charCount = document.getElementById('charCount');
const scanProgressBox = document.getElementById('scanProgressBox');
const progressBarFill = document.getElementById('progressBarFill');
const progressStatusText = document.getElementById('progressStatusText');
const resultBox = document.getElementById('resultBox');

const verdictTag = document.getElementById('verdictTag');
const verdictIcon = document.getElementById('verdictIcon');
const verdictTitle = document.getElementById('verdictTitle');
const riskScoreCircle = document.getElementById('riskScoreCircle');
const scoreValue = document.getElementById('scoreValue');
const resultSummary = document.getElementById('resultSummary');
const flagsList = document.getElementById('flagsList');
const recList = document.getElementById('recList');

const tabButtons = document.querySelectorAll('.tab-btn');
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');
const scamReportForm = document.getElementById('scamReportForm');
const reportSuccessMsg = document.getElementById('reportSuccessMsg');

let currentTab = 'message';

// --- Character Counter ---
if (scanInput) {
    scanInput.addEventListener('input', () => {
        const length = scanInput.value.trim().length;
        charCount.textContent = `${length} character${length === 1 ? '' : 's'}`;
    });
}

// --- Tab Switching Logic ---
function setTab(tab) {
    currentTab = tab;
    tabButtons.forEach(b => b.classList.toggle('active', b.dataset.tab === tab));

    if (tab === 'url') {
        scanInput.placeholder = "Enter or paste website URL to inspect (e.g. 'http://sbi-rewards-redeem.xyz/login')...";
    } else if (tab === 'upi') {
        scanInput.placeholder = "Enter phone number or UPI handle (e.g. '+91 9876543210' or 'refund-desk@okaxis')...";
    } else {
        scanInput.placeholder = "Paste the suspicious text, message, or link here... (e.g. 'Dear customer, your bank account is blocked today...')";
    }
}

tabButtons.forEach(btn => {
    btn.addEventListener('click', () => setTab(btn.dataset.tab));
});

// --- Quick Sample Loader Function ---
window.loadSample = function(type) {
    if (scamSamples[type]) {
        // Samples are messages, so make sure the message analyzer is active
        setTab('message');
        scanInput.value = scamSamples[type];
        charCount.textContent = `${scanInput.value.length} characters`;
        scanInput.focus();
        // Clear previous results when loading a new sample
        resultBox.classList.add('hidden');
    }
};

// --- Clear Button Handler ---
if (clearBtn) {
    clearBtn.addEventListener('click', () => {
        scanInput.value = '';
        charCount.textContent = '0 characters';
        resultBox.classList.add('hidden');
        scanProgressBox.classList.add('hidden');
        scanInput.focus();
    });
}

// --- Scan Button Event Listener ---
if (scanBtn) {
    scanBtn.addEventListener('click', () => {
        const text = scanInput.value.trim();
        if (!text) {
            alert('Please paste some text, message, or link to analyze!');
            scanInput.focus();
            return;
        }

        // UI state for scanning
        scanBtn.disabled = true;
        resultBox.classList.add('hidden');
        scanProgressBox.classList.remove('hidden');

        // Progress bar simulation steps
        const steps = [
            { progress: 25, msg: "Inspecting message linguistic patterns..." },
            { progress: 55, msg: "Scanning URLs, shortlinks & phishing signatures..." },
            { progress: 85, msg: "Evaluating social engineering & urgency markers..." },
            { progress: 100, msg: "Generating ScamShield AI safety score..." }
        ];

        let stepIndex = 0;
        progressBarFill.style.width = '10%';
        progressStatusText.textContent = steps[0].msg;

        const interval = setInterval(() => {
            stepIndex++;
            if (stepIndex < steps.length) {
                progressBarFill.style.width = steps[stepIndex].progress + '%';
                progressStatusText.textContent = steps[stepIndex].msg;
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    scanProgressBox.classList.add('hidden');
                    scanBtn.disabled = false;
                    renderResult(runAnalysis(text, currentTab));
                }, 350);
            }
        }, 300);
    });
}

// --- Render Result Card (uses textContent so user input can never inject HTML) ---
function renderListItem(listEl, icon, text) {
    const li = document.createElement('li');
    const iconSpan = document.createElement('span');
    iconSpan.textContent = icon;
    const textSpan = document.createElement('span');
    textSpan.textContent = text;
    li.appendChild(iconSpan);
    li.appendChild(document.createTextNode(' '));
    li.appendChild(textSpan);
    listEl.appendChild(li);
}

function renderResult(result) {
    resultBox.classList.remove('hidden');

    // Reset modifier classes
    resultBox.classList.remove('risk-high', 'risk-moderate', 'risk-safe', 'risk-unknown');
    resultBox.classList.add(`risk-${result.category}`);

    verdictIcon.textContent = result.icon;
    verdictTitle.textContent = result.title;
    scoreValue.textContent = `${result.score}%`;
    resultSummary.textContent = result.summary;

    // Render Red Flags
    flagsList.innerHTML = '';
    result.flags.forEach(flag => renderListItem(flagsList, '⚠️', flag));

    // Render Recommendations
    recList.innerHTML = '';
    result.recommendations.forEach(rec => renderListItem(recList, '🛡️', rec));

    // Smooth scroll down to result
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// --- FAQ Accordion Logic ---
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        // Close others
        faqItems.forEach(i => i.classList.remove('active'));
        // Toggle current
        if (!isOpen) {
            item.classList.add('active');
        }
    });
});

// --- Scam Report Form Handler ---
if (scamReportForm) {
    scamReportForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('reportSubmitBtn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Scam Report';
            reportSuccessMsg.classList.remove('hidden');
            scamReportForm.reset();

            setTimeout(() => {
                reportSuccessMsg.classList.add('hidden');
            }, 6000);
        }, 800);
    });
}

// --- Mobile Navigation Toggle ---
if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('show');
    });

    // Close menu when clicking any nav link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('show');
        });
    });
}

// --- Interactive Cybersecurity Particle Network Background ---
function initCyberBackground() {
    const canvas = document.getElementById('cyberCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles = [];
    let animationFrameId = null;

    // Mouse state for subtle interactive attraction
    const mouse = {
        x: null,
        y: null,
        radius: 150
    };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Particle colors: cyan, golden amber, violet, electric blue
    const colors = [
        { r: 0, g: 210, b: 255 },     // Cyan
        { r: 245, g: 158, b: 11 },    // Amber
        { r: 168, g: 85, b: 247 },    // Violet
        { r: 59, g: 130, b: 246 }     // Electric Blue
    ];

    class Particle {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            this.x = initial ? Math.random() * width : (Math.random() < 0.5 ? 0 : width);
            this.y = initial ? Math.random() * height : Math.random() * height;
            // Slow, organic drift speed
            const speed = 0.2 + Math.random() * 0.45;
            const angle = Math.random() * Math.PI * 2;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.radius = 1.2 + Math.random() * 1.8;
            this.baseAlpha = 0.35 + Math.random() * 0.45;
            this.alpha = this.baseAlpha;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.pulseSpeed = 0.015 + Math.random() * 0.02;
            this.pulseAngle = Math.random() * Math.PI * 2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce gently off edges
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // Keep within bounds
            if (this.x < -10) this.x = width + 10;
            if (this.x > width + 10) this.x = -10;
            if (this.y < -10) this.y = height + 10;
            if (this.y > height + 10) this.y = -10;

            // Twinkle / pulse
            this.pulseAngle += this.pulseSpeed;
            this.alpha = this.baseAlpha + Math.sin(this.pulseAngle) * 0.2;

            // Mouse interaction (gentle proximity nudge)
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.hypot(dx, dy);
                if (dist < mouse.radius && dist > 1) {
                    const force = (1 - dist / mouse.radius) * 0.8;
                    this.x -= (dx / dist) * force;
                    this.y -= (dy / dist) * force;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${Math.max(0.1, this.alpha)})`;
            ctx.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.8)`;
            ctx.shadowBlur = 8;
            ctx.fill();
        }
    }

    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        // Adjust particle count to screen size: ~35 on mobile, ~75 on desktop
        const targetCount = Math.max(30, Math.min(85, Math.floor((width * height) / 16000)));
        particles = [];
        for (let i = 0; i < targetCount; i++) {
            particles.push(new Particle());
        }
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resize, 150);
    });

    const maxLineDist = 125;
    const maxLineDistSq = maxLineDist * maxLineDist;

    function render() {
        ctx.clearRect(0, 0, width, height);

        // Reset shadow for line drawing efficiency
        ctx.shadowBlur = 0;

        // Draw connecting neural lines
        const pLen = particles.length;
        for (let i = 0; i < pLen; i++) {
            const p1 = particles[i];
            for (let j = i + 1; j < pLen; j++) {
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distSq = dx * dx + dy * dy;

                if (distSq < maxLineDistSq) {
                    const dist = Math.sqrt(distSq);
                    const lineAlpha = (1 - dist / maxLineDist) * 0.22;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 210, 255, ${lineAlpha})`;
                    ctx.lineWidth = 0.85;
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }

            // Interactive line to mouse cursor
            if (mouse.x !== null && mouse.y !== null) {
                const dx = p1.x - mouse.x;
                const dy = p1.y - mouse.y;
                const distSq = dx * dx + dy * dy;
                if (distSq < 180 * 180) {
                    const dist = Math.sqrt(distSq);
                    const lineAlpha = (1 - dist / 180) * 0.35;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(245, 158, 11, ${lineAlpha})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }

        // Draw and update particles
        for (let i = 0; i < pLen; i++) {
            particles[i].update();
            particles[i].draw();
        }

        // Only keep looping if document is visible
        if (!document.hidden) {
            animationFrameId = requestAnimationFrame(render);
        }
    }

    // Pause when tab is inactive to preserve battery
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        } else {
            animationFrameId = requestAnimationFrame(render);
        }
    });

    resize();
    render();
}

// Start background animation once DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCyberBackground);
} else {
    initCyberBackground();
}
