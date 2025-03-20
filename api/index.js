const express = require('express');
const mysql = require('mysql2/promise');
const { exec } = require('child_process');
const fs = require('fs');
const app = express();
app.use(express.json());

// Local MySQL Connection
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Whit3haT17#', // Your root password from install
  database: 'usalamaguard_db'
});

app.get('/hello', (req, res) => {
  res.json({ message: 'Usalama Guard backend is up—ready to roll!' });
});

app.get('/anomalies', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM anomalies ORDER BY timestamp DESC LIMIT 10');
    res.json(rows);
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ error: 'DB’s being shy!' });
  }
});

app.post('/process-stream', async (req, res) => {
  const { cameraId, rtspUrl } = req.body;
  if (!cameraId || !rtspUrl) {
    return res.status(400).json({ error: 'Need cameraId and rtspUrl, yo!' });
  }
  const clipPath = `clips/anomaly_${Date.now()}.mp4`;
  exec(`ffmpeg -i ${rtspUrl} -t 10 -c:v copy ${clipPath}`, async (err) => {
    if (err) {
      console.error('FFmpeg Error:', err);
      return res.status(500).json({ error: 'FFmpeg hiccup!' });
    }
    const clipUrl = clipPath;
    try {
      await db.query(
        'INSERT INTO anomalies (camera_id, timestamp, confidence, description, video_clip) VALUES (?, NOW(), ?, ?, ?)',
        [cameraId, 0.95, 'Caught a weirdo!', clipUrl]
      );
      res.json({ message: 'Anomaly logged—boom!', video_clip: clipUrl });
    } catch (dbErr) {
      console.error('DB Error:', dbErr);
      res.status(500).json({ error: 'DB flopped!' });
    } finally {
      if (fs.existsSync(clipPath)) fs.unlinkSync(clipPath);
    }
  });
});

module.exports = app;