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
app.get('/aboutus', aboutus);
app.post('/delete', deleteCountry);

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
function aboutus (req, res){
  res.render('aboutus.ejs');
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
    })
    .catch(error => errorHandler(error, req, res));
}

async function displayDetails (req, res){
  try {
    let currency_code = req.body.currency;
    let alpha2Code = req.body.alpha2Code;
    let country = req.body.name;
    if (country === 'United Kingdom of Great Britain and Northern Ireland') {
      country = 'United Kingdom';
    }
  
    let countryForURL = country.split(' ').join('%20');
    let visaURL = `https://visadb.io/search/Visas/Live-Abroad/United-States/${countryForURL}/en`
  
    let exchange_rates = await getExchangeRates(currency_code);
    let travel_advisory = await getTravelAdvisory(alpha2Code);
  
    if (exchange_rates === 'unsupported_code') {
      res.render('countrydetails.ejs', {country: req.body, rates: [], advisory: travel_advisory, visaURL: visaURL});
    } else {
      res.render('countrydetails.ejs', {country: req.body, rates: exchange_rates, advisory: travel_advisory, visaURL: visaURL});
    }
  }
  catch(err) {
    console.error(err);
  }
}

function getExchangeRates(currency_code) {
  let url = `https://api.exchangerate-api.com/v4/latest/${currency_code}`;

  return superagent.get(url)
    .then(results => {
      let exchange_rates = Object.entries(results.body.rates);
      return exchange_rates;
    })
    .catch(err => {
      let error_type = err.response.body.error_type || 'no error type';
      return error_type;
    });
}

async function getTravelAdvisory(alpha2Code) {
  try {
    let url = `https://www.travel-advisory.info/api?countrycode=${alpha2Code}`;
  
    let results =  await superagent.get(url);
  
    return {score: results.body.data[alpha2Code].advisory.score, message: results.body.data[alpha2Code].advisory.message};
  }
  catch {
    return 'not found';
  }
}

function saveCountry (req, res) {
  console.log('req: ', req.body);
  let name = req.body.name;
  let language = req.body.language;
  let region = req.body.region;
  let subregion = req.body.subregion;
  let capital = req.body.capital;
  let currency = req.body.currency;
  let flag_url = req.body.flag_url;
  let alpha2Code = req.body.alpha2Code;

  let SQL1 = `SELECT name FROM countries WHERE name=$1`;
  let values = [name];
  client.query(SQL1, values)
    .then(result => {
      if (result.rowCount === 0) {
        let SQL = `INSERT INTO countries (name, language, region, subregion, capital, currency, flag_url, alpha2Code) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`;
        let VALUES = [name, language, region, subregion, capital, currency, flag_url, alpha2Code];
        client.query(SQL, VALUES);
      }
      homePage(req, res);
    })
    .catch(error => errorHandler(error, req, res));
}

function deleteCountry (req, res) {
  let name = req.body.name;
  let SQL = `DELETE FROM countries WHERE name=$1`;
  let values = [name];
  client.query(SQL, values)
    .then(() => {
      res.redirect('/');
    })
    .catch(err => errorHandler(err, req, res));
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
  this.alpha2Code = data.alpha2Code;
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
