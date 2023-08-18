const express = require('express');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// HTML Routes
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});



// API Routes
app.get('/api/notes', (req, res) => {
  const notesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'db', 'db.json')));
  //const notes = JSON.parse(notesData);
  
  res.json(notesData);
  //res.setHeader('Cache-Control', 'no-cache'); // Disable caching
  //res.json(notes);
});

app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  const notesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'db', 'db.json')));
  newNote.id = uuid.v4(); // Generate a unique ID
  notesData.push(newNote);
  fs.writeFileSync(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notesData));
  res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
  const notesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'db', 'db.json')));
  const noteId = req.params.id;
  const updatedNotes = notesData.filter(note => note.id !== noteId);
  fs.writeFileSync(path.join(__dirname, 'db', 'db.json'), JSON.stringify(updatedNotes));
  res.json({ message: 'Note deleted successfully' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
}); 

// Start server
app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});
