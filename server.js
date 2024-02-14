const express = require('express');
const path    = require('path');
const app     = express();
const cors = require('cors');
const port = process.env.PORT || 3000;
// app.use(express.static(path.join(__dirname, 'build')));
console.log("recent")
app.use(express.static(path.join(__dirname, 'build')));
app.use(cors());

// Alternatively, configure CORS with specific options
app.use(cors({
  origin: 'http://localhost:3000', // replace with your app's origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization']
}));
-app.get('/', function (req, res) {
	+app.get('/*', function (req, res) {
   	res.sendFile(path.join(__dirname, 'build', 'index.html'));
 	});

});

//app.listen(9000);
app.listen(port, () => console.log("Listening on Port", port));
