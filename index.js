'use strict';

const express = require('express');
const bodyParser = require('body-parser');
var path = require('path');
var apiai = require('apiai');
var Myrequest = require('request');
const restService = express();
var firebase = require('firebase');

var api = apiai('738d5a27e94d4469ad1a11233c8265a9');

restService.use(bodyParser.urlencoded({
    extended: true
}));

 var config = {
   apiKey: "AIzaSyCGDWRSMrL6XS6AIYYGuj39JtzQiG9peUE",
   authDomain: "allo-baby-sample.firebaseapp.com",
   databaseURL: "https://allo-baby-sample.firebaseio.com",
   projectId: "allo-baby-sample",
   storageBucket: "allo-baby-sample.appspot.com",
   messagingSenderId: "120488316114"
 };
  firebase.initializeApp(config);

restService.use(bodyParser.json());

restService.post('/ai', function(request, response){
	console.log("Post method");
  if (request.body.result.action === 'weather') {
    var city = request.body.result.parameters['geo-city'];
    var appid = 'de86b67ea402829c5b1333fc3d7caee6';
    var msg = '';
    console.log(city);
    var restUrl = 'http://api.openweathermap.org/data/2.5/weather?APPID='+appid+'&q='+city;

    Myrequest.get(restUrl, function(err, resarg, body){
    	console.log("Got the response from openweathermap");
      if (!err && resarg.statusCode == 200) {
        var json = JSON.parse(body);
        console.log("Temperature "+json.main.temp);
       msg = json.weather[0].description + ' and the temperature is ' + (json.main.temp - 273.15)+ ' C';
        return response.json({
          speech: msg,
          displayText: msg,
          source: 'echo-google'});
      } else {
        return response.status(400).json({
          status: {
            code: 400,
            errorType: 'I failed to look up the city name.'}});
      }})
  } else if(request.body.result.action === 'momweekinfo') {
  		console.log("sharing weekinfo");
		var msg = '';
		 var ref = firebase.database().ref("/weeklyinfo");
		
		ref.once('value')
		 .then(function (snap) {
		 var datas = snap.val();
		 //res.send(datas);
		 for(var i=0; i<datas.length; i++){
		 	console.log("inside for");
		 	if(datas[i].currentweek == 1){
		 		console.log("inside if",datas[i]);
		 		msg = datas[i].yourbody;
				 return response.json({
                  speech: msg,
                  displayText: msg,
                  source: 'echo-google'});
		 	}
		 }
		});

 }  else if(request.body.result.action === 'babyaction') {
                console.log("sharing weekinfo");
                var msg = '';
                 var ref = firebase.database().ref("/weeklyinfo");
                ref.once('value')
                 .then(function (snap) {
                 var datas = snap.val();
                 //res.send(datas);
                 for(var i=0; i<datas.length; i++){
                        console.log("inside for");
                        if(datas[i].currentweek == 1){
                                console.log("inside if",datas[i]);
                                msg = "Hey mom! Here is what I found . Your baby should be growing and your baby's length is " + datas[i].length + "baby size is in the size of " + datas[i].babysize + "and weight is " + datas[i].weight ;
		 return response.json({
                  speech: msg,
                  displayText: msg,
                  source: 'echo-google'});                       
 }
                 }
                });
  }  else if(request.body.result.action === 'babydev') {
                console.log("sharing weekinfo");
                var msg = '';
                 var ref = firebase.database().ref("/weeklyinfo");
                ref.once('value')
                 .then(function (snap) {
                 var datas = snap.val();
                 //res.send(datas);
                 for(var i=0; i<datas.length; i++){
                        console.log("inside for");
                        if(datas[i].currentweek == 1){
                                console.log("inside if",datas[i]);
                                msg = datas[i].babydevelopment;
			  return response.json({
                  speech: msg,
                  displayText: msg,
                  source: 'echo-google'});
				
                        }
                 }
                });
} else if(request.body.result.action === 'babydev') {
                console.log("sharing weekinfo");
                var msg = '';
                 var ref = firebase.database().ref("/symptoms");
                ref.once('value')
                 .then(function (snap) {
                 var datas = snap.val();
                 //res.send(datas);
                 for(var i=0; i<datas.length; i++){
                        console.log("inside for");
                        if(datas[i].currentweek == 1){
                                console.log("inside if",datas[i]);
                                msg = "Here are the common symptoms durring"+ datas[i].week + " " + datas[i].sydata +".We recommend you to consult your doctor if you have any other issues" ;
                          return response.json({
                  speech: msg,
                  displayText: msg,
                  source: 'echo-google'});

                        }
                 }
                });
});

restService.post('/echo', function(req, res) {
    var speech = req.body.result && req.body.result.parameters && req.body.result.parameters.echoText ? req.body.result.parameters.echoText : "Seems like some problem. Speak again."
    return res.json({
        speech: speech,
        displayText: speech,
        source: 'echo-google'
    });
});


restService.listen((process.env.PORT || 8080), function() {
    console.log("Server up and listening");
});
