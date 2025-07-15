import axios from 'axios';
import Assessment from '../models/Assessment.js';
import Roadmap from '../models/Roadmap.js';

const API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${API_KEY}`;

const generateRoadmapPrompt = (jobTitle, quizScore) => {
    return `
        You are an expert career counselor for Filipino BPO professionals transitioning to tech. A user with the job title "${jobTitle}" and a logic quiz score of ${quizScore}/5 needs a personalized career path.

        Your tasks:
        1.  Analyze the job title for transferable skills.
        2.  Based on the skills and a high score (${quizScore}/5), recommend 2 suitable entry-level tech careers and provide it in 5 seconds. For each, provide a "reason" explaining why it's a good fit.
        3.  For each recommended career, generate a 5-module learning roadmap. Prioritize free, high-quality resources from platforms like freeCodeCamp,  YouTube, Coursera (free courses), and TESDA Online.
        4.  Provide a realistic entry-level monthly salary range in PHP for each career.
        5.  For the youtube resources, ensure that the links are from channels are still up-to-date and available for learning.

        Respond ONLY with a valid JSON array of objects matching this structure:
        [
          {
            "careerTitle": "string",
            "description": "string",
            "reason": "string",
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
        ]
    `;
};

export const createAssessmentAndRoadmap = async (req, res) => {
    const { jobTitle, quizScore } = req.body;
    const userId = req.user.id; 

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
        let responseText = aiResponse.data.candidates[0].content.parts[0].text;
        responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const roadmapsData = JSON.parse(responseText);

        // --- Save to Database ---
        const assessment = await Assessment.create({
            jobTitle,
            quizScore,
            userId,
        });

        const createdRoadmaps = await Promise.all(roadmapsData.map(roadmapData => {
            return Roadmap.create({
                careerTitle: roadmapData.careerTitle,
                description: roadmapData.description,
                reason: roadmapData.reason,
                modules: roadmapData.modules, 
                assessmentId: assessment.id,
                salary_range_php: roadmapData.salary_range_php
            });
        }));
        
        // --- Send response to Frontend ---
        res.status(201).json({
            assessment,
            roadmaps: createdRoadmaps.map(roadmap => roadmap.toJSON())
        });

    } catch (error) {
        console.error("Error in AI generation or database operation:", error.response ? error.response.data : error.message);
        res.status(500).json({ message: "Failed to generate roadmap.", error: error.message });
    }
};