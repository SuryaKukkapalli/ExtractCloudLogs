const pino = require('pino');

class LoggerUtil {
  initializeLogger = (context) => {
    const { functionName = 'DefaultLambdaFunction', awsRequestId, logStreamName } = context;
    this.logger = pino({
      name: functionName,
      timestamp: pino.stdTimeFunctions.isoTime,
      level: process.env.LOG_LEVEL ? process.env.LOG_LEVEL.toLowerCase() : 'info',
    });

    this.childLogger = this.getChildLogger(
      functionName,
      {
        awsRequestId,
        trace: logStreamName,
        originator: functionName,
      },
      true
    );
    return this.childLogger;
  };

  getChildLogger = (operation, options = {}, isMainLogger = false) => {
    if (isMainLogger) {
      return new ChildLogger(operation, options, this.logger);
    }
    return new ChildLogger(operation, options, this.childLogger.logger);
  };
}

class ChildLogger {
  constructor(operation, options = {}, parentLogger) {
    this.logger = parentLogger.child({ operation, ...options });
  }

  error = (msg, data = {}) => {
    this.logger.error({
      data,
      msg,
    });
  };

  info = (msg, data = {}) => {
    this.logger.info({
      data,
      msg,
    });
  };

  debug = (msg, data = {}) => {
    this.logger.debug({
      data,
      msg,
    });
  };
}

module.exports = new LoggerUtil();
