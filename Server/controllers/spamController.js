const { GoogleGenerativeAI } = require('@google/generative-ai');

// Access your API key as an environment variable
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API);

const detectSpam = async (req, res, next) => {
  try {
    const { domain, subject, body, detectionMethods } = req.body;

    if (!detectionMethods || detectionMethods.length === 0) {
      return res.status(400).json({ message: 'No detection methods selected.' });
    }

    let prompt = "Carefully analyze the following email content to determine if it is **unequivocally SPAM or legitimate (NOT_SPAM)**. An email should only be classified as **SPAM** if it contains clear, strong, and malicious indicators such as phishing attempts, deceptive links, unsolicited financial offers, malware distribution, or content that is clearly harmful or fraudulent. Promotional or marketing emails, even if unsolicited, are generally considered **NOT_SPAM** unless they exhibit these malicious or deceptive characteristics. If there is any ambiguity, or if the email is merely promotional without harmful intent, classify it as **NOT_SPAM**. Respond with 'SPAM' if it is definitely spam, and 'NOT_SPAM' if it is legitimate. Provide a concise and objective reason for your classification, explicitly pointing out the strong spam indicators if present, or stating the absence of such indicators for a legitimate classification.\n\n";

    if (detectionMethods.includes('domain') && domain) {
      prompt += `Domain: ${domain}\n`;
    }
    if (detectionMethods.includes('subject') && subject) {
      prompt += `Subject: ${subject}\n`;
    }
    if (detectionMethods.includes('body') && body) {
      prompt += `Body: ${body}\n`;
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Simple parsing: check if the response contains "SPAM"
    const isSpam = text.toUpperCase().includes('SPAM');
    const reasonMatch = text.match(/(Reason:.*?)(?:\n|$)/i);
    const reason = reasonMatch ? reasonMatch[1].trim() : "No specific reason provided by LLM.";

    res.status(200).json({ isSpam, llmResponse: text, reason });
  } catch (error) {
    console.error('Error during spam detection:', error);
    next(error);
  }
};

module.exports = {
  detectSpam,
};
