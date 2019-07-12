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

const addUser = async (params) => {
  // TODO Validate input params
  tableParams.Item = {
    username: params.username,
    email: params.email,
  };
  tableParams.ConditionExpression = 'username <> :username';
  tableParams.ExpressionAttributeValues = {
    ':username': params.username,
  };
  return dynamoDb.put(tableParams).promise();
};

const getUser = async (username) => {
  // tableParams.KeyConditionExpression = 'username = :username';
  // tableParams.ExpressionAttributeValues = {
  //   ':username': username,
  // };
  tableParams.Key = {
    username,
  };
  return dynamoDb.get(tableParams).promise();
};

module.exports = {
  addUser,
  getUser,
};
