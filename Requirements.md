## Vision

### What is the vision of this product?
Intended for users who want to move outside of the country they currently live in, our app allows the user to search for a new country to move to by region or national language, as well as to search by country (if they have a target in mind and want to view details). 

### What pain point does this project solve?
When deciding on a huge life decision such as moving to another country, it is immensely helpful to have all of the data stored in one place. 


## Scope (In/Out)

### IN
* The web app will allow the user to search for specific countries or populate a list of countries which meet filter requirements input by the user
* The web app will provide information to the users about different countries
* The web app will provide the user with the ability to save countries to a list

### OUT
* The web app will not recommend a country based on survey data
* The web app will not save data such as flight information or currency exchange rate to the database

### Stretch Goals
* Ability to save countries as a pin on a map
* Return a list of tourism information / cultural sites

## Functional Requirements:

* A user can retrieve data from an API
* A user can save data to a database
* A user can delete data from a database


## Non-functional Requirements:

* Our app will validate user input into the search field provided to make sure it is within the bounds that we expect. We will do this using RegEx. It will give them an error if something invalid is entered.

* Our app will abide by stylistic guidelines to provide the best experience for impaired users. This includes avoiding certain color themes, and utilizing alt text and proper ordering of tags in HTML to make screen readers effective. For styling, we will use google dev tools to check for color contrasts.

### Data Flow
1. Upon rendering the home page, the user has the ability to search for locations by world region, or by language spoken. 
2. The user also has the option to search for a specific country's data 
3. If filtering results by world region or language spoken: The user is taken to a list of countries that match the search results.  
  * The user has the ability to select a specific country from the list returned, and is then taken to a detail view for the country they select
3. If searching for a specific country, upon form submission the user is taken to a detail view for that country
4.  From the detail view, the user can save the country to a list of countries for later comparison