const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
require("dotenv").config();
// middleware
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Task Management");
});

console.log(process.env.db_user);
const uri = `mongodb+srv://${process.env.db_user}:${process.env.db_pass}@cluster0.w5hdwnt.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const taskcollection = client.db("taskmangement").collection("alltask");

    // api to post toy
    app.post("/addtask", async (req, res) => {
      //   console.log(req.body);
      const addedtask = req.body;
      const result = await taskcollection.insertOne(addedtask);
      res.send(result);
    });

    // api to get alltoy
    app.get("/alltask", async (req, res) => {
      const result = await taskcollection.find().toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`port is running on ${port}`);
});
