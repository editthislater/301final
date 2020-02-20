DROP TABLE IF EXISTS countries;

CREATE TABLE countries(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  language FOREIGN KEY,
  region FOREIGN KEY,
  subregion FOREIGN KEY,
  capital VARCHAR(255),
  currency FOREIGN KEY
);
