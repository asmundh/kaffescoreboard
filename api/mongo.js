import MongoClient from 'mongodb';

const MONGO_URL = 'mongodb://localhost:27017';
const MONGO_URL_NTNU = 'mongodb://127.0.0.1:27017';


export default function (app) {
  MongoClient.connect(
    MONGO_URL_NTNU,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  )
    .then((connection) => {
      app.db = connection.db('kaffeScoreboard');
      app.users = app.db.collection('users');
      console.log('Database connection established');
    })
    .catch(err => console.error(err));
}
