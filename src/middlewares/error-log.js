import mongodb from 'mongodb'

const MongoClient = mongodb.MongoClient
const url = 'mongodb://localhost:27017'
const dbName = 'edu';

export default (errLog, req, res, next) => {
  MongoClient.connect(url, (err, client) => {
    const db = client.db(dbName);
    db.collection('error_logs').insertOne({
        name: errLog.name,
        message: errLog.message,
        stack: errLog.stack,
        time: new Date()
      }, (err, result) => {
        res.json({
          err_code: 500,
          message: errLog.message
        })
      })
      client.close()
  })
}

