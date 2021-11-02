const express = require('express');
const bodyParser = require('body-parser')
const app = express();

// MONGO DB
const url = "mongodb://localhost:27017/";
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;

var urlencodedParser = bodyParser.urlencoded({ extended: false })
    
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
    
app.post('/', urlencodedParser, (req, res) => {
    console.log('DB Name:', req.body.dbName, '\nCollection Name: ', req.body.collectionName, '\nDoc Name: ', req.body.first_name, '\nDoc LastName: ', req.body.last_name, '\nDoc Email: ', req.body.email);
    res.send(req.body);
//Creacion de una BD 
        MongoClient.connect(url+req.body.dbName, function(err, db) {
            if (err) throw err;
            console.log("Base de datos creada");
            db.close();
        });

//   Creacion de una coleccion dentro de una BD
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        let getMyDB = db.db(req.body.dbName); //Selecioanr la BD que quiero 
        getMyDB.createCollection(req.body.collectionName, function(err, res) {
        if (err) throw err;
        console.log("Colección creada");
        db.close();
        });
    });

//Se declara el objeto para poder insertarlo en al coleción 
    const dbDocumentdata = { 
        "name": req.body.first_name, 
        "last name": req.body.last_name, 
        "direccion": req.body.email
    }; 
//Insertar el objeto dentro de una coleccion de una BD
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        let getMyDB  = db.db(req.body.dbName);
        getMyDB.collection(req.body.collectionName).insertOne(dbDocumentdata, function(err, res) {
        if (err) throw err;
        console.log("Documento insertado");
        db.close();
        });
    });
});    
app.listen(3000);




