const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'pdfs');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Keep original filename
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'));
        }
    }
});

// Library data file
const libraryFile = path.join(__dirname, 'pdf_library_data.json');

// Initialize library file if it doesn't exist
if (!fs.existsSync(libraryFile)) {
    fs.writeFileSync(libraryFile, JSON.stringify([], null, 2));
}

// Get library data
app.get('/api/library', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(libraryFile, 'utf8'));
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read library data' });
    }
});

// Upload PDF
app.post('/api/upload', upload.single('pdf'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Read current library
        const library = JSON.parse(fs.readFileSync(libraryFile, 'utf8'));

        // Check for duplicates
        if (library.some(pdf => pdf.filename === req.file.originalname)) {
            // Delete the uploaded file since it's a duplicate
            fs.unlinkSync(req.file.path);
            return res.status(409).json({ error: 'Duplicate file already exists' });
        }

        // Create new entry
        const newEntry = {
            title: req.body.title || req.file.originalname.replace(/\.pdf$/i, ''),
            category: req.body.category || 'Other',
            summary: req.body.summary || `Auto-summary: ${req.body.title || req.file.originalname}`,
            filename: req.file.originalname,
            date: new Date().toISOString().slice(0, 10)
        };

        // Add to library
        library.push(newEntry);
        fs.writeFileSync(libraryFile, JSON.stringify(library, null, 2));

        res.json({ success: true, entry: newEntry });
    } catch (error) {
        res.status(500).json({ error: 'Upload failed: ' + error.message });
    }
});

// Delete PDF
app.delete('/api/library/:filename', (req, res) => {
    try {
        const library = JSON.parse(fs.readFileSync(libraryFile, 'utf8'));
        const index = library.findIndex(pdf => pdf.filename === req.params.filename);

        if (index === -1) {
            return res.status(404).json({ error: 'File not found' });
        }

        // Remove from library
        library.splice(index, 1);
        fs.writeFileSync(libraryFile, JSON.stringify(library, null, 2));

        // Delete physical file
        const filePath = path.join(__dirname, 'pdfs', req.params.filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Delete failed: ' + error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
