const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;  
// const { query } = require('express');
// const res = require('express/lib/response');
// const res = require('express/lib/response');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ow5x2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect()
        const databse = client.db('cars')
        const carsCollection = databse.collection('carslist')
        const usersCollection = databse.collection('user')
        const updateCollection = databse.collection('update')
        const revewCollection = databse.collection('revew')
        const productCollection = databse.collection('products')
 


        app.get('/products', async (req, res) => {
            // console.log(req.query);
            const cursor = productCollection.find({})
            const page = req.query.page
            const size = parseInt(req.query.size)
            let products
            const count = await cursor.count()

            if (page) {
                products = await cursor.skip(page * size).limit(size).toArray()
            } else {
                products = await cursor.toArray()

            }
            res.send({
                count,
                products
            })
        })

        app.post('/products/:byKeys', async (req, res) => {
            // console.log(req.body);
            const keys = req.body
            const query = { key: { $in: keys } }
            const products = await productCollection.find(query).toArray()
            res.send(products)
        })




        //all cars
        app.get('/carslist', async (req, res) => {
            const id = carsCollection.find({}) 
            const result = await id.toArray()
            res.send(result)

        })
        app.get('/update', async (req, res) => {
            const email = req.query.email
            // const resu = req.params.id
            const unique = { email: email } 
            const ide = updateCollection.find(unique)
            const result = await ide.toArray()
            // console.log(result);
            res.send(result)

        })
        app.delete('/update/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await updateCollection.deleteOne(query)
            // console.log(result);
            res.json(result)
        })



        // app.get('/update/:id', async (req, res) => {
        //     const id = req.params.id
        //     const query = { _id: ObjectId(id) }
        //     const user = await updateCollection.findOne(query)
        //     // console.log(user);
        //     res.send(user)
        // })
        // app.put('/update/:id', async (req, res) => {
        //     const id = req.params.id
        //     const updateUser = req.body
        //     const filter = { _id: ObjectId(id) }
        //     const options = { upsert: true }
        //     const updateDoc = {
        //         $set: {
        //             name:updateUser.name,
        //             email:updateUser.email,
        //             address:updateUser.address,
        //             country:updateUser.country,
        //             zip:updateUser.zip,
        //             number:updateUser.number,
        //             Relegon:updateUser.Relegon,
        //         }
        //     }
        //     const result = await updateCollection.updateOne(filter, updateDoc, options)
        //     console.log(result);
        //     res.send(result)
        // })



        //add Car
        app.post('/carslist', async (req, res) => {
            const service = req.body;
            // console.log('hit the post api', service);
            const result = await carsCollection.insertOne(service);
            // console.log(result);
            res.send(result)
        });
        app.get('/revew', async (req, res) => {
            const id = revewCollection.find({})

            const result = await id.toArray()
            res.send(result)

        })
        app.post('/revew', async (req, res) => {
            const service = req.body;
            // console.log('hit the post api', service);

            const result = await revewCollection.insertOne(service);
            // console.log(result);
            res.send(result)

        })

        app.post('/update', async (req, res) => {
            const service = req.body;
            // console.log('hit the post api', service);
            const result = await updateCollection.insertOne(service);
            // console.log(result);
            res.send(result)
        });






        //singale car
        app.get('/user', async (req, res) => {
            const email = req.query.email
            const unique = { email: email }
            const id = usersCollection.find(unique)
            const result = await id.toArray()
            res.send(result)

        })
        //delete 
        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id
            // console.log(id);
            const query = { _id: ObjectId(id) }
            // console.log(query);
            const result = await usersCollection.deleteOne(query)
            // console.log(result);
            res.json(result)
        })




        //details car
        app.get('/details/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const car = await carsCollection.findOne(query)
            res.send(car)
        })
        //order seee
        app.post('/user', async (req, res) => {
            const service = req.body;
            // console.log('hit the post api', service);
            const result = await usersCollection.insertOne(service);
            // console.log(result);
            res.send(result)
        });





        console.log('h');


    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Running my CRUD Server');
});

app.listen(port, () => {
    console.log('Running Server on port', port);
})