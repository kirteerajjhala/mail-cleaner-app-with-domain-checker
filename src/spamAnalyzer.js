// spamAnalyzer.js

// ==============================
// KEYWORDS
// ==============================

const SPAM_KEYWORDS = [
  "free",
  "urgent",
  "limited time",
  "act now",
  "click here",
  "guaranteed",
  "no obligation",
  "100% free",
  "risk free",
  "money back",
  "earn money",
  "make money fast",
  "work from home",
  "be your own boss",
  "million dollars",
  "billionaire",
  "get rich quick",
  "financial freedom",
  "passive income",
  "congratulations",
  "winner",
  "selected",
  "prize",
  "lottery",
  "viagra",
  "pharmacy",
  "pills",
  "medication",
  "prescription",
  "weight loss",
  "diet pills",
  "lose weight fast",
  "miracle cure",
  "increase sales",
  "boost",
  "triple",
  "double",
  "explosive growth",
  "amazing",
  "incredible",
  "unbelievable",
  "revolutionary",
  "call now",
  "order now",
  "buy now",
  "subscribe now",
  "sign up now",
  "limited offer",
  "expires soon",
  "hurry",
  "don't wait",
  "credit",
  "loan",
  "mortgage",
  "refinance",
  "debt",
  "consolidation",
  "casino",
  "gambling",
  "poker",
  "slots",
  "jackpot",
  "adult",
  "xxx",
  "sex",
  "dating",
  "singles",
  "mlm",
  "pyramid",
  "network marketing",
  "referral program",
  "100% free",
  "Act now",
  "Affordable",
  "Apply now",
  "As seen on",
  "Buy",
  "Cash bonus",
  "Click here",
  "Congratulations",
  "Credit",
  "Deal",
  "Discount",
  "Earn",
  "Extra income",
  "Fast cash",
  "Free",
  "Free access",
  "Free gift",
  "Free info",
  "Free membership",
  "Free preview",
  "Get paid",
  "Great offer",
  "Guaranteed",
  "Increase sales",
  "Investment",
  "Limited offer",
  "Lose weight",
  "Lowest price",
  "Make money",
  "Money back",
  "No cost",
  "Offer expires",
  "Once in a lifetime",
  "Opportunity",
  "Order now",
  "Password",
  "Promise",
  "Prize",
  "Risk-free",
  "Sale",
  "Save big",
  "Special promotion",
  "Take action",
  "Trial",
  "Urgent",
  "Winner",
  "Winning",
  "You are a winner",
  "Act fast",
  "Apply today",
  "Bargain",
  "Best price",
  "Big bucks",
  "Big deal",
  "Bonus",
  "Cash",
  "Cheap",
  "Claim",
  "Clearance",
  "Congratulations winner",
  "Credit card",
  "Deal of the day",
  "Discounted",
  "Double your income",
  "Earn extra",
  "Easy terms",
  "Eliminate debt",
  "Fast",
  "Fast cash",
  "Free consultation",
  "Free info",
  "Free investment",
  "Free membership",
  "Free trial",
  "Get out of debt",
  "Gift card",
  "Guarantee",
  "Hurry",
  "Increase traffic",
  "Instant",
  "Instant access",
  "Instant cash",
  "Limited time",
  "Lose weight",
  "Luxury",
  "Million dollars",
  "Money",
  "Money back",
  "No fees",
  "No gimmick",
  "No hidden costs",
  "No obligation",
  "Now only",
  "Offer",
  "One-time",
  "Order today",
  "Profit",
  "Promise you",
  "Risk-free",
  "Sale",
  "Save",
  "Special",
  "Special promotion",
  "Take action",
  "Trial",
  "Urgent",
  "Value",
  "Winner",
  "Winning",
  "Work from home",
  "Act now",
  "Apply now",
  "Call now",
  "Cancel at any time",
  "Cheap",
  "Click below",
  "Click here",
  "Compare rates",
  "Deal",
  "Debt",
  "Discount",
  "Double your",
  "Earn",
  "Eliminate",
  "Fast cash",
  "Free",
  "Free access",
  "Free gift",
  "Free info",
  "Free membership",
  "Free preview",
  "Get paid",
  "Get started",
  "Increase",
  "Investment",
  "Lowest price",
  "Make money",
  "Money back",
  "No cost",
  "Offer expires",
  "Order now",
  "Prize",
  "Pure profit",
  "Special promotion",
  "Take action",
  "Urgent",
  "Winner",
  "Winning bid",
  "Work from home",
  "You are a winner",
  "100% satisfied",
  "Access",
  "Act immediately",
  "Additional income",
  "Amazing",
  "Apply online",
  "Beneficiary",
  "Big bucks",
  "Cash bonus",
  "Cash prize",
  "Clearance",
  "Click below",
  "Congratulations",
  "Credit card offers",
  "Double income",
  "Earn cash",
  "Easy terms",
  "Extra cash",
  "Fast and easy",
  "Financial freedom",
  "Free bonus",
  "Free consultation",
  "Free download",
  "Free info",
  "Free investment",
  "Free membership",
  "Free preview",
  "Free trial",
  "Gift certificate",
  "Guarantee",
  "Huge discount",
  "Increase sales",
  "Income",
  "Instant cash",
  "Instant access",
  "Limited offer",
  "Lose weight",
  "Lowest price",
  "Make money",
  "Money back",
  "No fees",
  "No hidden costs",
  "No obligation",
  "Once in a lifetime",
  "Order today",
  "Passion",
  "Promise",
  "Profit",
  "Risk-free",
  "Save big",
  "Special promotion",
  "Take action",
  "Trial offer",
  "Urgent",
  "Winner",
  "Winning",
  "Act now",
  "Apply now",
  "Bargain",
  "Best price",
  "Big deal",
  "Bonus",
  "Cash",
  "Cheap",
  "Claim",
  "Clearance",
  "Congratulations winner",
  "Credit card",
  "Deal of the day",
  "Discounted",
  "Double your income",
  "Earn extra",
  "Easy terms",
  "Eliminate debt",
  "Fast",
  "Fast cash",
  "Free consultation",
  "Free info",
  "Free investment",
  "Free membership",
  "Free trial",
  "Get out of debt",
  "Gift card",
  "Guarantee",
  "Hurry",
  "Increase traffic",
  "Instant",
  "Instant access",
  "Instant cash",
  "Limited time",
  "Lose weight",
  "Luxury",
  "Million dollars",
  "Money",
  "Money back",
  "No fees",
  "No gimmick",
  "No hidden costs",
  "No obligation",
  "Now only",
  "Offer",
  "One-time",
  "Order today",
  "Profit",
  "Promise you",
  "Risk-free",
  "Sale",
  "Save",
  "Special",
  "Special promotion",
  "Take action",
  "Trial",
  "Urgent",
  "Value",
  "Winner",
  "Winning",
  "Work from home",
  "Act now",
  "Apply now",
  "Call now",
  "Cancel at any time",
  "Cheap",
  "Click below",
  "Click here",
  "Compare rates",
  "Deal",
  "Debt",
  "Discount",
  "Double your",
  "Earn",
  "Eliminate",
  "Fast cash",
  "Free",
  "Free access",
  "Free gift",
  "Free info",
  "Free membership",
  "Free preview",
  "Get paid",
  "Get started",
  "Increase",
  "Investment",
  "Lowest price",
  "Make money",
  "Money back",
  "No cost",
  "Offer expires",
  "Order now",
  "Prize",
  "Pure profit",
  "Special promotion",
  "Take action",
  "Urgent",
  "Winner",
  "Winning bid",
  "Work from home",
  "You are a winner",
];

// ==============================
// REGEX PATTERNS
// ==============================

const SPAM_PATTERNS = [
  /\b\d+%\s*(off|discount|savings?)\b/gi,
  /\$\d+.*(?:per|\/)\s*(?:day|week|month|hour)/gi,
  /(?:earn|make)\s*\$\d+/gi,
  /click\s+here/gi,
  /free\s+(?:trial|sample|gift|money|cash)/gi,
  /(?:urgent|immediate|instant)\s+(?:action|response|reply)/gi,
  /\b(?:viagra|cialis|pharmacy|pills?)\b/gi,
  /\b(?:casino|gambling|poker|lottery|jackpot)\b/gi,
  /(?:congratulations|winner|selected|chosen)/gi,
  /(?:limited|exclusive)\s+(?:time|offer|deal)/gi,
];

// ==============================
// SENDER PATTERNS
// ==============================

const SUSPICIOUS_PATTERNS = [
  /no-reply@/gi,
  /noreply@/gi,
  /info@/gi,
  /support@/gi,
  /admin@/gi,
  /\d{5,}@/gi,
];

// Suspicious TLDs
const SUSPICIOUS_TLDS = [
  ".xyz",
  ".top",
  ".gq",
  ".tk",
  ".ml",
  ".cf",
  ".work",
  ".click",
  ".country",
  ".info",
  ".online",
  ".site",
  ".vip",
  ".loan",
  ".review",
  ".men",
  ".stream",
  ".party",
  ".download",
  ".trade",
  ".webcam",
  ".win",
  ".bid",
  ".buzz",
  ".link",
  ".racing",
  ".date",
  ".cam",
  ".red",
  ".pink",
  ".rocks",
  ".cheap",
  ".club",
  ".guru",
  ".trade",
  ".download",
  ".wang",
  ".lol",
  ".stream",
  ".racing",
  ".science",
  ".center",
  ".zone",
  ".today",
  ".solutions",
  ".space",
  ".tech",
  ".email",
  ".link",
  ".live",
  ".hosting",
  ".network",
  ".express",
  ".clicks",
  ".tips",
  ".support",
  ".services",
  ".business",
  ".site",
  ".online",
  ".store",
  ".world",
  ".money",
  ".website",
  ".company",
  ".digital",
  ".shop",
  ".market",
  ".life",
  ".fun",
  ".news",
  ".social",
  ".games",
  ".media",
  ".tube",
  ".film",
  ".camera",
  ".photos",
  ".video",
  ".audio",
  ".music",
  ".photo",
  ".club",
  ".expert",
  ".app",
  ".chat",
  ".blog",
  ".fashion",
  ".today",
  ".company",
  ".foundation",
  ".academy",
  ".school",
  ".institute",
  ".education",
  ".university",
  ".college",
  ".academy",
  ".work",
  ".services",
  ".consulting",
  ".agency",
  ".group",
  ".solutions",
  ".systems",
  ".capital",
  ".ventures",
  ".partners",
  ".investments",
  ".financial",
  ".management",
  ".tech",
  ".software",
  ".network",
  ".cloud",
  ".hosting",
  ".digital",
  ".online",
  ".site",
  ".store",
  ".shop",
  ".fun",
  ".xyz",
  ".top",
  ".click",
  ".loan",
  ".review",
  ".date",
  ".cam",
  ".red",
  ".pink",
  ".rocks",
  ".cheap",
  ".club",
  ".guru",
  ".trade",
  ".download",
  ".wang",
  ".lol",
  ".stream",
  ".racing",
  ".science",
  ".center",
  ".zone",
  ".today",
  ".solutions",
  ".space",
  ".tech",
  ".email",
  ".link",
  ".live",
  ".hosting",
  ".network",
  ".express",
  ".clicks",
  ".tips",
  ".support",
  ".services",
  ".business",
  ".site",
  ".online",
  ".store",
  ".world",
  ".money",
  ".website",
  ".company",
  ".digital",
  ".shop",
  ".market",
  ".life",
  ".fun",
  ".news",
  ".social",
  ".games",
  ".media",
  ".tube",
  ".film",
  ".camera",
  ".photos",
  ".video",
  ".audio",
  ".music",
  ".photo",
  ".club",
  ".expert",
  ".app",
  ".chat",
  ".blog",
  ".fashion",
  ".today",
  ".company",
  ".foundation",
  ".academy",
  ".school",
  ".institute",
  ".education",
  ".university",
  ".college",
  ".academy",
  ".work",
  ".services",
  ".consulting",
  ".agency",
  ".group",
  ".solutions",
  ".systems",
  ".capital",
  ".ventures",
  ".partners",
  ".investments",
  ".financial",
  ".management",
  ".tech",
  ".software",
  ".network",
  ".cloud",
  ".hosting",
  ".digital",
];

// ==============================
// HELPERS
// ==============================

const MAX_SCORE = 100;

function normalize(text = "") {
  return text.toLowerCase().trim();
}

function clamp(score) {
  return Math.min(score, MAX_SCORE);
}

function riskLevel(score) {
  if (score < 25) return "Low";
  if (score < 50) return "Medium";
  if (score < 75) return "High";
  return "Critical";
}

// ==============================
// KEYWORD COUNT
// ==============================

function countKeywords(text) {
  let count = 0;
  for (const word of SPAM_KEYWORDS) {
    if (text.includes(word)) count++;
  }
  return count;
}

// ==============================
// PATTERN COUNT
// ==============================

function countPatterns(text, patterns) {
  let count = 0;
  for (const pattern of patterns) {
    const matches = text.match(pattern);
    if (matches) count += matches.length;
  }
  return count;
}

// ==============================
// SUBJECT ANALYSIS
// ==============================

function analyzeSubject(subject = "") {
  if (!subject) return null;

  const text = normalize(subject);
  let score = 0;
  const issues = [];

  const keywordHits = countKeywords(text);
  const patternHits = countPatterns(text, SPAM_PATTERNS);

  score += keywordHits * 5;
  score += patternHits * 6;

  if (subject === subject.toUpperCase()) {
    score += 10;
    issues.push("All caps subject");
  }

  if (/!!!|\$\$\$/.test(subject)) {
    score += 8;
    issues.push("Excessive punctuation");
  }

  return {
    score: clamp(score),
    issues,
  };
}

// ==============================
// BODY ANALYSIS
// ==============================

function analyzeBody(body = "") {
  if (!body) return null;

  const text = normalize(body);
  let score = 0;
  const issues = [];

  const keywordHits = countKeywords(text);
  const patternHits = countPatterns(text, SPAM_PATTERNS);

  score += keywordHits * 3;
  score += patternHits * 5;

  // Links
  const links = (body.match(/https?:\/\/|www\./gi) || []).length;
  if (links > 2) {
    score += links * 3;
    issues.push(`Too many links (${links})`);
  }

  // Money symbols
  if (/\$\d+|₹\d+/.test(body)) {
    score += 6;
    issues.push("Money related content");
  }

  // CAPS abuse
  const capsWords = body.match(/[A-Z]{4,}/g) || [];
  if (capsWords.length > 5) {
    score += 8;
    issues.push("Too many capital words");
  }

  return {
    score: clamp(score),
    issues,
  };
}

// ==============================
// SENDER ANALYSIS
// ==============================

function analyzeSender(sender = "") {
  if (!sender) return null;

  const text = normalize(sender);
  let score = 0;
  const issues = [];

  const patternHits = countPatterns(text, SUSPICIOUS_PATTERNS);

  score += patternHits * 10;

  // Suspicious TLD
  for (const tld of SUSPICIOUS_TLDS) {
    if (text.endsWith(tld)) {
      score += 20;
      issues.push("Suspicious TLD");
      break;
    }
  }

  return {
    score: clamp(score),
    issues,
  };
}

// ==============================
// MAIN ANALYZER
// ==============================

export function analyzeEmail({ subject = "", body = "", sender = "" }) {
  const subjectRes = analyzeSubject(subject);
  const bodyRes = analyzeBody(body);
  const senderRes = analyzeSender(sender);

  const totalScore =
    (subjectRes?.score || 0) * 0.3 +
    (bodyRes?.score || 0) * 0.5 +
    (senderRes?.score || 0) * 0.2;

  const finalScore = Math.round(clamp(totalScore));

  return {
    subject: subjectRes,
    body: bodyRes,
    sender: senderRes,
    finalScore,
    risk: riskLevel(finalScore),
  };
}

// src/utils/spamDetection.js

// ==============================
// SUBJECT GENERATOR
// ==============================
export function generateSubjectLines(content, tone = "professional") {
  if (!content) return [];
  const short = content.split(" ").slice(0, 6).join(" ");

  const templates = {
    professional: [
      `Regarding: ${short}`,
      `Important Update: ${short}`,
      `Follow-up on ${short}`,
    ],
    friendly: [
      `Hey! About ${short}`,
      `Just Checking In — ${short}`,
      `Thought You’d Like This`,
    ],
    urgent: [
      `Urgent: ${short}`,
      `Immediate Attention Needed`,
      `Action Required: ${short}`,
    ],
    casual: [`FYI: ${short}`, `Note: ${short}`, `Quick Update: ${short}`],
    formal: [
      `Notice: ${short}`,
      `Formal Update: ${short}`,
      `Official Communication: ${short}`,
    ],
    creative: [
      `Exciting News: ${short}`,
      `You Won’t Believe This: ${short}`,
      `Discover ${short}`,
    ],
  };

  return templates[tone] || templates.professional;
}

// ==============================
// SIMPLE EMAIL SPAM ANALYZER
// ==============================
// export function analyzeEmail({ subject = "", body = "", sender = "" }) {
//   const spamWords = ["free", "winner", "urgent", "click here", "offer", "money"];
//   let score = 100;
//   const detected = [];

//   spamWords.forEach((word) => {
//     if ((subject + " " + body).toLowerCase().includes(word)) {
//       score -= 10;
//       detected.push({ keyword: word, suggestion: "Avoid spammy words" });
//     }
//   });

//   let remark = "";
//   if (score >= 85) remark = "Very safe";
//   else if (score >= 65) remark = "Minor improvements needed";
//   else if (score >= 45) remark = "Moderate spam risk";
//   else remark = "High spam risk";

//   return {
//     finalScore: score,
//     risk: remark,
//     spamKeywords: detected,
//   };
// }
