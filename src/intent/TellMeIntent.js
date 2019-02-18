const _ = require('lodash');
const DAO = require('../helper/db-access');
const result_util = require('../helper/result-util');

const Message = require('../message');

const TellMeIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'TellMeIntent';
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
    const data = await dynamo.getData();

    if ((_.filter(data)).length === 0) {
      // まだデータ0件の場合
      return handlerInput.responseBuilder
        .speak(Message.TELLME_NOT_FOUND)
        .withShouldEndSession(true)
        .getResponse();
    }

    if ('成功' === result) {
      return handlerInput.responseBuilder
        .speak(this.createMessage(data, true))
        .withShouldEndSession(true)
        .getResponse();
    }

    return handlerInput.responseBuilder
      .speak(this.createMessage(data, false))
      .withShouldEndSession(true)
      .getResponse();
  },
  createMessage(data, result) {
    const prefix = '記録では' + (_.filter(data, { 'result': result })).length + '回';
    if (result) {
      return prefix + '成功しているよ';
    } else {
      return prefix + '失敗してるね';
    }
  }
};

module.exports = TellMeIntentHandler;