const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeOutgoingMail = async (req, res, next) => {
  try {
    const { emailContent } = req.body;

    if (!emailContent) {
      return res.status(400).json({ message: 'Email content is required for analysis.' });
    }

    const prompt = `Analyze the following outgoing email content for characteristics that might cause it to be flagged as spam by email filters or perceived as unprofessional by recipients.
    1. Identify any words or phrases that commonly trigger spam filters or sound unprofessional, overly promotional, or deceptive.
    2. For each identified word/phrase, suggest alternative, more professional, clear, and less spammy wording that conveys the same intent effectively.
    3. Generate a "Spam-Filter-Friendliness Score" for the email on a scale of 0 to 100, where 0 means it's highly likely to be flagged as spam or is very unprofessional, and 100 means it's perfectly clean, professional, and unlikely to be flagged.
    4. Provide a concise remark based on the Spam-Filter-Friendliness Score. Use remarks like "High Risk of Spam Flagging", "Needs Significant Revision for Professionalism", "Moderate Risk, Review Recommended", "Good, Minor Improvements Possible", "Excellent, Very Spam-Filter-Friendly".

    Format your response as a JSON object with the following structure:
    {
      "spamKeywords": [{ "keyword": "...", "suggestion": "..." }],
      "spamFreeScore": 0-100, // Renamed from spamFreeScore for clarity based on new prompt
      "remark": "...",
      "llmRawResponse": "..."
    }

    Email Content:
    "${emailContent}"`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.0-pro' }); // Using gemini-1.0-pro as discussed
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    let analysisResult;
    try {
      analysisResult = JSON.parse(text);
    } catch (parseError) {
      // If LLM doesn't return perfect JSON, try to extract relevant parts or return raw text
      console.warn("LLM response was not perfect JSON:", text);
      analysisResult = {
        spamKeywords: [],
        spamFreeScore: 50, // Default if parsing fails
        remark: "Could not parse LLM response fully. Please check raw response.",
        llmRawResponse: text
      };
    }

    res.status(200).json(analysisResult);

  } catch (error) {
    console.error('Error during outgoing mail analysis:', error);
    next(error);
  }
};

module.exports = {
  analyzeOutgoingMail,
};