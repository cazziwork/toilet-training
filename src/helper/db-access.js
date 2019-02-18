const _ = require('lodash');
module.exports = class DAO {
  constructor(hadler) {
    const { attributesManager } = hadler;
    this.attributesManager = attributesManager;
  }
  async getData() {
    let persistentAttributes = await this.attributesManager.getPersistentAttributes();
    return persistentAttributes.data;
  }
  async pushData(record) {
    let persistentAttributes = await this.attributesManager.getPersistentAttributes();
    if (_.isNil(persistentAttributes.data)) {
      persistentAttributes.data = [record];
    } else {
      persistentAttributes.data.push(record);
    }
    this.attributesManager.setPersistentAttributes(persistentAttributes);
    await this.attributesManager.savePersistentAttributes();
  }
}