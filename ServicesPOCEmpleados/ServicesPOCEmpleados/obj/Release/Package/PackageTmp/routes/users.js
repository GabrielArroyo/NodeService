'use strict';
var express = require('express');
var router = express.Router();
const CosmosClient = require('@azure/cosmos').CosmosClient;
const config = require('./config');
const endpoint = config.endpoint;
const masterKey = config.primaryKey;
const client = new CosmosClient({ endpoint: endpoint, auth: { masterKey: masterKey } });
const databaseId = config.database.id;
const containerId = config.container.id;

//const mongo = require('mongodb').MongoClient;
//const url = process.env.URL_BBDD || 'mongodb://localhost:27017';


/* GET users listing. */
router.get('/', function (req, res) {
    res.send('respond with a resource');
});

router.get('/InsertEmploye', async function (req, res) {
    let user = req.body;

    if (user === undefined)
        res.status(400).json({
            ok: false,
            message: 'Introduzca los datos de usuario'
        });
    try {
        const { item } = await client.database(databaseId).container(containerId).items.upsert(user);

        res.status(201).json({
            ok: true,
            message: 'Empleado añadido correctamente'});
    } catch (err)
    {
        res.status(400).json(err);
    }
    


});

router.get('/TakeEmploye', async function (req, res) {
    try {
        let nombre = req.query.nombre;

        if (nombre === undefined) {
            resp.status(400).json({
                ok: false,
                message: 'El nombre es necesario'
            });
        }

        const querySpec = {
            query: "SELECT VALUE r FROM root r WHERE r.id = @id",
            parameters: [
                {
                    name: "@id",
                    value: "Alberto"
                }
            ]
        };

        const { result: results } = await client.database(databaseId).container(containerId).items.query(querySpec, { enableCrossPartitionQuery: true }).toArray();
        //for (var queryResult of results) {
        //     resultString = JSON.stringify(queryResult);

        //}

        res.status(200).json({
            ok: true,
            message: results
        });

    } catch (err)
    {
        console.log(err);
    }

});
//router.get('/TakeUser', async function (req, resp) {

//    let user;
//    let nombre = req.query.nombre;

//    if (nombre === undefined) {
//        resp.status(400).json({
//            ok: false,
//            message: 'El nombre es necesario'
//        });
//    }

//    mongo.connect(url, async  (err, client) => {
//        if (err) {
//            console.error(err);
//            return;
//        }
//        const db = client.db('POCEmpleados');
//        const collection = db.collection('Users');
        

//        var responseBBDD = await collection.findOne({ Nombre: nombre });        

//        client.close();      

//        resp.json(responseBBDD);

//    });
    
//});

//router.get('/InsertUser', function (req, resp)
//{
//    let user = req.body;

//    if (user === undefined)
//        resp.status(400).json({
//            ok: false,
//            message: 'Introduzca los datos de usuario'
//        });


//    mongo.connect(url,  (err, client) => {
//        if (err) {
//            console.error(err);
//            return;
//        }
//        const db = client.db('POCEmpleados');
//        const collection = db.collection('Users');


//        collection.insertOne(user, function (err, res) {
//            if (err) console.writeline(err);

//            client.close();

//            res.status(201).json({ ok: true, message:'Insertado correctamente' });

//        });              

//    });



//});



module.exports = router;
