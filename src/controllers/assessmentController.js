import axios from 'axios';
import Assessment from '../models/Assessment.js';
import Roadmap from '../models/Roadmap.js';

const API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

const generateRoadmapPrompt = (jobTitle, quizScore) => {
    return `
        You are an expert career counselor for Filipino BPO professionals transitioning to tech. A user with the job title "${jobTitle}" and a logic quiz score of ${quizScore}/5 needs a personalized career path.

        Your tasks:
        1.  Analyze the job title for transferable skills.
        2.  Based on the skills and a high score (${quizScore}/5), recommend a suitable entry-level tech career like "Data Analyst" or "QA Automation Engineer".
        3.  Generate a 5-module learning roadmap for this career. Prioritize free, high-quality resources from platforms like freeCodeCamp, YouTube, Coursera (free courses), and TESDA Online.
        4.  Provide a realistic entry-level monthly salary range in PHP.

        Respond ONLY with a valid JSON object matching this structure:
        {
          "careerTitle": "string",
          "description": "string",
          "salary_range_php": "string",
          "modules": [
            {
              "title": "string",
              "duration": "string",
              "skills": ["string"],
              "resources": [
                { "name": "string", "url": "string", "provider": "string" }
              ]
            }
          ]
        }
    `;
};

export const createAssessmentAndRoadmap = async (req, res) => {
    const { jobTitle, quizScore } = req.body;
    const userId = req.user.id; // From our protect middleware

    if (!jobTitle || quizScore === undefined) {
        return res.status(400).json({ message: 'Job title and quiz score are required.' });
    }

    try {
        // --- Call Gemini AI ---
        const prompt = generateRoadmapPrompt(jobTitle, quizScore);
        const aiResponse = await axios.post(GEMINI_URL, {
            contents: [{ parts: [{ text: prompt }] }],
        });
        
        // --- Clean and Parse AI Response ---
        // The response is often wrapped in markdown backticks, so we clean it.
        let responseText = aiResponse.data.candidates[0].content.parts[0].text;
        responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const roadmapData = JSON.parse(responseText);

        // --- Save to Database ---
        const assessment = await Assessment.create({
            jobTitle,
            quizScore,
            userId,
        });

        const roadmap = await Roadmap.create({
            careerTitle: roadmapData.careerTitle,
            description: roadmapData.description,
            modules: roadmapData.modules, // Storing the JSON directly
            assessmentId: assessment.id,
        });
        
        // --- Send response to Frontend ---
        res.status(201).json({
            assessment,
            roadmap: {
                ...roadmap.toJSON(),
                salary_range_php: roadmapData.salary_range_php // Add salary from AI response
            }
        });

    } catch (error) {
        console.error("Error in AI generation or database operation:", error.response ? error.response.data : error.message);
        res.status(500).json({ message: "Failed to generate roadmap.", error: error.message });
    }
};
