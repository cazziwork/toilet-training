const DAO = require('../helper/db-access');

const Message = require('../message');

const DeleteIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'DeleteIntent';
  },
  async handle(handlerInput) {

    const { confirmationStatus } = handlerInput.requestEnvelope.request.intent;
    if (confirmationStatus === "DENIED") {
      return handlerInput.responseBuilder
        .speak(Message.DELETE_CANCEL + Message.SEEYOU + Message.sayGoodBye())
        .withShouldEndSession(true)
        .getResponse();
    }

    const dynamo = new DAO(handlerInput);
    await dynamo.clearData();
    return handlerInput.responseBuilder
      .speak(Message.DELETE_COMPLETE + Message.SEEYOU + Message.sayGoodBye())
      .withShouldEndSession(true)
      .getResponse();
  }
};

module.exports = DeleteIntentHandler;