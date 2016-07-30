var express = require('express')
var app = express()
var path = require('path')
var routes = require('./routes').router
var mongoose = require('mongoose')
var Url = require('./routes').Url
var port = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, 'public')))


app.use('/new/', routes)

/*
var Schema = mongoose.Schema

var urlSchema = new Schema({
  old:  String,
  new: String
});

var Url = mongoose.model('Url', urlSchema)
*/

app.get('/:id', function(req, res, next) {
	console.log('New id received:', req.params.id)

	//finding the url attached to that id
	mongoose.connect(process.env.MONGOLAB_URI)
	Url.findOne({new: req.params.id}, function (err, doc){
  	// doc is a Document
  	if (doc) {
  		console.log('Id match in db')
	  	res.redirect(doc.old)
  	} 
  	//If no documents found
  	else {
  		console.log('Id not found in db')
  		res.json({error: 'That id is not in the database'})
  	}
  	mongoose.connection.close()
	});
	
});

app.use(function(err, req, res, next) {
	console.error(err.stack);
	res.status(500).send('Something broke!');
});

app.listen(port, function () {
  console.log('app listening on port', port);
});
