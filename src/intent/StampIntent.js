const StampIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'StampIntent';
  },
  async handle(handlerInput) {

    const { slots } = handlerInput.requestEnvelope.request.intent;
    if (!this.isValidResult(slots.result.value)) {
      let intentObj = handlerInput.requestEnvelope.request.intent;
      intentObj.confirmationStatus = "IN_PROGRESS";
      return handlerInput.responseBuilder
        .speak('ごめんね、トレイは成功できた？それとも失敗しちゃった？もう一度教えて')
        .reprompt('もう一度教えてね')
        .addElicitSlotDirective('result', intentObj)
        .getResponse();
    }
    const result = this.cleansing(slots.result.value);

    if ('成功' === result) {
      return handlerInput.responseBuilder
        .speak('<say-as interpret-as="interjection">おめでとう</say-as>、また次も<say-as interpret-as="interjection">がんばってね</say-as>')
        .withShouldEndSession(true)
        .getResponse();
    }

    return handlerInput.responseBuilder
      .speak('<say-as interpret-as="interjection">ドンマイ</say-as>、次こそ<say-as interpret-as="interjection">がんばってね</say-as>')
      .withShouldEndSession(true)
      .getResponse();

  },
  isValidResult(value) {
    return '' != this.cleansing(value);
  },
  cleansing(value) {
    switch (value) {
      case '成功':
      case 'せいこう':
      case 'セイコウ':
        return '成功';

      case '失敗':
      case 'しっぱい':
      case 'シッパイ':
        return '失敗';

      default:
        return '';
    }
  }
};

module.exports = StampIntentHandler;