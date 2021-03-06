const dynamodb = require('aws-sdk/clients/dynamodb');
const db = new dynamodb.DocumentClient();
const {statusCode, inputFormat, reponseFormat, errFormat} = require('../util')
// Get the DynamoDB table name from environment variables
const tableName = process.env.TABLE;
const crypto = require('crypto');

/**
 * A simple example includes a HTTP post method to add one item to a DynamoDB table.
 */
exports.putDiscussionHandler = async (event, context, callback) => {
    const { body, httpMethod, path } = event;
    let response = null;

    // Get id and name from the body of the request
    const {
        CourseID,
        BoardID,
        Title,
        Body,
        Status,
        Date
        } = typeof body === 'string' ? JSON.parse(body) : body;

    //Checking for errors
    if (httpMethod !== 'POST') {
        return errFormat(statusCode.MethodNotAllow,`postMethod only accepts POST method, you tried: ${httpMethod} method.`,callback)
    }
    else if (!CourseID) {
        return errFormat(statusCode.BadRequest,`Missing CourseID.`,callback)
    }

    if (!response){
        //combine them into an object
        const req = {
            CourseID,
            Title,
            Body,
            Date,
            Open: Status ? Status : false,
            BoardID: BoardID ? BoardID : crypto.createHash('sha1').update(CourseID+Title+Date).digest('hex')
        }
        
        // Creates a new item, or replaces an old item with a new item
        // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#put-property
        return await db.put(inputFormat(tableName,req)).promise().then(
            res => {
                return reponseFormat(statusCode.Success, req, callback)
            }
        )
        .catch(
            err => {
                return reponseFormat(err.statusCode, err, callback)
            }
        )
    }
};
