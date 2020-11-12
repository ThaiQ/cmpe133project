const dynamodb = require('aws-sdk/clients/dynamodb');
const db = new dynamodb.DocumentClient();
const {statusCode, inputFormat, reponseFormat, errFormat} = require('../util')
// Get the DynamoDB table name from environment variables
const tableName = process.env.TABLE;

/**
 * A simple example includes a HTTP post method to add one item to a DynamoDB table.
 */
exports.deleteUserHandler = async (event, context, callback) => {
    const { body, httpMethod, path } = event;
    // Get id and name from the body of the request
    const {
        StudentID
        } = typeof body === 'string' ? JSON.parse(body) : body;
    

    //Checking for errors
    if (httpMethod !== 'POST') {
        return errFormat(statusCode.MethodNotAllow,`postMethod only accepts POST method, you tried: ${httpMethod} method.`,callback)
    }

    //combine them into an object
    let req = null
    // Delete an item in db
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#delete-property
    req = inputFormat(tableName,null,{StudentID})
    return await db.delete(req).promise()
    .then(
        res => {
            return reponseFormat(statusCode.Success, {StudentID}, callback)
        }
    )
    .catch(
        err => {
            return reponseFormat(err.statusCode, err, callback)
        }
    )

};
