const util = require('util');

const _ = require('lodash');
const DAO = require('../helper/db-access');

const Message = require('../message');

const ShowMeIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'ShowMeIntent';
  },
  async handle(handlerInput) {

    const dynamo = new DAO(handlerInput);
    const data = await dynamo.getData();

    if ((_.filter(data)).length === 0) {
      // まだデータ0件の場合
      return handlerInput.responseBuilder
        .speak(Message.TELLME_NOT_FOUND + Message.SEEYOU + Message.sayGoodBye())
        .withShouldEndSession(true)
        .getResponse();
    }

    const count = (_.filter(data, { 'result': true })).length;
    const award_list = Message.getAwardList(count);
    if (award_list.length === 0) {
      let speechText = 'まだご褒美シールがありません。';
      speechText += Message.getNextAwardWord(count);

      return handlerInput.responseBuilder
        .speak(speechText + Message.SEEYOU + Message.sayGoodBye())
        .withShouldEndSession(true)
        .getResponse();
    }

    let speechText = util.format('これまでに獲得したご褒美シールは%sです。', award_list);
    let apl_data = require('./data.json');
    let award_image_list = apl_data.listTemplate2ListData.listPage.listItems;
    apl_data.listTemplate2ListData.listPage.listItems = award_image_list.slice(0, award_list.length);

    return handlerInput.responseBuilder
      .speak(speechText + 'スキルを終了する場合は、アレクサ、ストップ といってください。')
      .addDirective({
        type: 'Alexa.Presentation.APL.RenderDocument',
        version: '1.0',
        document: require('./homepage.json'),
        datasources: apl_data
      })
      .getResponse();
  },
  createAwardJson() {

  }
};

module.exports = ShowMeIntentHandler;