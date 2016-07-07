// import express from 'express'
// import bodyParser from 'body-parser'
// var bodyParser = require('body-parser')

// var app = express()
//
// app.use(bodyParser.urlencoded({ extended: false }));
//
// app.post('/send', function(req, res) {
//   console.log(req.body);
//   // const {user} = req.body
//   // res.json(user)
// })
//
// app.listen(8000, function() {
//   console.log('server listen on http://localhost:8000');
// })

function add({a, b}) {
  console.log(arguments);
  return a+b
}
var pc = {'a':1, 'b':2, 'c':3}
console.log(add(pc));
// add(pc)
