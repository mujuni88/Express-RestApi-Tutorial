/* CRUD = (POST, GET, PUT, DELETE) operations for test
	* create a new object
	* retrieve object by id
	* retrieve whole collection
	* update an object by id
	* checking an updated object by id
	* remove an object by id
*/

var superagent = require('superagent'),
	expect = require('expect.js')

describe('express rest api server', function(){
	var id,
		baseUrl = "http://localhost:80",
		john = {
			name: "John",
			email: "john@test.com"
		},
		peter = {
			name: "Peter",
			email: "peter@test.com"
		}

	it('should post an object', function(done){
		superagent.post(baseUrl+'/collections/test')
			.send(john)
			.end(function(err, res){
				console.log(res.body)

				// expect no error
				expect(err).to.eql(null);

				// expect 1 value, the id
				expect(res.body.length).to.eql(1);

				//
				expect(res.body[0]._id.length).to.eql(24);
				id = res.body[0]._id;
				done();
			})

	});	

	it('should retrieve an object', function(done){
		superagent.get(baseUrl+'/collections/test/'+id)
			.end(function(err, res){
				console.log(res.body)

				// expect no error
				expect(err).to.eql(null);

				// expect the body to be an object
				expect(typeof res.body).to.eql('object')

				// expect the length of the id is 24
				expect(res.body._id.length).to.eql(24)

				// expect the id to equal the provided id
				expect(res.body._id).to.eql(id)

				// test is done
				done();
			})

	});	

	it('should retrieve a collection', function(done){
		superagent.get(baseUrl+'/collections/test')
			.end(function(err, res){
				// console.log(res.body)
				expect(err).to.eql(null)
				expect(res.body.length).to.be.above(0)
				expect(res.body.map(function (item){return item._id})).to.contain(id)        
				done()
			})

	});	

	it('should update an object', function(done){
		superagent.put(baseUrl+'/collections/test/'+id)
			.send(peter)
			.end(function(err, res){
				// console.log(res.body)

				// expect no error
				expect(err).to.eql(null);

				// expect the body to be an object
				expect(typeof res.body).to.eql('object')

				// expect a success on the object
				expect(res.body.msg).to.eql('success');

				// test is done
				done();
			})

	});

	it('should check an updated object', function(done){
		superagent.get(baseUrl+'/collections/test/'+id)
			.end(function(err, res){
				// console.log(res.body)

				// expect no error
				expect(err).to.eql(null);

				// expect the body to be an object
				expect(typeof res.body).to.eql('object')

				// expect the length of the id is 24
				expect(res.body._id.length).to.eql(24)

				// expect the id to equal the provided id
				expect(res.body._id).to.eql(id)

				// expect name to equal peter 
				expect(res.body.name).to.eql(peter.name);

				// expect email to equal peter@test.com
				expect(res.body.email).to.eql(peter.email)

				// test is done
				done();
			})

	});

	it('should remove an object', function(done){
		superagent.del(baseUrl+'/collections/test/'+id)
			.end(function(err, res){
		        // console.log(res.body)

		        // expect no error
		        expect(err).to.eql(null);

		        // expect the body to be an object
		        expect(typeof res.body).to.eql('object')

		        // expect a success from response
		        expect(res.body.msg).to.eql('success');

		        // test is done
		        done();
			})

	});
})