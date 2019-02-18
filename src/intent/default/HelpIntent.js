const Message = require('../../message');

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(Message.HELP_DETAIL)
      .reprompt(Message.HELP_DETAIL)
      .getResponse();
  },
};

module.exports = HelpIntentHandler;
