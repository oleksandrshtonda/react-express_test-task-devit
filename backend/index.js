import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();

app.use(cors());
app.use(bodyParser.json());

const REQUESTS_PER_SECOND_LIMIT = 50;
let requestsCounter = 0;

const delay = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

app.post('/api', (req, res) => {
  if (requestsCounter >= REQUESTS_PER_SECOND_LIMIT) {
    res.status(429).send('Too many requests')
  }

  requestsCounter++;
  setTimeout(() => {
    requestsCounter--;
    res.json(req.body.index);
  }, delay(1, 1000));
})

app.listen(4000, () => {
  console.log('Server is started')
})
