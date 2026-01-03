const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());

// Serve static files from project root
app.use(express.static(path.join(__dirname, '..')));

const contactsFile = path.join(__dirname, 'contacts.json');
if(!fs.existsSync(contactsFile)) fs.writeFileSync(contactsFile, '[]', 'utf8');

app.post('/api/contact', (req, res) => {
  const { name, phone, email, message } = req.body || {};
  if(!message || (!phone && !email)) return res.status(400).json({ error: 'Missing contact info or message' });
  const entry = { id: Date.now(), name: name||'Anonymous', phone, email, message, time: new Date().toISOString() };
  try{
    const arr = JSON.parse(fs.readFileSync(contactsFile, 'utf8') || '[]');
    arr.push(entry);
    fs.writeFileSync(contactsFile, JSON.stringify(arr, null, 2), 'utf8');
    console.log('Contact saved:', entry);
    return res.json({ ok: true });
  }catch(err){console.error(err);return res.status(500).json({ error: 'Internal server error' })}
});

app.get('/api/contacts', (req, res) => {
  try{const arr = JSON.parse(fs.readFileSync(contactsFile, 'utf8')||'[]');res.json(arr)}catch(err){res.status(500).json({error:'failed'})}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log(`PRL Logistics server running: http://localhost:${PORT}`));
