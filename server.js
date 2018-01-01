
//required modules
var http = require('http');
var request = require('request');
var fs = require('fs');
var express = require('express');
var app = express();

//constants
const PORT=8080;

//misc variables
var logging = true;

app.listen(PORT);

app.get('/', function (req, res) {
  res.send('GET request to the homepage')
})

function handleResponse(error, response, body) {
  if (!error && response.statusCode == 200 && logging) {
    console.log(body);
    return true;
  }
}
