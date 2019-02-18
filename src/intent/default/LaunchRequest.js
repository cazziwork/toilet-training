const Message = require('../../message');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    let speechText = this.getHourGreeting();
    speechText += Message.LAUNCH;
    
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(Message.HELP)
      .getResponse();
  },
  getHourGreeting(hour) {
    switch (hour) {
      case 19:
      case 20:
      case 21:
      case 22:
      case 23:
      case 24:
      case 0:
      case 1:
      case 2:
      case 3:
        return 'こんばんわ。';
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
      case 10:
        return 'おはようございます。';
      case 11:
      case 12:
      case 13:
      case 14:
      case 15:
      case 16:
      case 17:
      case 18:
      default:
        return 'こんにちは。';
    }
  }
};

module.exports = LaunchRequestHandler;
