const _ = require('lodash');
const AWS = require('aws-sdk');

const { IS_OFFLINE, USERS_TABLE } = process.env;

const tableParams = {
  TableName: USERS_TABLE || 'movie-users',
};

let dynamoDb;

if (IS_OFFLINE === 'true') {
  dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000',
  });
} else {
  dynamoDb = new AWS.DynamoDB.DocumentClient();
}

const createUser = async (params) => {
  // TODO Validate input params
  const putParams = _.merge(tableParams, {
    Item: {
      username: params.username,
      email: params.email,
    },
    ConditionExpression: 'username <> :username',
    ExpressionAttributeValues: {
      ':username': params.username,
    },
  });
  return dynamoDb.put(putParams).promise();
};

const getUser = async (username) => {
  tableParams.Key = {
    username,
  };
  const response = await dynamoDb.get(tableParams).promise();
  return response.Item;
};

const updateMovies = async (params) => {
  const { username, movies } = params;

  const updateParams = _.merge(tableParams, {
    Key: {
      username,
    },
    UpdateExpression: 'set #movies = :moviesValue',
    ExpressionAttributeNames: {
      '#movies': 'movies',
    },
    ExpressionAttributeValues: {
      ':moviesValue': movies,
    },
    ReturnValues: 'ALL_NEW',
  });

  const updateResponse = await dynamoDb.update(updateParams).promise();
  return updateResponse.Attributes;
};

module.exports = {
  createUser,
  getUser,
  updateMovies,
};
