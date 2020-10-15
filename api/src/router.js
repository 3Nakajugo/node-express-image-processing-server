const { Router } = require('express');
const multer = require('multer');
const path = require('path');
const imageProcessor = require('./imageProcessor');

const storage = multer.diskStorage({
    destination: 'api/uploads/',
    filename: filename
});

const router = Router();

function filename(request, file, callback) {
    callback(null, file.originalname);
}

function fileFilter(request, file, callback) {
    if (file.mimetype !== 'image/png') {
        request.fileValidationError = "Wrong file type";
        callback(null, false, new Error("Wrong file type"));

    } else {
        callback(null, true);
    }
};

const upload = multer({
    fileFilter,
    storage: storage
});

router.post('/upload', upload.single('photo'), async (req, res) => {
    if (req.fileValidationError)
        return res.status(400).json({ error: req.fileValidationError });
    try {
        await imageProcessor(req.file.filename);
    } catch {

    }

    return res.status(201).json({ success: true });

}

);

const photoPath = path.resolve(__dirname, '../../client/photo-viewer.html');

router.get('/photo-viewer', (req, res) => {
    res.sendFile(photoPath)
});
module.exports = router;
