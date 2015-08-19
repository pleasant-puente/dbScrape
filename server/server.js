var express = require('express');
var middleware = require('./config/middleware.js');
var http = require('http');
var request = require('request');
var Firebase = require('firebase');
var fb_link = require('../firebaselink.js');
var crimeScraper = require('./crimeScraper.js');

app = express();
middleware(app, express);

app.set('port', process.env.PORT || 8000);

app.use(express.static(__dirname + './../client'));

var latestUrl = 'https://parking.api.smgov.net/meters/events/latest';
var ordinalUrl = 'https://parking.api.smgov.net/meters/events/since/';

var ordinalNumber = 0;
var done = false;
var numCalls = 0;

var fb = new Firebase(fb_link.url);


//fetch the latest ordinal number
var getOrdinalNumber = function() {
  request(latestUrl, function (error, response, body) {
    if (error) { console.log('error while fetching', error); }
    if (!error && response.statusCode === 200) {
      var results = JSON.parse(body);
      //console.log('Fetched Ordinal Number:');
      //console.log(results);
      ordinalNumber = results.ordinal;
      requestApiEvents();
    }
    else {
      getOrdinalNumber();
    }
  });
};

  //request event information from the sm api
var requestApiEvents = function() {
  request(ordinalUrl+ordinalNumber, function (error, response, body) {
    if (error) { console.log('error while fetching', error); }
    if (!error && response.statusCode === 200) {
      var results = JSON.parse(body);

      for(var i=0; i<results.length; i++) {
        fb.child('MeteredParkingSpots').child(results[i].meter_id).child('mostRecentEvent').set(results[i].event_type);
        fb.child('MeteredParkingSpots').child(results[i].meter_id).child('timeStamp').set(results[i].event_time);
      }  

      ordinalNumber = results[0].ordinal;

      //log calls
      console.log('Number of Calls:',++numCalls);
      console.log('Number of park events: ',results.length);
      console.log('Ordinal Number:', ordinalNumber);
      console.log('****************logging data***************');
    }
    if(!error) {
      console.log('statusCode:', response.statusCode);
    }
    setTimeout(requestApiEvents, 10000);
  });
};  //requestApiEvents ends here

// //to only call requestApiEvents once after it is running
if (!done) {
  getOrdinalNumber();
  done = true;
}

crimeScraper.requestApiCrimes();
// console.log("Yo, after requestAPI)");

module.exports = app;
