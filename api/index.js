const express = require('express');
const mysql = require('mysql2/promise');
const { exec } = require('child_process');
const fs = require('fs');
const app = express();
app.use(express.json());

const db = mysql.createPool({
  host: process.env.DB_HOST || 'your-planetscale-host',
  user: process.env.DB_USER || 'your-username',
  password: process.env.DB_PASSWORD || 'your-password',
  database: process.env.DB_DATABASE || 'surveillance_db',
  ssl: { rejectUnauthorized: true }
});

app.get('/hello', (req, res) => {
  res.json({ message: 'Backend’s up—ready to roll!' });
});

app.get('/anomalies', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM anomalies ORDER BY timestamp DESC LIMIT 10');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'DB’s being shy!' });
  }
});

app.post('/process-stream', async (req, res) => {
  const { cameraId, rtspUrl } = req.body;
  if (!cameraId || !rtspUrl) return res.status(400).json({ error: 'Need cameraId and rtspUrl!' });
  const clipPath = `clips/anomaly_${Date.now()}.mp4`;
  exec(`ffmpeg -i ${rtspUrl} -t 10 -c:v copy ${clipPath}`, async (err) => {
    if (err) return res.status(500).json({ error: 'FFmpeg hiccup!' });
    const clipUrl = clipPath; // Ephemeral on Vercel
    try {
      await db.query(
        'INSERT INTO anomalies (camera_id, timestamp, confidence, description, video_clip) VALUES (?, NOW(), ?, ?, ?)',
        [cameraId, 0.95, 'Caught a weirdo!', clipUrl]
      );
      res.json({ message: 'Anomaly logged!', video_clip: clipUrl });
    } catch (dbErr) {
      res.status(500).json({ error: 'DB flopped!' });
    } finally {
      if (fs.existsSync(clipPath)) fs.unlinkSync(clipPath);
    }
  });
});

module.exports = app;