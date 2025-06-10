const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;

// console.log("APIKEY for code review:::",apiKey)

if (!apiKey) {
  console.log("API key not found")
  throw new Error("API key is missing. Please set REACT_APP_GOOGLE_API_KEY in your .env file");
}

const genAI = new GoogleGenerativeAI(apiKey);

const codeReview = async (req, res) => {
  console.log("Reached CodeReview controller",apiKey);
  
  try {
    const { code, problemDescription, language } = req.body;

    if (!code) {
      return res.status(400).json({ error: "Code is required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Problem Description:
      ${problemDescription || 'No description provided'}
      
      Analyze the following ${language} code solution:
      ${code}
      
      Provide a detailed review with these sections:
      1. Correctness: Does it solve the problem correctly? [rating]/10
      2. Efficiency: Time and space complexity analysis
      3. Code Quality: Readability, structure, and best practices
      4. Edge Cases: Handling of edge cases mentioned in the problem
      5. Improvement Suggestions: Specific actionable recommendations
      
      Format your response with clear sections and bullet points.
      Be concise but thorough.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log(text);

    res.json({ review: text });
  } catch (error) {
    console.error("AI Review Error:", error);
    
    // Handle different error types
    if (error.message.includes("API key not valid") || error.message.includes("API_KEY")) {
      return res.status(401).json({ error: "Invalid API key" });
    }
    if (error.message.includes("content policy")) {
      return res.status(400).json({ error: "Content violates policy" });
    }
    
    res.status(500).json({ 
      error: "Failed to analyze code",
      details: error.message
    });
  }
};

module.exports = codeReview;