var express = require('express'),
	mongoskin = require('mongoskin')

// create app
var app = express()
app.use(express.bodyParser())


// connect to database
var db = mongoskin.db('localhost:27017/test', {safe:true})

// do something everytime there is this value in the url pattern of the request handler
app.param('collectionName', function(req, res, next, collectionName){
	req.collection = db.collection(collectionName)
	return next()
})

app.get('/', function(req, res){
	res.send('please select a collection, e.g., /collections/messages');
})

// retrieve a list of items sorted by _id and with a limit of 10
app.get('/collections/:collectionName', function(req, res){
	req.collection.find({}, {
		limit:10,
		sort:[
			['_id', -1]
		]
	}).toArray(function(err, results){
		if (err) return next(err)

		res.send(results)
	})
})

// insert collections
app.post('/collections/:collectionName', function(req, res){
	req.collection.insert(req.body, {}, function(err, results){
		if (err) return next(err)
		res.send(results)
	})
})

// single object retrieval 
app.get('/collections/:collectionName/:id', function(req, res){
	req.collection.findOne({_id:req.collection.id(req.params.id)}, function(err, result){
		if (err) return next(err)
		res.send(result)
	})
})

// update returns the number of affected objects
app.put('/collections/:collectionName/:id', function(req, res){
	req.collection.update({_id: req.collection.id(req.params.id)}, {$set:req.body}, {safe:true, multi:false}, function(err, result){
		if(err) return next(err)

		res.send((result == 1)?{msg:"success"}:{msg:"error"})
	})
})

// delete a record
app.del('/collections/:collectionName/:id', function(req, res){
	req.collection.remove({_id:req.collection.id(req.params.id)}, function(err, result){
		if(err) return next(err)

		res.send((result === 1)?{msg:'success'}:{msg:'error'})
	})
})

app.listen(3000)

