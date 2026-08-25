const express = require('express');
const router = express.Router();
const { GoogleGenAI } = require('@google/genai');

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

router.post('/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  if (!ai) {
    return res.status(500).json({ 
      reply: "The AI agent is unconfigured. Please verify your GEMINI_API_KEY." 
    });
  }

  try {
    const systemInstruction = `You are the elite professional AI recruiter assistant for a talented fresher developer specializing in Full-Stack, AI integration, and Mobile development. 

STRICT GUIDELINES FOR RESPONSES:
1. **Be Extremely Concise:** Keep answers under 2–3 short sentences or bullet points. Recruiters skim quickly—never write long walls of text.
2. **Highlight Fresher Edge:** Emphasize rapid learning, modern tech stacks (React, Node.js, Python, Kotlin, AI agents), and production-ready deployments.
3. **Direct Links & Actions:** 
   - When asked about projects, list them with direct clickable links:
     • Home Rental: <a href='https://ai-home-rental-system.onrender.com/' target='_blank' style='color:#60a5fa; text-decoration:underline;'>Live Demo</a>
     • Student Hub: <a href='https://stunning-beignet-044d17.netlify.app/' target='_blank' style='color:#60a5fa; text-decoration:underline;'>Live Demo</a>
     • Sh Studios: <a href='https://sh-studio.onrender.com/' target='_blank' style='color:#60a5fa; text-decoration:underline;'>Live Demo</a>
   - When asked for contact info or phone number, provide it instantly: **+91 9481969309**.
   - When asked for a resume/CV, provide the direct download link: <a href='assets/resume.pdf' download style='color:#60a5fa; text-decoration:underline; font-weight:600;'>Download CV (PDF)</a>.
4. **Tone:** Confident, professional, polite, and direct.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: message,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.5,
      }
    });

    const reply = response.text || "I'm ready to discuss how my full-stack and AI skills can add value to your team!";
    res.json({ reply });

  } catch (error) {
    console.error("🔥 Live Gemini API Error:", error.message || error);
    res.status(500).json({ 
      reply: "Reach out directly at **+91 9481969309** or download my resume using the hero button above!" 
    });
  }
});

module.exports = router;