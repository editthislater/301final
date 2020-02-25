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
app.post('/filtersearch', filterSearch);
app.post('/details', displayDetails);
app.get('/error', errorHandler);
app.post('/', saveCountry);


// Route Callbacks

// Render homepage, with database info
function homePage (req, res){
  let SQL = 'SELECT * FROM countries';

  client.query(SQL)
    .then(results => {
      res.render('index.ejs', {countries: results.rows});
    })
    // .catch(error => errorHandler(error));
    .catch(err => console.error(err));
}

// Query API by name
function searchCountry (req, res) {
  let country = req.body.search;
  let url = `https://restcountries.eu/rest/v2/name/${country}`;

  superagent.get(url)
    .then(results => {
      let countryArr = results.body.map(country => {
        return new Country(country);
      });
      res.render('results.ejs', {countries: countryArr});
    })
    .catch(error => errorHandler(error, req, res));
}

function filterSearch (req, res) {
  let region = req.body.region;
  let subregion = req.body.subregion.filter(subregion => {
    return subregion !== 'default';
  })[0];
  let language = req.body.language.filter(language => {
    return language !== 'default';
  })[0];

  let url = `https://restcountries.eu/rest/v2/region/${region}`;

  superagent.get(url)
    .then(results => {
      let countryArr = filterSubregion(results.body, subregion, language);
      let constructedCountries = countryArr.map(country => {
        return new Country(country);
      });
      res.render('results.ejs', {countries: constructedCountries});
    });
}

function displayDetails (req, res){
  let currency_code = req.body.currency;
  let url = `https://api.exchangerate-api.com/v4/latest/${currency_code}`;

  superagent.get(url)
    .then(results => {
      let exchange_rates = Object.entries(results.body.rates);
      res.render('countrydetails.ejs', {country: req.body, rates: exchange_rates});
    })
    .catch(err => {
      let error_type = err.response.body.error_type || 'no error type';
      if (/unsupported_code/gm.test(error_type)) {
        res.render('countrydetails.ejs', {country: req.body, rates: []});
      } else {
        errorHandler(err, req, res);
      }
    });
}

function saveCountry (req, res) {
  // console.log('res: ', res.body);
  console.log('req: ', req.body);
  let name = req.body.name;
  let language = req.body.language;
  let region = req.body.region;
  let subregion = req.body.subregion;
  let capital = req.body.capital;
  let currency = req.body.currency;
  let flag_url = req.body.flag_url;


  let SQL = `INSERT INTO countries (name, language, region, subregion, capital, currency, flag_url) VALUES ($1, $2, $3, $4, $5, $6, $7);`;
  let VALUES = [name, language, region, subregion, capital, currency, flag_url];
  console.log('SQL stuff:', SQL);
  console.log('values:', VALUES);
  client.query(SQL, VALUES);
  client.query(`SELECT * FROM countries`)
    .then(result => {
      res.render('index.ejs', {countries: result.rows});
    })
    .catch(error => errorHandler(error, req, res));
}


// Country constructor function
function Country (data) {
  this.name = data.name;
  this.language = data.languages[0].name;
  this.region = data.region;
  this.subregion = data.subregion;
  this.capital = data.capital || 'capital not available';
  this.currency = data.currencies[0].code;
  this.currency_symbol = data.currencies[0].symbol;
  this.flag_url = data.flag.replace('https', 'http');
}

// Helper functions
function errorHandler(error, request, response) {
  response.render('../views/error.ejs');
}

function filterSubregion (results, subregion, language) {
  let subregionFilterArr =  results.filter(country => {
    return country.subregion.toLowerCase() === subregion.toLowerCase();
  });
  return filterLanguage(subregionFilterArr, language);
}

function filterLanguage(arr, language) {
  return arr.filter(country => {
    let languageMatch = false;
    country.languages.forEach(lang => {
      if (lang.name.toLowerCase() === language.toLowerCase()) {
        languageMatch = true;
      }
    });
    return languageMatch;
  });
}


// Start server
client.connect()
  .then(() => app.listen(PORT))
  .then(() => console.log(`server listening on ${PORT}`))
  .catch(err => console.error(err));
