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
    let message = 'これまでの';
    const count = (_.filter(data, { 'result': result })).length;

    if (result) {
      message += '成功回数は<break time="0.1s"/>' + count + '回！';
      const LIST = [
        '<say-as interpret-as="interjection">イェイ</say-as>',
        '<say-as interpret-as="interjection">わおぅ</say-as>',
        '<say-as interpret-as="interjection">やった</say-as>',
        '<say-as interpret-as="interjection">わ〜い</say-as>'
      ];
      return message + LIST[Math.floor(Math.random() * (LIST.length))];
    } else {
      message += '失敗回数は<break time="0.1s"/>' + count + '回！';
      const LIST = [
        '<say-as interpret-as="interjection">およよ</say-as>',
        '<say-as interpret-as="interjection">しくしく</say-as>',
        '<say-as interpret-as="interjection">とほほ</say-as>', 
      ];
      return message + LIST[Math.floor(Math.random() * (LIST.length))];
    }
  }
};

module.exports = TellMeIntentHandler;