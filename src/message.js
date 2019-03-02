module.exports = {
  SKILL_NAME: 'トイレトレーニング',

  // LAUNCH
  LAUNCH: 'このスキルではトイレトレーニングの結果の記録や確認ができます。今日は成功できましたか？それとも失敗しちゃった？',

  // Common
  REPEAT: 'もう一度教えてください',
  CONGURATURATION: '<say-as interpret-as="interjection">おめでとう</say-as>！',
  MEMORY: '%d回目の成功を記念して、',
  GET_AWARD: '%sのご褒美シールを手に入れました。',
  CONFIRM_AWARD: 'ご褒美シールは<break time="0.3s"/>アレクサ、トイレトレーニングでご褒美シール見せて<break time="0.3s"/>というといつでも確認できます。',
  
  // Record
  RECORD_CONFIRM: 'トイレは成功できましたか？それとも失敗しちゃった？',
  RECORD_REPEAT: 'もう一度教えてください',
  RECORD_GOOD: '<say-as interpret-as="interjection">やった</say-as>、次も<say-as interpret-as="interjection">がんばってね</say-as>',
  RECORD_BAD: '<say-as interpret-as="interjection">ドンマイ</say-as>、次こそ<say-as interpret-as="interjection">がんばってね</say-as>',

  // TellMe
  TELLME_CONFIRM: 'どちらの記録が知りたいですか？成功の記録？それとも失敗の記録？',
  TELLME_NOT_FOUND: 'まだ記録がありません。',

  // DELETE
  DELETE_CANCEL: '削除はキャンセルしました。',
  DELETE_COMPLETE: '記録をすべて削除しました。',

  SEEYOU: 'またいつでも呼び出してください。',
  HELP: '詳しい使い方を知りたい場合は ヘルプ といってください。',
  HELP_DETAIL:
    '成功したよ<break time="0.3s"/>または<break time="0.3s"/>失敗したよ<break time="0.3s"/>というとトイレトレーニングの結果を記録することができます。' +
    'これまでの記録を知りたい場合は<break time="0.3s"/>教えて<break time="0.3s"/>と言ってください。' +
    'スキルを終了する場合はストップと言ってください。',

  AWARD: {
    10: 'オタマジャクシ',
    20: 'ミツバチ',
    30: '金魚',
    40: 'くまのみ',
    50: 'クリオネ',
    60: 'モモンガ',
    70: 'くじら',
    80: 'ライオン',
    90: 'クジャク',
    100: 'ティラノサウルス'
  },
  getAwardList(count) {
    let list = [];
    for(let key in this.AWARD) {
      if (key <= count) {
        list.push(this.AWARD[key]);
      }
    }
    return list;
  },
  getAward(count) {
    if (undefined === this.AWARD[count]) {
      return '';
    } else {
      return this.AWARD[count];
    }
  },
  getNextAwardWord(count) {
    const nextAward = 10 - (count % 10);
    return 'あと' + nextAward + '回成功すると次のご褒美シールが貰えます。';
  },
  isAward(count) {
    return undefined != this.AWARD[count];
  },
  sayGoodBye() {
    const GOOD_BYE = [
      '<say-as interpret-as="interjection">じゃね</say-as>',
      '<say-as interpret-as="interjection">バイバイ</say-as>',
      '<say-as interpret-as="interjection">また明日</say-as>',
      '<say-as interpret-as="interjection">またね</say-as>',
      '<say-as interpret-as="interjection">んじゃ</say-as>',
    ];
    return GOOD_BYE[Math.floor(Math.random() * GOOD_BYE.length)];
  },
  sayYear() {
    const LIST = [
      '<say-as interpret-as="interjection">イェイ</say-as>。',
      '<say-as interpret-as="interjection">わおぅ</say-as>。',
      '<say-as interpret-as="interjection">やった</say-as>。',
      '<say-as interpret-as="interjection">わ〜い</say-as>。'
    ];
    return LIST[Math.floor(Math.random() * (LIST.length))];
  },
  saySad() {
    const LIST = [
      '<say-as interpret-as="interjection">およよ</say-as>。',
      '<say-as interpret-as="interjection">しくしく</say-as>。',
      '<say-as interpret-as="interjection">とほほ</say-as>。',
    ];
    return LIST[Math.floor(Math.random() * (LIST.length))];
  }
}
