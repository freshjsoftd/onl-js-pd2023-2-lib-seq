const path = require('path')
require('dotenv').config();

module.exports = {
	staticPath: path.resolve(process.env.STATIC_PATH)
};