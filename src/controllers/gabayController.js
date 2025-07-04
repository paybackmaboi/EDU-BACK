import axios from 'axios';

const API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

const cleanAiResponse = (responseText) => {
    return responseText.replace(/```json/g, '').replace(/```/g, '').trim();
}

// --- AI Chatbot Logic ---
export const handleChat = async (req, res) => {
    const { message, careerTitle, history } = req.body;

    const chatPrompt = `
        You are "Gabay AI", a friendly, encouraging, and supportive career guide for a Filipino BPO professional who is upskilling.
        Their target career is: "${careerTitle}".
        Their current chat history with you is: ${JSON.stringify(history)}
        The user's new message is: "${message}"

        Your tasks:
        1.  Keep your tone positive and motivational. Use Filipino-friendly language where appropriate (e.g., "kaya mo 'yan!", "galing!", "po").
        2.  Answer their questions concisely based on the context of their career goal.
        3.  If they ask for resources, suggest well-known free platforms like YouTube, freeCodeCamp, or TESDA.
        4.  If the question is outside of career guidance, remind the user that you are built to assist your carreer in a good way.
        
        Respond with just your text reply.
    `;

    try {
        const aiResponse = await axios.post(GEMINI_URL, {
            contents: [{ parts: [{ text: chatPrompt }] }],
        });
        const reply = aiResponse.data.candidates[0].content.parts[0].text;
        res.status(200).json({ reply });
    } catch (error) {
        console.error("Gabay AI chat error:", error.response ? error.response.data : error.message);
        res.status(500).json({ message: "Sorry, Gabay AI is taking a break right now." });
    }
};


// --- AI Job Opportunity Generation Logic ---
export const getOpportunities = async (req, res) => {
    const { careerTitle } = req.body;

    const opportunitiesPrompt = `
        You are a Filipino Tech Recruiter AI. Your task is to generate 5 realistic, entry-level job opportunities for someone transitioning into a "${careerTitle}" role in the Philippines.

        For each job:
        - Create a believable company name (e.g., a startup, a local tech company, or a multinational).
        - List 3-4 key responsibilities.
        - List 3-4 essential qualifications, focusing on entry-level skills.
        - Mention a specific location in the Philippines (e.g., "Makati City", "Cebu IT Park", "Remote").
        - Use a realistic monthly salary range in PHP.

        Respond ONLY with a valid JSON array matching this structure:
        [
            {
              "jobTitle": "string",
              "company": "string",
              "location": "string",
              "salary": "string",
              "responsibilities": ["string"],
              "qualifications": ["string"]
            }
        ]
    `;

    try {
        const aiResponse = await axios.post(GEMINI_URL, {
            contents: [{ parts: [{ text: opportunitiesPrompt }] }],
        });

        const jsonData = cleanAiResponse(aiResponse.data.candidates[0].content.parts[0].text);
        const opportunities = JSON.parse(jsonData);

        res.status(200).json(opportunities);

    } catch (error) {
        console.error("Gabay AI opportunities error:", error.response ? error.response.data : error.message);
        res.status(500).json({ message: "Could not fetch job opportunities at this time." });
    }
};

export const getDashboardData = async (req, res) => {
    const dashboardPrompt = `
        You are a labor market data analyst AI for the Philippines, specializing in the BPO industry. Your task is to generate a realistic but fictional dataset for a BPO career dashboard.

        Your response MUST be a single, valid JSON object with no extra text or markdown. The structure must be:
        {
          "totalBpoProfessionals": 1350000,
          "currentlyEmployed": 1215000,
          "seekingNewRole": 135000,
          "successfulTransitions": 25430,
          "topHiringCompanies": [
            { "name": "Accenture Philippines", "hiringCount": 780 },
            { "name": "Concentrix", "hiringCount": 650 },
            { "name": "Teleperformance", "hiringCount": 610 },
            { "name": "Sitel Group", "hiringCount": 550 },
            { "name": "Alorica", "hiringCount": 490 }
          ],
          "demandTrend": [
            { "month": "Jan", "demand": 5200 },
            { "month": "Feb", "demand": 5500 },
            { "month": "Mar", "demand": 6100 },
            { "month": "Apr", "demand": 5800 },
            { "month": "May", "demand": 6500 },
            { "month": "Jun", "demand": 7200 }
          ],
          "predictiveInsight": "Based on current hiring trends and new foreign investments in the IT-BPM sector, we project a 12-15% increase in demand for tech-adjacent roles like 'QA Analyst' and 'IT Support' in the next quarter. Professionals with foundational IT skills will be highly sought after."
        }
    `;

    try {
        const aiResponse = await axios.post(GEMINI_URL, {
            contents: [{ parts: [{ text: dashboardPrompt }] }],
        });

        const jsonData = cleanAiResponse(aiResponse.data.candidates[0].content.parts[0].text);
        const dashboardData = JSON.parse(jsonData);

        res.status(200).json(dashboardData);

    } catch (error) {
        console.error("Dashboard data generation error:", error.response ? error.response.data : error.message);
        res.status(500).json({ message: "Could not fetch dashboard data at this time." });
    }
};



