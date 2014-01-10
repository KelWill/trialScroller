/ var request = require('request');

// describe('login', function(){
//   it('should get redirected to login page if not logged in', function(){
//     request('/', function(error, response, body){
//       console.log(response.statusCode);
//       done();
//     }, 2000);
//     expect(true).toEqual(true);
//   });
// });

describe('jasmine-node', function(){

  it('should pass', function(){
    expect(1+2).toEqual(3);
  });

  it('shows asynchronous test', function(){
    setTimeout(function(){
      expect('second').toEqual('second');
      asyncSpecDone();
    }, 1);
    expect('first').toEqual('first');
    asyncSpecWait();
  });

  it('shows asynchronous test node-style', function(done){
    setTimeout(function(){
      expect('second').toEqual('second');
      // If you call done() with an argument, it will fail the spec 
      // so you can use it as a handler for many async node calls
      done();
    }, 1);
    expect('first').toEqual('first');
  });
});