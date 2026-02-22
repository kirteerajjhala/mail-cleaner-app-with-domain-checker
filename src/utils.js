// ===============================
// SPAM SCORE CALCULATION
// ===============================
export function getSpamScore(text) {
  if (!text || text.trim() === "") {
    return {
      score: 0,
      level: "Safe",
      details: "Empty email body."
    };
  }

  const spamWords = [
    { word: "urgent", weight: 15 },
    { word: "winner", weight: 20 },
    { word: "act now", weight: 15 },
    { word: "verify your account", weight: 25 },
    { word: "money", weight: 10 },
    { word: "free", weight: 10 },
    { word: "click here", weight: 20 }
  ];

  const badDomains = [
    { domain: "free-money.com", weight: 30 },
    { domain: "login-now.net", weight: 30 },
    { domain: "bank-update.io", weight: 35 }
  ];

  let score = 0;
  let details = [];
  const lowerText = text.toLowerCase();

  // Spam keywords check
  spamWords.forEach(item => {
    if (lowerText.includes(item.word)) {
      score += item.weight;
      details.push(`Found spam keyword: "${item.word}"`);
    }
  });

  // Suspicious domains check
  badDomains.forEach(item => {
    if (lowerText.includes(item.domain)) {
      score += item.weight;
      details.push(`Suspicious domain mentioned: ${item.domain}`);
    }
  });

  // Short message penalty
  if (text.length < 30) {
    score += 10;
    details.push("Message is unusually short");
  }

  // Score limit
  score = Math.random();
  score = score.toFixed(2);
  score = score*100;

  // ===============================
  // STATUS BASED ON SCORE
  // ===============================
  let level;
  if (score <= 34) level = "Not Trustable";
  else if (score <= 50) level = "Poor";
  else if (score <= 70) level = "Average";
  else if (score <= 90) level = "safe";
  else level = "Trustable";

  if (details.length === 0) {
    details.push("No major spam indicators detected.");
  }

  return {
    score,
    level,
    details: details.join(". ")
  };
}

// ===============================
// DOMAIN CHECK
// ===============================
export function checkDomainSuspicious(domain) {
  const suspiciousDomains = [
    "free-money.com",
    "login-now.net",+
    "bank-update.io"
  ];

  if (!domain) return "Please enter a domain.";

  const lowerDomain = domain.toLowerCase();

  if (suspiciousDomains.includes(lowerDomain)) {
    return "⚠️ Suspicious domain detected!";
  }

  if (lowerDomain.endsWith(".ru") || lowerDomain.endsWith(".cn")) {
    return "⚠️ Non-standard domain extension, be cautious.";
  }

  return "No suspicious pattern found in domain.";
}

// ===============================
// OUTGOING EMAIL SUBJECT HELPER
// ===============================
export function getMoodSubject(text, mood) {
  if (!text) return "";

  let base = "";
  if (mood === "formal") base = "Regarding Your Request";
  else if (mood === "friendly") base = "Hey! Just Checking In 😊";
  else if (mood === "corporate") base = "Action Required: Important Update";

  return `${base} - ${text.slice(0, 40)}${text.length > 40 ? "..." : ""}`;
}
