var http = require('http');
var request = require('request');
var Firebase = require('firebase');
var fb_link = require('../firebaselink.js');
var utility = require('./utility/utility.js');

var crimeScraper = {

  requestApiCrimes: function(dateStr) {
    var crimeUrl = 'https://data.smgov.net/resource/kn6p-4y74.json';
    var queryStr = '?date_occurred=' + dateStr + 'T00:00:00';

    //Create a new firebase instance
    var fb = new Firebase(fb_link.url);

    request(crimeUrl+queryStr, function (error, response, body) {
      if (error) { console.log('error while fetching', error); }
      if (!error && response.statusCode === 200) {
        var results = JSON.parse(body);
        var crimeObj = {};

        for(var i=0; i<results.length; i++) {
          if(!results[i].latitude) {
            continue;
          }
          crimeObj = {
            dateOccurred: results[i].date_occurred,
            UCR: results[i].ucr,
            latitude: results[i].latitude,
            longitude: results[i].longitude
          }
          fb.child('CrimeIncident').child(results[i].incident_number).set(crimeObj);
        }

        console.log('****************logging Crime data***************');
      }
      if(!error) {
        console.log('statusCode:', response.statusCode);
      }
    });
  }
};

module.exports = crimeScraper;
