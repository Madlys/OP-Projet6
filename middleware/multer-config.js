/* Middleware de gestion de fichiers grâce au package multer */

const multer = require('multer');

//bibliothèque de mymetype
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
        //nom original du fichier en remplçant mes espaces par des underscores
        const name = file.originalname.split(" ").join("_");
        //+extension grâce au mymetype
        const extension = MIME_TYPE[file.mimetype];
        //=construction du nom du fichier: nom + timestamp (génération d'un horodatage) + extension
        callback(null, name + Date.now() + "." + extension)
    }
})

module.exports = multer({ storage }).single('image');