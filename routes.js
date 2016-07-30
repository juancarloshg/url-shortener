var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')

var Schema = mongoose.Schema

var urlSchema = new Schema({
  old:  String,
  new: String
});

var Url = mongoose.model('Url', urlSchema)


router.use(function(req, res) {
	var obj = {}
	obj.old = req.url.slice(-(req.url.length-1))
	console.log('New Url received', obj.old)
	//check if url is valid
	var validUrl = /^http(s)?:\/\/(www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(obj.old);
	console.log("Is it valid?", validUrl)
	if (!validUrl) {
		res.json({error: 'Invalid Url'})
		next(err)
	}
	//save url in database

	mongoose.connect(process.env.MONGOLAB_URI)

	Url.count({}, function(err, count){

		// Counting the number of docs so that it can be used for the new url
   		obj.new = count
   		var currentUrl = new Url(obj)

   		//Saving the object with the old and new url
		currentUrl.save(function (err) {
			if (err) return console.error(err)
			// saved!
			console.log('data saved!')
			mongoose.connection.close()
		})
		//Returning a json object to the browser
		obj.new = 'https://aqueous-anchorage-96750.herokuapp.com/'+obj.new
		res.json(obj)

	});
	

});

module.exports = {router: router, Url: Url};
