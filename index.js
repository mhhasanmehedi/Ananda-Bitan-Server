const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();



const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 5000

app.get('/', (req, res) => {
  res.send('Welcome to Ananda Bitan server')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rxelq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const bookCollection = client.db(`${process.env.DB_NAME}`).collection("books");
  const checkoutCollection = client.db(`${process.env.DB_NAME}`).collection("checkouts");

  app.post('/addBook', (req, res) => {
    const newBook = req.body;
    bookCollection.insertOne(newBook)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  app.post('/checkout', (req, res) => {
    const newOrder = req.body;
    checkoutCollection.insertOne(newOrder)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  app.get('/books', (req, res) => {
    bookCollection.find()
      .toArray((err, documents) => {
        res.send(documents);
      })
  })

  app.get('/orders', (req, res) => {
    checkoutCollection.find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

  app.get('/book/:id', (req, res) => {
    bookCollection.find({ _id: ObjectId(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents[0]);
      })
  })


  app.delete('/delete/:id', (req, res) => {
    console.log(req.params.id);
    bookCollection.deleteOne({ _id: ObjectId(req.params.id) })
      .then(result => {
        res.send(result.deletedCount > 0)
      })
  })

  app.delete('/cancelOrder/:id', (req, res) => {
    console.log(req.params.id);
    checkoutCollection.deleteOne({ _id: ObjectId(req.params.id) })
      .then(result => {
        res.send(result.deletedCount > 0)
      })
  })

});


app.listen(port);

