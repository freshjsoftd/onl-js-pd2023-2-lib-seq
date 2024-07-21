const http = require('http');
// ============================
require('dotenv').config();
// ============================
const db = require('./src/db/models');
const app = require('./src/app');
// ============================

// Create server with HTTP module
const HOST_NAME = process.env.DB_HOST;

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);



const dbCheck = async () => {
  try {
    await db.sequelize.authenticate();
    console.log(
      `Connection with DB ${process.env.DB_NAME.toUpperCase()} has been successfully done!`
    );
  } catch (error) {
    console.log(`Can't connect to DB: `, error.message);
  }
};

dbCheck();

const syncModels = async () => {
  try {
    await db.sequelize.sync({alter: true})
    console.log(`Sync of models has been done successfully`)
  } catch (error) {
    console.log(`Can't sync models: `, error.message);
  }
}

syncModels();

const syncModel = async (model) => {
  try {
    await model.sync({alter: true})
    console.log(`Sync of ${model.name} has been done successfully`)
  } catch (error) {
    console.log(`Can't sync ${model.name}: `, error.message);
  }
}

// syncModel(db.authors_books);

server.listen(PORT, HOST_NAME, () =>
  console.log(`Server running at http://${HOST_NAME}:${PORT}`)
);
