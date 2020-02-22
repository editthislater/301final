DROP TABLE IF EXISTS countries;
-- DROP TABLE IF EXISTS region;
-- DROP TABLE IF EXISTS subregion;
-- DROP TABLE IF EXISTS currency;
-- DROP TABLE IF EXISTS language;


-- CREATE TABLE region(
--   id SERIAL PRIMARY KEY,
--   region_name VARCHAR(255) NOT NULL
-- );

-- CREATE TABLE subregion(
--   id SERIAL PRIMARY KEY,
--   subregion_name VARCHAR(255) NOT NULL
-- );

-- CREATE TABLE currency(
--   id SERIAL PRIMARY KEY,
--   currency_code VARCHAR(255) NOT NULL
-- );

-- CREATE TABLE language(
--   id SERIAL PRIMARY KEY,
--   language_name VARCHAR(255) NOT NULL
-- );

CREATE TABLE countries(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  language VARCHAR(255) NOT NULL,
  region VARCHAR(255) NOT NULL,
  subregion VARCHAR(255) NOT NULL,
  capital VARCHAR(255) NOT NULL,
  currency VARCHAR(255) NOT NULL
);