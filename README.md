# Description
This is a REST API that supports the following:
- [Search for a movie](#search-for-a-movie)
- [Get details of a movie with its id](#get-details-of-a-movie)
- [Add a user](#add-a-user)
- [Fetch a user](#fetch-a-user)
- [Rate a movie](#rate-a-movie)

The movie parts are making use of https://developers.themoviedb.org. This requires you have an api key that allows access to their API. The setup section below will explain where to place this api key.

NOTE: It has not been tested yet, but this should be deployable to AWS via serverless. I will add a small deploy section at the bottom, but again, this part has not been tested. Do so at your own risk!

## Setup
Requirements:
- Node 10.15.0
- Java Runtime Environment - minimum version 8

Installing the node modules will also install dynamodb local

```
npm install
```

You will need to create a `src/configs/secrets.js` with two API keys: (If the configs folder does not exit, please create it)

1. An API key for access to https://developers.themoviedb.org
2. Your own generated key which is used to authenticate against the API endpoints in this project.

The is the format of the secrets.js file:
```
module.exports = {
  theMovieDbApiKey: '',
  movieChallengeApiKey: 'anexamplestring',
};
```

## Startup
The startup will initiate a serverless local environment which will also spinup a local dynamodb instance. This allows for local HTTP calls and user state management.

The default settings are `localhost:3000` for the API end points and `localhost:8000` for dynamodb.

```
npm run start
```

## Usage
There is one exposed end point for each of the supported items listed in the description above. Below are details and example curls commands to access them once the local serverless has been started.

### Search for a movie
This takes in two query parameters:
- name: A string for the movie name to search for
- page: The response will return page 1 by default, but you can specify other pages based on the initial reponse showing the total pages.

Example
```
curl --request GET \
  --url 'http://localhost:3000/v1.0/movies?name=avengers&page=1' \
  --header 'authorization: anexamplestring'
```

### Get details of a movie
Use the movie id in the path parameter to get details about it. The movie id can be retrived from the movie search response. It is found in the results array. Example object extract from the results array:
```
...
{
  "vote_count": 7583,
  "id": 299534,
  "video": false,
  "vote_average": 8.4,
  "title": "Avengers: Endgame",
  "popularity": 81.811,
  "poster_path": "/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
  "original_language": "en",
  "original_title": "Avengers: Endgame",
  "genre_ids": [
    12,
    878,
    28
  ],
  "backdrop_path": "/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
  "adult": false,
  "overview": "After the devastating events of Avengers: Infinity War, the universe is in ruins due to the efforts of the Mad Titan, Thanos. With the help of remaining allies, the Avengers must assemble once more in order to undo Thanos' actions and restore order to the universe once and for all, no matter what consequences may be in store.",
  "release_date": "2019-04-24"
},
...
```

Example
```
curl --request GET \
  --url http://localhost:3000/v1.0/movies/299534 \
  --header 'authorization: anexamplestring'
```

### Add a user
You can create a new user with a username. This has to be unique for each user. It also requires an email address as part of the user.

There is basic email formatting validation.

Example
```
curl --request POST \
  --url http://localhost:3000/v1.0/users \
  --header 'authorization: anexamplestring' \
  --header 'content-type: application/json' \
  --data '{
	"email": "example@examplemail.com",
	"username": "slaphead"
}'
```

### Fetch a user
Get a user's details with their username.

Example
```
curl --request GET \
  --url 'http://localhost:3000/v1.0/users?username=slaphead' \
  --header 'authorization: anexamplestring'
```

### Rate a movie
Allows a user to rate a movie with this API. It keeps its own internal ratings for each user. i.e. it is not using the rating API on https://developers.themoviedb.org

The path parameter takes the movie id to be rated

The body requires two fields:
- rating: number from 0 to 10 (Right now any float will be accepted)
- username

Example
```
curl --request POST \
  --url http://localhost:3000/v1.0/movies/299534 \
  --header 'authorization: anexamplestring' \
  --header 'content-type: application/json' \
  --data '{
	"rating": 8.21,
	"username": "slaphead"
}'
```

## Deploy
This section has the deploy option. Using serverless, it would deploy these API endpoints and setup the dynamodb table to your AWS environment. It has not been tested yet, so this part is not confirmed.

It assumes a stage of `dev` and a region of `us-east-1` and is not currently configurable without editing the `serverless.yml` file
```
npm run deploy
```

## Quality
The project is linted with airbnb and some custom overrides
```
npm run lint
```