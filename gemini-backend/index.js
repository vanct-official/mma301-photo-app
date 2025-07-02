const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const GEMINI_API_KEY = 'AIzaSyAFkyNIn1rMYKElb8KRo-ppvJ-xSncoIHA'; // <-- Thay bằng API key của bạn

app.post('/gemini', async (req, res) => {
  const { image } = req.body;
  if (!image) return res.status(400).json({ error: 'No image provided' });

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              { text: 'Describe this image in detail.' },
              { inlineData: { mimeType: 'image/jpeg', data: image } }
            ]
          }
        ]
      }
    );
    const description = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No description';
    res.json({ description });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Gemini API error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Gemini backend running on port ${PORT}`));