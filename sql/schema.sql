DROP TABLE IF EXISTS countries;

CREATE TABLE countries(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  language VARCHAR(255) NOT NULL,
  region VARCHAR(255) NOT NULL,
  subregion VARCHAR(255) NOT NULL,
  capital VARCHAR(255) NOT NULL,
  currency VARCHAR(255) NOT NULL,
  flag_url VARCHAR(255) NOT NULL,
  alpha2Code VARCHAR(2) NOT NULL
);