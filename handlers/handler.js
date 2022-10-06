const logger = require('../util/loggerUtil');
const { createSuccessResponse, sendError } = require('../util/responseUtil');
const { getCloudWatchLogsController } = require('../controllers/getController');
const zlib = require('zlib');
const { logModel } = require('../models/logmodel');

/**
 *handler function to post some logs to cloud watch
 *
 * @param {*} event
 * @param {*} context
 * @return {*} string
 */
const sendLogs = async (event, context) => {
  const log = logger.initializeLogger(context);
  try {
    const cloudWatchLogs = await getCloudWatchLogsController(event);
    log.info('getLogs-Response', cloudWatchLogs);
    return createSuccessResponse('logs invoked and send to dynamodb successfully', cloudWatchLogs);
  } catch (ex) {
    log.error(ex.message, {
      stack: ex.stack,
    });
    return sendError(ex, log);
  }
};
/**
 *handler which is invoked when a subscription pattern matches in the cloudwatch logs
 *
 * @param {*} input
 * @param {*} context
 * @return {*} json
 */
const getLogs1 = async (input, context) => {
  const log = logger.initializeLogger(context);
  try {
    var payload = Buffer.from(input.awslogs.data, 'base64');//decodes the encoded data
    log.info('payload', payload);
    //uncompress the compressed data
    const uncompressed = await new Promise((resolve) => {
      zlib.gunzip(payload, (_, buffer) => {
        const json = JSON.parse(buffer.toString());
        resolve(json);
      });
    });
    log.info('result', uncompressed);
    const putDataInLogs = await logModel(uncompressed);
    log.info('getlogresult',putDataInLogs);
    return createSuccessResponse('send data to dynamodb successfully',putDataInLogs);
  } catch (ex) {
    log.error(ex.message, {
      stack: ex.stack,
    });
    return sendError(ex, log);
  }

};
module.exports = {
  sendLogs,
  getLogs1
}