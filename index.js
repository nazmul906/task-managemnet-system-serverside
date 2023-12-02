const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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

    // api to post task
    app.post("/addtask", async (req, res) => {
      //   console.log(req.body);
      const addedtask = req.body;
      const result = await taskcollection.insertOne(addedtask);
      res.send(result);
    });

    // api to get alltask
    app.get("/alltask", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await taskcollection.find().toArray();
      res.send(result);
    });

    // api to update task
    app.put("/update/:id", async (req, res) => {
      const id = req.params.id;
      // console.log("update", id);

      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatetask = req.body;
      console.log(updatetask);
      const updateDoc = {
        $set: {
          title: updatetask.title,
          description: updatetask.description,
          status: updatetask.status,
        },
      };

      try {
        const result = await taskcollection.updateOne(
          filter,
          updateDoc,
          options
        );
        // console.log(result);
        res.send(result);
      } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    // api to delete task
    app.delete("/deletetask/:id", async (req, res) => {
      const id = req.params.id;
      console.log("delete_id", id);
      const query = { _id: new ObjectId(id) };
      try {
        const result = await taskcollection.deleteOne(query);
        // console.log(result);
        res.send(result);
      } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).send("Internal Server Error");
      }
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
