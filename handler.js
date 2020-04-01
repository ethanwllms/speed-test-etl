const uuid = require('uuid');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.collect = async event => {
    var bucket = '';
    var key = '';
    if ('Records' in event) {
        var s3Data = event.Records[0].s3;
        console.log(s3Data);
        bucket = s3Data.bucket.name;
        key = decodeURIComponent(s3Data.object.key.replace(/\+/g, " "));
    }
    const timestamp = new Date().getTime();
    var s3params = {
        Bucket: bucket,
        Key: key
    };
    const data = await s3.getObject(s3params).promise();
    // CWL with JSON object
    const jsonData = JSON.parse(data.Body.toString('utf8'));

    const dynamoparams = {
        TableName: "speedTable",
        Item: {
            id: uuid.v1(),
            latency: jsonData.latency,
            download: jsonData.download,
            upload: jsonData.upload,
            createdAt: timestamp
        },
    };
    console.log(dynamoparams);
    await dynamoDb.put(dynamoparams).promise()
    await s3.deleteObject(s3params).promise();
};
