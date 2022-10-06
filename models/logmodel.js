const AWS = require("aws-sdk");
const logger = require('../util/loggerUtil');
const dynamo = new AWS.DynamoDB.DocumentClient();
/**
 *Function to call the dynamodB and to insert data into dynamoDB
 *
 * @param {*} data
 * @return {*} json
 */
const logModel = async (data) => { 
const log = logger.getChildLogger('logmodel::logModel')
  try { 
        const insertData= await dynamo
          .put({
            TableName: "logTable",
            Item: {
            timestamp: data.logEvents[0].timestamp,      //taking primary key as timestamp
            message:data
            }
          })
          .promise();
      
     return insertData;
    } catch (err) {
        log.error('logModel-CatchError',{err})
         throw err;
  }  
};

module.exports={
    logModel 
}
