var fs = require('fs');

// var rolodexFile = fs.open('example.txt', 'w', function(err, data){
//     if(err) throw err;
//     return name
// });

var rolodexFile = {
    a: 'We know A',
    b: 'We know B',
    c: 'We know C'
};
var rolodex = {a: "We know this name"};

function retrieve(file, name, cb){
	cb(file[name]);
}

function processEntry(name) {

    return new Promise((resolve, reject) => {
        if (rolodex[name]) {
            resolve(rolodex[name])
        } else {
            retrieve(rolodexFile, name, function(res){
                rolodex[name]=res;
				resolve(res);
			});
            
        }
    });
}

function test() {
    
	testNames.forEach(function(name){
		console.log('processing', name);
		processEntry(name)
			.then(function (res){
				console.log('processed', name);
			});
	});

}

var testNames = ['a', 'b', 'c'];
test();