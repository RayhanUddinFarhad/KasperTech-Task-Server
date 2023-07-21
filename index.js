const express = require('express');
const csv = require('csv-parser');

const app = express();
const PORT = 3000;
const cors = require('cors');
require('dotenv').config();

app.use(cors())

// Replace 'your-mongodb-connection-string' with your actual MongoDB connection string

// Middleware to parse JSON in request body
app.use(express.json());


app.get('/', (req, res) => {


    res.send("Hello KesperTech")
})

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.9qpxu0o.mongodb.net/?retryWrites=true&w=majority`;

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

        const database = client.db("KasperTechDatabase");
        const csvFile = database.collection("csvData1")





        app.post('/upload', (req, res) => {
            if (!req.body || !Array.isArray(req.body)) {
                return res.status(400).send('Invalid data');
            }



            csvFile.insertMany(req.body, (insertErr, result) => {
                if (insertErr) {
                    console.error('Error inserting data into MongoDB:', insertErr);
                    return res.status(500).send('Internal Server Error');
                }

                return res.status(200).send('Upload successful');
            });

        });

        app.get('/csvData/:email', async (req, res) => {
            const email = req.params.email;


            const result = await csvFile.find({ email: email }).toArray()

            res.send(result)
        })

        app.get('/csvDataOne/:id', async (req, res) => {


            const id = req.params.id;

            const query = {

                OrderID: id,
            }

            const result = await csvFile.find(query).toArray()

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


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
