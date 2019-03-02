const Alexa = require('ask-sdk-core');
const util = require('util');

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
      const data = await dynamo.getData();
      const count = (_.filter(data, { 'result': true })).length;

      if (Message.isAward(count)) {
        const myImage = new Alexa.ImageHelper()
          .addImageInstance('https://s3-ap-northeast-1.amazonaws.com/alexa-toilet-training/award/' + count + '.png')
          .getImage();

        handlerInput.responseBuilder.addRenderTemplateDirective({
          type: 'BodyTemplate1',
          token: 'string',
          backButton: 'HIDDEN',
          backgroundImage: myImage,
          title: 'ご褒美シールを獲得！'
        });
      }

      const speechOutput = this.createAwardWord(count);
      return handlerInput.responseBuilder
        .speak(speechOutput)
        .withSimpleCard('おめでとう！')
        .withShouldEndSession(true)
        .getResponse();
    }

    await dynamo.pushData({ 'result': false, 'time': (new Date()).toISOString() });
    return handlerInput.responseBuilder
      .speak(Message.RECORD_BAD)
      .withSimpleCard('次頑張って！')
      .withShouldEndSession(true)
      .getResponse();
  },
  createAwardWord(count) {
    const award = Message.getAward(count);
    if ('' === award) {
      return Message.RECORD_GOOD;
    }

    let speechText = Message.CONGURATURATION;
    speechText += '<break time="0.5s"/>';
    speechText += Message.MEMORY;
    speechText += Message.GET_AWARD;
    speechText += '<audio src="https://s3-ap-northeast-1.amazonaws.com/alexa-toilet-training/mp3/trumpet1.mp3" />';
    speechText += Message.CONFIRM_AWARD;
    speechText += Message.sayGoodBye();

    return util.format(speechText, count, award);
  }
};

module.exports = RecordIntentHandler;
