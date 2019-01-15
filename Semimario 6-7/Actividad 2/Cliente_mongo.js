var mgdb = require('mongodb');
var assert = require('assert');

var mongoclient = mgdb.MongoClient;

var url = 'mongodb://localhost:8100/almacen';

var carrito = [];
var articulo = [];

mongoclient.connect(url, function (err, db) {
    assert.equal(err, null);
    console.log('conectado');

    /*db.createCollection("documents", function(err, res) {
        if (err) throw err;
        console.log("Collection created!");
      });*/

    // insertDocuments(db,function() {
    // 	if (err) throw err;
    // 	console.log('success with insertion!');
    // 	db.close();
    // });



    var item = {desc: 'palos'};
    addToCart(db, item, 2 ,function (result, err) {
        if (err) {
            console.log(err)
        }
        else if(result){
            console.log('Se ha añadido al carrito.');
            console.log(carrito);
        }
        else{
            console.log('No hay stock suficiente.')
        }

    });

    quitItemCart(db, item, function (result, err) {
        if (err) {
            console.log(err);
        }
        else if(result){
            console.log('Se ha eliminado al carrito.');
            console.log(carrito);
        }
    });

});


var addToCart = function (db, item, qty, callback) {
    var add = false;
    var collection = db.collection('products');

    if (carrito[item['desc']]) {
        console.log('El articulo ya esta en el carrito');
    }
    obtenerStock(db, item, function (result, err) {
        if (err) {
            console.log(err);
        }

        if (result) {
            var stock = result[0]['stock'];
            if (stock >= qty) {
                articulo = {'desc': item['desc'], 'cantidad': qty};
                carrito.push(articulo);
                add = true;
                result[0]['stock'] = result[0]['stock'] - qty;
                collection.save(result[0], function (err, result) {
                    if(err) throw err;
                });
            }
            callback(add);
        }
    });

};

var quitItemCart = function (db, item, callback) {
    console.log('Carrito: ' + carrito);
    if (carrito.length){
        delete carrito[item['desc']];

    }


};
var insertOneProduct = function (db, doc, callback) {

    var collection = db.collection('products');

    collection.save(doc, function (err, result) {
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        console.log("Inserted 1 product into the collection");
        callback(result);
    });
};

var obtenerStock = function (db, item, callback) {
    var collection = db.collection('products');

    collection.find(item).toArray(function (err, result) {
        if (err) {
            console.log(err)
        }
        callback(result);
    });
};

var obtenerTodos = function (db, callback) {
    var collection = db.collection('products');

    collection.find({}).toArray(function (err, result) {
        if (err) {
            console.log('Error: ' + err)
        }
        callback(result);
    });
};

var obtenerUno = function (db, item, callback) {
    var collection = db.collection('products');

    collection.find({item}).toArray(function (err, result) {
        if (err) {
            console.log('Error: ' + err)
        }
        callback(result);
    });
};

var insertDocuments = function (db, callback) {
    // Get the documents collection
    var collection = db.collection('products');
    // Insert some documents
    collection.insertMany([
        {_id: 1, desc: 'palos', stock: 0}, {_id: 2, desc: 'hierros', stock: 10}, {_id: 3, desc: 'muelles', stock: 5}
    ], function (err, result) {
        assert.equal(err, null);
        assert.equal(3, result.result.n);
        assert.equal(3, result.ops.length);
        console.log("Inserted 3 products into the collection");
        callback(result);
    });
};