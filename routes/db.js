const MongoClient = require("mongodb").MongoClient;
let db = null;
console.log(process.env.MONGO_PASS);
MongoClient.connect(`mongodb+srv://eunyoung:${process.env.MONGO_URL}@cluster0.oh6qak7.mongodb.net/?retryWrites=true&w=majority`, { useUnifiedTopology: true }, (err, client) => {
  if (err) {
    console.log(err);
  }
  db = client.db("crudapp");
});

module.exports = db;
