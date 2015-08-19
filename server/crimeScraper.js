var http = require('http');
var request = require('request');

var crimeScraper = {

  requestApiCrimes: function() {
    var crimeUrl = 'https://data.smgov.net/resource/kn6p-4y74.json';
    //build the date query string
    var currentDateUrl = '?date_occurred=';
    var currentDate = new Date();
    var parsedDate = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();
    currentDateUrl+= parsedDate + 'T00:00:00';

    request(crimeUrl+currentDateUrl, function (error, response, body) {
      if (error) { console.log('error while fetching', error); }
      if (!error && response.statusCode === 200) {
        var results = JSON.parse(body);

        for(var i=0; i<results.length; i++) {
          fb.child('CrimeIncident').child(results[i].incident_number).child('dateOccurred').set(results[i].date_occurred);
          fb.child('CrimeIncident').child(results[i].incident_number).child('UCR').set(results[i].ucr);
          fb.child('CrimeIncident').child(results[i].incident_number).child('latitude').set(results[i].latitude);
          fb.child('CrimeIncident').child(results[i].incident_number).child('longitude').set(results[i].longitude);
        }

        console.log('****************logging Crime data***************');
      }
      if(!error) {
        console.log('statusCode:', response.statusCode);
      }
      //run once a day
      setTimeout(module.exports.requestApiCrimes, 86400000);
    });
  }
}

module.exports = crimeScraper;
