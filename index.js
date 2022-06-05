const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
const port = 4000;
//Middleware
app.use(cors());
app.use(express.json());

//Database
const uri = "mongodb+srv://kavinRahi:tnSwShAd0OUzYF0S@cluster0.jrsbo.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run (){
  try{
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db("equiz");
   const categories = await db.collection("categories");
    const courses = await db.collection("courses");

  //  api post _/categories

    app.post('/categories',async(req,res)=>{
      const category = req.body;
      const result = await categories.insertOne(category);
      console.log(result);
      res.send(result);
    })
    // Courses API
    app.post('/courses', async(req,res)=>{
      const {category,name} = req.body;
      
      const filter= {category:category};
      const updatedoc={
        $push:{
          courses:name
        }
      }
      const options = { upsert: true };
      const result = await categories.updateOne(filter,updatedoc,options);
        // const result = cd.courses.push(name);
        // res.send(result);
        // const result2= await categories.updateOne({cd},{$set:{courses:result}});
      //   res.send({message:true})
      console.log(result);
    
      
      res.send({message:true});
    })
  }
  finally{
    // client.close();
  }
}
run().catch(console.dir);
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   console.log("Connected to MongoDB");
//   client.close();
// });
app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(port, () => {
  console.log(`App listening  in port${port}`);
});

// tnSwShAd0OUzYF0S
// kavinRahi
