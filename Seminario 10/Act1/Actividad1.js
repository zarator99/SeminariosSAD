// Actividad 1 del seminario 10

var cryptojs = require("crypto-js");
var crypto = require('crypto');
var express = require("express");

//Creamos la clase 
class Bloque_Blockchain {
    constructor(indice, first_hash , timestamp, valor, new_hash) {
        this.indice = indice;
		//Convertimos a string el valor hash
        this.first_hash = first_hash.toString();
        this.timestamp = timestamp;
        this.valor = valor;
        this.new_hash = new_hash.toString();
    }
}
var getTimestamp = () =>{
    return new Date().getTime();

};
var GenerarHash = (valor) => {
    return crypto.createHash('md5').update(valor).digest('hex');
};

var Bloque_Inicio = () => {
    var texto_Inicial = "Mi primer bloque";
    var hash = GenerarHash(texto_Inicial);
    var tiempo = getTimestamp();
    return new Bloque_Blockchain(0, "0", tiempo , texto_Inicial, hash);
};


var bloque = [Bloque_Inicio()];

var ultimoMensaje = () => {
    return bloque[bloque.length - 1]
};

var Generar_Siguiente_Bloque = (block) => {
    var lastBlock = ultimoMensaje();
    var indice = lastBlock.index + 1;
    var tiempo = new Date().getTime();
    var nextHash = Calcular_Siguiente_hash(indice, lastBlock.new_hash, tiempo, block);
    return new Bloque_Blockchain(indice, lastBlock.new_hash, nextTimestamp, blockData, nextHash);
};

var Calcular_Siguiente_hash = (indice, bloque, tiempo, block)=> {
    // Realizamos el calculo del siguiente bloque, con una concatenacion del hash anterior, el tiempo y el valor
    var hash = bloque + tiempo + block;
    // Realizamos el MD5 sobre ese valor
    return cryptojs.MD5(hash).toString();
};

var AddBloque = (Nuevo_bloque) => {
    bloque.push(Nuevo_bloque);
};
