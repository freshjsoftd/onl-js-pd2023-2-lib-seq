const path = require(`path`);
//===============================
const multer = require('multer');
// ==============================
const { staticPath } = require('../config/staticConfig');

const storageBookImage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.resolve(staticPath, 'images'));
	},
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
});
