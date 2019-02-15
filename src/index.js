const Alexa = require('ask-sdk-core');
const Adapter = require('ask-sdk-dynamodb-persistence-adapter');

const LaunchRequestHandler = require('./intent/default/LaunchRequest');
const HelpIntentHandler = require('./intent/default/HelpIntent');
const CancelAndStopIntentHandler = require('./intent/default/CancelAndStopIntent');
const SessionEndedRequestHandler = require('./intent/default/SessionEndedRequest');
const ErrorHandler = require('./intent/default/Error');

const StampIntentHandler = require('./intent/StampIntent');

const HelloIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'HelloIntent';
  },
  async handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak('hello world')
      .getResponse();
  },
};

const config = {
  tableName: 'ToiletTrainingTable',
  createTable: true
};
const DynamoDBAdapter = new Adapter.DynamoDbPersistenceAdapter(config);

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    HelloIntentHandler,
    StampIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .withPersistenceAdapter(DynamoDBAdapter)
  .lambda();
