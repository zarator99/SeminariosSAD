var mgdb = require('mongodb');
var assert = require('assert');

var mongoclient = mgdb.MongoClient;

var url = 'mongodb://localhost:8100/almacen';
var db;
var carrito = [];
var articulo = [];

var connectar = function (url) {
    return new Promise(function (resolve, reject) {
        if (url == null) {
            reject();
        }

        mongoclient.connect(db, function (err, client) {
            if (err) reject(err);
            assert.equal(err, null);

            console.log('connected');
            connection = client;
            db = client.db('almacen');
            resolve();
        });
    });
};

exports.desconectar = function () {
    return new Promise(function (resolve) {
        if (connection) {
            db.close();
        }
        resolve();
    });
};



var addToCart = function (db, item, qty) {


    if (carrito[item['desc']]) {
        console.log('El articulo ya esta en el carrito');
    }
    else{
        return new Promise(function (resolve, reject) {
            var add = false;
            var collection = db.collection('products');
            if (collection = null) reject();
            var product = collection.find({desc: item['desc']});
            if (product['stock'] >= qty){
                resolve(product);
            }
            else{
                reject('No hay stock sufiente');
            }
        });
    }


};

var quitItemCart = function (db, item) {
    console.log('Carrito: ' + carrito);
    if (carrito.length){
        delete carrito[item['desc']];
    }


};
var insertProducts = function () {
    return new Promise(function (resolve, reject) {
        if (!db) reject('Cannot conect to the DB');

        // Get the documents collection
        var collection = db.collection('products');
        // Insert some documents
        collection.insertMany([
            { cod: 1, desc: 'palos', stock: 0 }, { cod: 2, desc: 'hierros', stock: 10 }, { cod: 3, desc: 'muelles', stock: 5 }
        ], function (err, result) {
            assert.equal(err, null);
            assert.equal(3, result.result.n);
            assert.equal(3, result.ops.length);
            console.log("Inserted 3 products into the collection");
            resolve(result);
        });
    });
};

var obtenerStock = function (db, item, callback) {
    var collection = db.collection('products');

    collection.find({desc: item['desc']}).toArray(function (err, result) {
        if (err) {
            console.log(err)
        }
        callback(result);
    });
};

var obtenerUno = function (db, item) {

    return new Promise(function (resolve, reject) {
        if (!db) reject('DB is NOT connected');

        var collection = db.collection('products');
        collection.find({ cod: item['cod'] }).toArray(function (err, product) {
            if (err) throw err;
            if (product.length) {
                resolve(product);
            } else {
                resolve(null);
            }
        });
    });
};

