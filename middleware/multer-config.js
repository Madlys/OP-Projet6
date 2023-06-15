/* File management middleware with multer package */

const multer = require('multer');

//mymetype library
const MIME_TYPE = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        //original file name, filling my spaces with underscores
        const name = file.originalname.split(" ").join("_");
        //+extension with mymetype
        const extension = MIME_TYPE[file.mimetype];
        //=file name construction: name + timestamp + extension
        callback(null, name + Date.now() + "." + extension)
    }
})

module.exports = multer({ storage }).single('image');