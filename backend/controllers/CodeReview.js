const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;

// console.log("APIKEY for code review:::",apiKey)

if (!apiKey) {
  // console.log("API key not found")
  throw new Error("API key is missing. Please set REACT_APP_GOOGLE_API_KEY in your .env file");
}

const genAI = new GoogleGenerativeAI(apiKey);

const codeReview = async (req, res) => {
  // console.log("Reached CodeReview controller",apiKey);
  
  try {
    const { code, problemDescription, language } = req.body;

    if (!code) {
      return res.status(400).json({ error: "Code is required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

   const prompt = `
**Code Review Request**

**Problem Context:**
${problemDescription || 'No problem description provided'}

**Code to Review (${language}):**
\`\`\`${language}
${code}
\`\`\`

**Review Guidelines:**

Please provide a comprehensive code review with the following structure:

### 1. Correctness Assessment
- [ ] Verify solution against problem requirements
- [ ] Test with sample inputs
- [ ] Identify any logical flaws
- Rating: /10 with justification

### 2. Efficiency Analysis
- **Time Complexity:** 
  - Expected: 
  - Actual: 
  - Analysis:
- **Space Complexity:** 
  - Expected: 
  - Actual: 
  - Analysis:
- Include Big-O notation with proper formatting (e.g., \`O(n)\`, \`O(1)\`)

### 3. Code Quality Evaluation
- **Readability:**
  - Naming conventions
  - Comments/documentation
  - Consistent formatting
- **Structure:**
  - Modularity
  - Function organization
  - Code duplication
- **Best Practices:**
  - Language-specific idioms
  - Error handling
  - Memory management

### 4. Edge Case Verification
- [ ] Empty/null inputs
- [ ] Extreme values
- [ ] Special conditions from problem
- [ ] Error handling robustness

### 5. Improvement Recommendations
- Prioritized list of specific, actionable suggestions
- Include code examples for improvements when applicable
- Highlight critical vs. optional changes

**Output Formatting Requirements:**
- Use Markdown formatting with clear section headers (##)
- Include bullet points for lists
- Use code blocks for code snippets
- Highlight important terms with **bold**
- Separate sections with horizontal rules (---)
- Use emojis sparingly for visual cues (✅, ⚠️, ❌)

**Example Output Structure:**

## 1. Correctness Assessment ✅
- Solves all specified requirements...
- Fails on edge case X...
- Rating: 8/10

## 2. Efficiency Analysis ⚙️
- **Time Complexity:** \`O(n)\` (optimal)  
  - Analysis: Single loop through input...
- **Space Complexity:** \`O(1)\`  
  - Analysis: Uses constant extra space...

---

## 3. Code Quality Evaluation 🛠️
- **Readability:**
  - Excellent variable naming...
  - Could add more comments...
- **Structure:**
  - Well-organized functions...
  - Consider extracting...
`;

// Usage example:
// const review = await getAIReview(prompt);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // console.log(text);

    res.json({ review: text });
  } catch (error) {
    // console.error("AI Review Error:", error);
    
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