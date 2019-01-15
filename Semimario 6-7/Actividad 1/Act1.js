var fs = require('fs');
var rolodexFile = fs.open('example.txt');
var rolodex = {a: "We know this name"};

function retrieve(file, name, cb) {
    //Searches for name in file, and
    //invokes cb with record  found
    fs.readFile(file, 'utf8', function(err, data) {
        if (err) throw err;
        console.log(data);
    });
}

function processEntry(name, cb) {
    if (rolodex[name]) {
        cb(rolodex[name]);
    }
    else {
        retrieve(rolodexFile, name, function (val) {
            rolodex[name] = val;
            cb(val);
        });
    }
}

function test() {
    for (var n in testNames) {
        console.log('processing', n);
        processEntry(n, function (res) {
            console.log('processed', n);
        })
    }
}

var testNames = ['a', 'b', 'c'];
test();