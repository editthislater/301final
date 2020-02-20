'use strict';
require('dotenv').config();
const express = require('express');
const pg = require('pg');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT;
app.use(cors());
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.error(err));
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));
app.get('/', homePage);

function homePage (req, res){
  res.render('index.ejs');
}








client.connect()
  .then(() => app.listen(PORT))
  .then(() => console.log(`server listening on ${PORT}`))
  .catch(err => console.error(err));
