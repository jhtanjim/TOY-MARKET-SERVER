const express = require('express');
const cors = require('cors');
require('dotenv').config()

const app = express()

const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.khwex9e.mongodb.net/?retryWrites=true&w=majority`;



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();


        const toyCollection = client.db('toyDB').collection('toy')
        const categoryCollection = client.db('toyDB').collection('toyCategory')



        // receive data from client by newToy
        // create

        // Read
        app.get('/toyCategory', async (req, res) => {
            const cursor = categoryCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/alltoy', async (req, res) => {

            const cursor = toyCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })




        // specific user data
        app.get('/alltoy/:id', async (req, res) => {
            const id = req.params.id
            console.log(id);
            //return
            const query = { _id: new ObjectId(id) }
            const result = await toyCollection.findOne(query)
            console.log(result);
            res.send(result)
        })


        app.get('/alltoydata/:email', async (req, res) => {
            // console.log(req.params.email);

            const query = { email: req.params.email }

            const cursor = toyCollection.find(query);
            const result = await cursor.toArray();
            console.log(result);
            res.send(result);
        });

        // update
        app.put('/alltoy/:id', async (req, res) => {

            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updatedToy = req.body
            const coffee = {
                $set: {
                    name: updatedToy.name, quantity: updatedToy.quantity, category: updatedToy.category, details: updatedToy.details, photo: updatedToy.photo
                }
            }
            const result = await toyCollection.updateOne(filter, coffee, options)
            res.send(result)
        })






        app.get('/toyCategory/:id', async (req, res) => {
            // console.log(req.params.id);
            const id = req.params.id

            const query = { _id: new ObjectId(id) };


            const cursor = await categoryCollection.findOne(query);
            console.log(cursor);
            res.send(cursor);
        });





        app.post('/addtoy', async (req, res) => {

            const newToy = req.body
            console.log(newToy);
            const result = await toyCollection.insertOne(newToy)
            res.send(result)
        })
        app.get('/alltoy/:id', async (req, res) => {
            const id = req.params.id
            console.log('please delete this from db', id);
            const query = { _id: new ObjectId(id) }
            const result = await toyCollection.findOne(query)
            res.send(result)
        })



        app.delete('/alltoy/:id', async (req, res) => {
            const id = req.params.id
            console.log('please delete this from db', id);
            const query = { _id: new ObjectId(id) }
            const result = await toyCollection.deleteOne(query)
            res.send(result)
        })









        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);
















app.get('/', (req, res) => {
    res.send('Toy store server running')
})


app.listen(port, () => {
    console.log(`Toy store server running on port:${port}`);
})