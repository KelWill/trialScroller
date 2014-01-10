var request = require('request');
var http = require('http');

var url = "http://localhost:3000/";
var port = 3000;

describe('login', function(){
  it('should get redirected to login page if not logged in', function(done){
    request(url , function(error, response, body){
      console.log(response.statusCode);
      if (response.url === '/login') done();
    });
  });
  // //TODO login through http request
  // it('should not get redirected to login page if logged in', function(){
  //   var request = http.request({
  //     port: 3000,
  //     method: 'POST',
  //     path: '/login',
  //   });
  // });
});
