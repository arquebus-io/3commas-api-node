'use strict';

const threeCommasAPI = require(".");

class threeCommasAPIV2 extends threeCommasAPI {
  constructor(opts) {
    super(opts);
    this.smartTradesV2 = async (params) =>
      await this.makeRequest('GET', `/v2/smart_trades?`, params)
  }
}

module.exports = threeCommasAPIV2