const util = require('util');

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
        .speak(Message.TELLME_CONFIRM + Message.REPEAT)
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
        .speak(Message.TELLME_NOT_FOUND + Message.SEEYOU)
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
    const count = (_.filter(data, { 'result': result })).length;
    if (result) {
      return this.createSuccessMessage(count);
    } else {
      return this.createFailureMessage(count);
    }
  },
  createSuccessMessage(count) {
    let message = '';
    if (0 === count) {
      message += 'まだ成功の記録はありません。';
      message += Message.SEEYOU;
    } else {
      message += 'これまでの成功回数は<break time="0.1s"/>' + count + '回！';
      message += Message.sayYear();
      message += Message.getNextAwardWord(count);
      message += Message.sayGoodBye();
    }
    return message;
  },
  createFailureMessage(count) {
    let message = '';
    if (0 === count) {
      message += 'まだ失敗の記録はありません。';
      message += Message.SEEYOU;
    } else {
      message += 'これまでの失敗回数は<break time="0.1s"/>' + count + '回！';
      message += Message.saySad();
    }
    return message;
  },

};

module.exports = TellMeIntentHandler;