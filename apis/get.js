'use-strict';

const AWS = require('aws-sdk');
const DynamoDB = new AWS.DynamoDB.DocumentClient();
var tableData = {};

module.exports.get = async event => {
    const dynamoParams = {
        TableName: 'speedTable'
    };
    try {
        tableData = await DynamoDB.scan(dynamoParams).promise();
    }
    catch (err) {
        console.log(err);
        return err;
    }
    console.log("Success.");
    console.log(tableData);

    const response = {
        statusCode: 200,
        body: JSON.stringify(tableData.Items)
    };
    return response;
}