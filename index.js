const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 4000;
const fileUpload = require("express-fileupload");
//Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload());

//Connecting to MongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jrsbo.mongodb.net/?retryWrites=true&w=majority`;
// MongoDB config
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db("equiz");
    const categories = await db.collection("categories");
    const courses = await db.collection("courses");

    //  api post _/categories

    app.post("/categories", async (req, res) => {
      console.log(req.body);
      console.log(req.files);
      const category = req.body.category;
      const details = req.body.details;
      const courses =[]
      // image upload
      const pic = req.files.image;
      const picData=pic.data;
      const encodedPic=picData.toString("base64");
      const images= Buffer.from(encodedPic, "base64");
      const data={
        category,
        details,
        courses,
        image:images
      }
      
      const result = await categories.insertOne(data);
      console.log(result);
      res.send(result);
    });
    // Courses API
    app.post("/courses", async (req, res) => {
      const { category, name } = req.body;

      const filter = { category: category };
      const updatedoc = {
        $push: {
          courses: name,
        },
      };
      const crs = {
        name: name,
        category: category,
      };
      const options = { upsert: true };
      const result = await categories.updateOne(filter, updatedoc, options);
      result2 = await courses.insertOne(crs);

      console.log(result);

      res.send({ message: true });
    });
  } finally {
    // client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(port, () => {
  console.log(`App listening  in port${port}`);
});
