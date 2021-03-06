// Import dynamodb from aws-sdk
const dynamodb = require('aws-sdk/clients/dynamodb');
// Import all functions from put-item.js
const lambda = require('../../../src/assignments/put-assignment');

const { statusCode, reponseFormat } = require('../../../src/util')

// This includes all tests for putItemHandler
describe('Test putAssignmentHandler', () => {
    let putSpy;

    // One-time setup and teardown, see more in https://jestjs.io/docs/en/setup-teardown
    beforeAll(() => {
        // Mock DynamoDB put method
        // https://jestjs.io/docs/en/jest-object.html#jestspyonobject-methodname
        putSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'put');
    });

    // Clean up mocks
    afterAll(() => {
        putSpy.mockRestore();
    });

    //Mock data
    const {objSuccess, objUpdate, objfail} = require('../../../MockData/assignment')

    // This test invokes putAssignmentHandler and compares the result
    it('should add item', async () => {
        // Return the specified value whenever the spied put function is called
        putSpy.mockReturnValue({
            promise: () => Promise.resolve(reponseFormat(statusCode.statusCode, objSuccess)),
        });

        const event = {
            httpMethod: 'POST',
            body: JSON.stringify(objSuccess),
        };

        // Invoke putItemHandler()
        const result = await lambda.putAssignmentHandler(event,"",()=>{});
        const expectedResult = {
            statusCode: 200,
            body: event.body,
        };

        // Compare the result with the expected result
        expect(result).toEqual(expectedResult);
    });

    it('should edit item', async () => {
        // Return the specified value whenever the spied put function is called
        putSpy.mockReturnValue({
            promise: () => Promise.resolve(reponseFormat(statusCode.statusCode, objUpdate)),
        });

        const event = {
            httpMethod: 'POST',
            body: JSON.stringify(objUpdate),
        };

        // Invoke putItemHandler()
        const result = await lambda.putAssignmentHandler(event,"",()=>{});
        const expectedResult = {
            statusCode: 200,
            body: event.body,
        };

        // Compare the result with the expected result
        expect(result).toEqual(expectedResult);
    });

    it('should fail with a 405', async () => {
        const event = {
            httpMethod: 'GET',
            body: objSuccess,
        };

        // Invoke putItemHandler()
        const result = await lambda.putAssignmentHandler(event,"",()=>{});
        const expectedResult = {
            statusCode: statusCode.MethodNotAllow
        };

        // Compare the result with the expected result
        expect(result.statusCode).toEqual(expectedResult.statusCode);
    });

    it('should fail with a 400', async () => {
        const event = {
            httpMethod: 'POST',
            body: objfail,
        };

        // Invoke putItemHandler()
        const result = await lambda.putAssignmentHandler(event,"",()=>{});
        const expectedResult = {
            statusCode: statusCode.BadRequest
        };

        // Compare the result with the expected result
        expect(result.statusCode).toEqual(expectedResult.statusCode);
    });
});
