import MongoClient from 'mongodb';

const MONGO_URL = 'mongodb://localhost:27017';

export default function (app) {
  MongoClient.connect(
    MONGO_URL,
    { useNewUrlParser: true },
  )
    .then((connection) => {
      app.db = connection.db('kaffeScoreboard');
      app.users = app.db.collection('users');
      console.log('Database connection established');
    })
    .catch(err => console.error(err));
}
