var express = require("express");
const http = require('http');
var app = express();

const bodyParser = require("body-parser")
var cors = require('cors')
app.use(cors())

// New app using express module
app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({
  limit: '500mb',
  extended: false
}));
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});
// app.use(express.static(path.join(__dirname, "js")));
app.use(express.static(__dirname));



var router = express.Router();


var router = express.Router();
router.use(function(req, res, next) {
  // do logging
  next(); // make sure we go to the next routes and don't stop here
});
var productapi=require('./controllers/product');
var productSearchapi=require('./controllers/product-search');
var category=require('./controllers/category');
var tenant=require('./controllers/tenant');

app.use('/api/v1/productapi', productapi);
app.use('/api/v1/productSearch', productSearchapi);
app.use('/api/v1/tenant', tenant);
app.use('/api/v1/category', category);

app.get('/', (req, res) => {
  res.send('Server Running ...');
});


const port = process.env.PORT || 3000;
app.set('port', port);

const server = http.createServer(app);
// Local hosting
 server.listen(port, () => console.log(`API running on localhost:${port}`));
//  Cyclic Hosting
// app.listen(process.env.PORT || 5000 ,()=> {console.log("App Listening on http://localhost:5000")})

 