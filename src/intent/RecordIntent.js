const _ = require('lodash');
const DAO = require('../helper/db-access');
const result_util = require('../helper/result-util');

const Message = require('../message');

const RecordIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'RecordIntent';
  },
  async handle(handlerInput) {
    const { slots } = handlerInput.requestEnvelope.request.intent;
    if (!result_util.isValidResult(slots.result.value)) {
      let intentObj = handlerInput.requestEnvelope.request.intent;
      intentObj.confirmationStatus = "IN_PROGRESS";
      return handlerInput.responseBuilder
        .speak(Message.RECORD_CONFIRM + Message.REPEAT)
        .reprompt(Message.REPEAT)
        .addElicitSlotDirective('result', intentObj)
        .getResponse();
    }

    const result = result_util.cleansing(slots.result.value);
    const dynamo = new DAO(handlerInput);
    if ('成功' === result) {
      await dynamo.pushData({ 'result': true, 'time': (new Date()).toISOString() });
      return handlerInput.responseBuilder
        .speak(Message.RECORD_GOOD)
        .withShouldEndSession(true)
        .getResponse();
    }

    await dynamo.pushData({ 'result': false, 'time': (new Date()).toISOString() });
    return handlerInput.responseBuilder
      .speak(Message.RECORD_BAD)
      .withShouldEndSession(true)
      .getResponse();
  }
};

module.exports = RecordIntentHandler;