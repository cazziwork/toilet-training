module.exports = class result_util {

  static isValidResult(value) {
    return '' != this.cleansing(value);
  }

  static cleansing(value) {
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
}