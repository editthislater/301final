'use strict';

require('dotenv').config();

const express = require('express');
const pg = require('pg');
const app = express();
const cors = require('cors');
const superagent = require('superagent');
const PORT = process.env.PORT;
const client = new pg.Client(process.env.DATABASE_URL);

client.on('error', err => console.error(err));

app.use(cors());
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));

// Routes

app.get('/', homePage);
app.post('/searchspecific', searchCountry);
app.post('/details', displayDetails);


// Route Callbacks

// Render homepage, with database info
function homePage (req, res){
  let SQL = 'SELECT * FROM countries';

  client.query(SQL)
    .then(results => {
      res.render('index.ejs', {countries: results.rows});
    })
    .catch(err => console.error(err));
}

// Query API by name
function searchCountry (req, res) {
  let country = req.body.search;
  console.log('country search:', country);
  let url = `https://restcountries.eu/rest/v2/name/${country}`;

  superagent.get(url)
    .then(results => {
      console.log('restcountry results:', results.body);
      let countryArr = results.body.map(country => {
        return new Country(country);
      });
      res.render('results.ejs', {countries: countryArr});
    })
    .catch(err => console.error(err));
}

function displayDetails (req, res){
  res.render('countrydetails.ejs', {country: req.body});
}

// Country constructor function
function Country (data) {
  this.name = data.name;
  this.region = data.region;
  this.subregion = data.subregion;
  this.capital = data.capital || 'capital not available';
  this.currency = data.currencies[0].code;
  this.currency_symbol = data.currencies[0].symbol;
  this.flag_url = data.flag.replace('https', 'http');
}



// Start server
client.connect()
  .then(() => app.listen(PORT))
  .then(() => console.log(`server listening on ${PORT}`))
  .catch(err => console.error(err));
