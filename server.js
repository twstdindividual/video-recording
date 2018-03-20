const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const mongoose = require('mongoose');
const db = mongoose.connection;
const app = express();

const port = process.env.PORT || 3000;

app.use(express.static(`${__dirname}/dist`));
app.use(bodyParser.json());

// Setting up mongoose
const mongoURL = 'mongodb://localhost/records';
mongoose.connect(mongoURL);

const Schema = mongoose.Schema;

const recordSchema = new Schema({
  id: Number,
  title: String,
  sources: [{ src: String }]
});

const Record = mongoose.model('Record', recordSchema);

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Routs
app.route('/api')
  .get((req, res) => {
    Record.find({}, (err, records) => {
    if (err) throw err;
      res.send(records);
    });
  })
  .post((req, res) => {
    new Record(req.body)
      .save((err) => {
        if (err) throw err;
      });
  })
  .delete((req, res) => {
    const id = req.url.substr(req.url.length - 23); // 23 - number of characters in record id
    Record.find({ _id: id }).remove().exec();
  });

app.all('/*', (req, res) => {
    res.sendFile('index.html', { root: `${__dirname}/dist` });
});

app.use(router);

app.listen(port);
console.log('server is running on port ', port);
