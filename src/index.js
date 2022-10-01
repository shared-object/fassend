const { sequelize } = require('./lib/database')
const express = require('express')
const config = require('../config.json')



const app = express()

// import routes
const routes = require('./routes')
const { generateToken } = require('./lib/utils')

// setup routes
app.use('/files', routes.files)
// 

app.use(express.static('../public'))


app.param(function(name, fn) {  
   if (fn instanceof RegExp) {
     return function(req, res, next, val) {
       var captures;
       if (captures = fn.exec(String(val))) {
         req.params[name] = captures;
         next();
       } else {
         next('route');
       }
     }
   }
 })

app.get('/', function (req, res) {
   res.send('Hello World');
})

var server = app.listen(config.server.port, () => {
   var host = server.address().address
   var port = server.address().port
   
   console.log("App listening at http://%s:%s", host, port)
})