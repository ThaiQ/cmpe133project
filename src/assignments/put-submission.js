const crypto = require('crypto');

const dynamodb = require('aws-sdk/clients/dynamodb');
const db = new dynamodb.DocumentClient();
const {statusCode, inputFormat, reponseFormat, errFormat} = require('../util')
// Get the DynamoDB table name from environment variables
const tableName = process.env.TABLE;

/**
 * A simple example includes a HTTP post method to add one item to a DynamoDB table.
 */
exports.putSubmissionHandler = async (event, context, callback) => {
    const { body, httpMethod, path } = event;
    let response = null;
    // Get id and name from the body of the request
    const {
            FilePath,
            Answers,
            Grade,
            AssignmentID,
            StudentID,
            SubmissionID
        } = typeof body === 'string' ? JSON.parse(body) : body;

    //Checking for errors
    if (httpMethod !== 'POST') {
        return errFormat(statusCode.MethodNotAllow,`postMethod only accepts POST method, you tried: ${httpMethod} method.`,callback)
    }
    else if (!AssignmentID) {
        return errFormat(statusCode.BadRequest,`Missing AssignmentID.`,callback)
    }
    else if (!StudentID) {
        return errFormat(statusCode.BadRequest,`Missing StudentID.`,callback)
    }
    else if (!FilePath && !Answers) {
        return errFormat(statusCode.BadRequest, `Missing Submission.`, callback)
    }

    if (!response){
        //combine them into an object
        const submission = 
        {
            FilePath,
            Answers,
            Grade,
            AssignmentID,
            StudentID,
            SubmissionID : SubmissionID ? SubmissionID : crypto.createHash('sha1').update(AssignmentID + StudentID).digest('hex')
        }
        let req = null
        req = inputFormat(tableName, null, {AssignmentID})
        // Get 1 item from the table
        // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#get-property
        req = await db.get(req).promise()
        var state = 0
        var index = 0
        for (var i = 0; i < req.Submissions.length; i++) {
            if (req.Submissions[i].StudentID === submission.StudentID) {
                req.Submissions[i] = submission
                state = 1
                index = i
            }
        }
        if (state == 0) {
            index = req.Questions.length
            req.Submissions.push(submission)
        }
        // Creates a new item, or replaces an old item with a new item
        // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#put-property
        return await db.put(inputFormat(tableName,req)).promise().then(
            res => {
                return reponseFormat(statusCode.Success, req.Submissions[index], callback)
            }
        )
        .catch(
            err => {
                return reponseFormat(err.statusCode, err, callback)
            }
        )
    }
};
