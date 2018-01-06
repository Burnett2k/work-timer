
//required modules
var http = require('http');
var request = require('request');
var fs = require('fs');
var express = require('express');
var path = require('path');
var app = express();

//constants
const PORT=8080;

//misc variables
var logging = true;

app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT);

app.get('/', function (req, res) {
  res.render('index');
})

function handleResponse(error, response, body) {
  if (!error && response.statusCode == 200 && logging) {
    console.log(body);
    return true;
  }
}
