const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak('ヘルプメッセージ')
      .reprompt('ヘルプメッセージ')
      .getResponse();
  },
};

module.exports = HelpIntentHandler;
