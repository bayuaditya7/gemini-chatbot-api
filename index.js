import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Google GenAI client
const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);
const GEMINI_MODEL = 'gemini-2.5-flash';

// API Endpoint for chat
app.post('/api/chat', async (req, res) => {
    const { conversation } = req.body;

    try {
        if (!Array.isArray(conversation)) {
            return res.status(400).json({ error: 'Conversation must be an array' });
        }

        const contents = conversation.map(({ role, text }) => ({
            role,
            parts: [{ text }]
        }));

        const result = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents,
            config: {
                temperature: 0.9,
                systemInstruction: 'Jawab menggunakan Bahasa Indonesia yang sederhana dan ramah.',
            },
        });

        const text =
            result?.response?.text?.() ||
            result?.candidates?.[0]?.content?.parts?.[0]?.text ||
            'Tidak ada respon dari model';

        res.status(200).json({ result: text });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/', (req, res) => {
    res.send('Gemini Chatbot API is running');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
