const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
require('dotenv').config();

const HOSTNAME = process.env.BACKEND_HOSTNAME;
const PORT = process.env.BACKEND_PORT;

const app = express();

// Enable CORS.
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer().any());

app.listen(PORT, HOSTNAME, () => {
  console.log(`Backend is running on http://${HOSTNAME}:${PORT}`);
});

app.get('/', (_, response) => {
  return response.send('<h1>Hello World</h1>');
});
  
const router = express.Router();

module.exports = { router };

const paymentRouter = require('./payment/api');

app.use('/api/payment', paymentRouter);
