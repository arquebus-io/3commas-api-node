'use strict'
const querystring = require('querystring');
const crypto = require('crypto');
const fetch = require('node-fetch');
const { API_URL } = require('./config');


class threeCommasAPI {
  constructor(opts = {}) {
    this._url = opts.url || API_URL
    this._apiKey = opts.apiKey || ''
    this._apiSecret = opts.apiSecret || ''

    this.generateSignature = (requestUri, reqData) => {
      const request = requestUri + reqData
      return crypto.createHmac('sha256', this._apiSecret).update(request).digest('hex')
    }

    this.makeRequest = async (method, path, params) => {
      if (!this._apiKey || !this._apiSecret) {
        return new Error('missing api key or secret')
      }

      const sig = this.generateSignature(path, querystring.stringify(params))

      try {
        let response = await fetch(
          `${this._url}${path}${querystring.stringify(params)}`,
          {
            method: method,
            timeout: 30000,
            agent: '',
            headers: {
              'APIKEY': this._apiKey,
              'Signature': sig
            }
          }
        )

        return await response.json()
      } catch (e) {
        console.error(e);
        return false
      }
    }

    /**
     * Deals methods
     */

    this.getDeals = async (params) =>
      await this.makeRequest('GET', '/public/api/ver1/deals?', params)

    this.dealUpdateMaxSafetyOrders = async (deal_id, max_safety_orders) =>
      await this.makeRequest('POST', `/public/api/ver1/deals/${deal_id}/update_max_safety_orders?`, { deal_id, max_safety_orders })

    this.dealPanicSell = async (deal_id) =>
      await this.makeRequest('POST', `/public/api/ver1/deals/${deal_id}/panic_sell?`, { deal_id })

    this.dealCancel = async (deal_id) =>
      await this.makeRequest('POST', `/public/api/ver1/deals/${deal_id}/cancel?`, { deal_id })

    this.dealUpdateTp = async (deal_id, new_take_profit_percentage) =>
      await this.makeRequest('POST', `/public/api/ver1/deals/${deal_id}/update_tp?`, { deal_id, new_take_profit_percentage })

    this.getDeal = async (deal_id) =>
      await this.makeRequest('GET', `/public/api/ver1/deals/${deal_id}/show?`, { deal_id })

    this.getDealSafetyOrders = async (deal_id) =>
      await this.makeRequest('GET', `/public/api/ver1/deals/${deal_id}/market_orders?`, { deal_id })

    this.dealAddFunds = async (params) =>
      await this.makeRequest('POST', `/public/api/ver1/deals/${params.deal_id}/add_funds?`, params)

    /**
     * Bots methods
     */

    this.getBotsBlackList = async () =>
      await this.makeRequest('GET', `/public/api/ver1/bots/pairs_black_list?`, null)

    this.botsUpdateBlackList = async (params) =>
      await this.makeRequest('POST', '/public/api/ver1/bots/update_pairs_black_list?', params)

    this.botCreate = async (params) =>
      await this.makeRequest('POST', '/public/api/ver1/bots/create_bot?', params)

    this.getBots = async (params) =>
      await this.makeRequest('GET', `/public/api/ver1/bots?`, params)

    this.getBotsStats = async (params) =>
      await this.makeRequest('GET', `/public/api/ver1/bots/stats?`, params)

    this.botUpdate = async (params) =>
      await this.makeRequest('PATCH', `/public/api/ver1/bots/${params.bot_id}/update?`, params)

    this.botDisable = async (bot_id) =>
      await this.makeRequest('POST', `/public/api/ver1/bots/${bot_id}/disable?`, { bot_id })

    this.botEnable = async (bot_id) =>
      await this.makeRequest('POST', `/public/api/ver1/bots/${bot_id}/enable?`, { bot_id })

    this.botStartNewDeal = async (params) =>
      await this.makeRequest('POST', `/public/api/ver1/bots/${params.bot_id}/start_new_deal?`, params)

    this.botDelete = async (bot_id) =>
      await this.makeRequest('POST', `/public/api/ver1/bots/${bot_id}/delete?`, { bot_id })

    this.botPaniceSellAllDeals = async (bot_id) =>
      await this.makeRequest('POST', `/public/api/ver1/bots/${bot_id}/panic_sell_all_deals?`, { bot_id })

    this.botCancelAllDeals = async (bot_id) =>
      await this.makeRequest('POST', `/public/api/ver1/bots/${bot_id}/cancel_all_deals?`, { bot_id })

    this.botShow = async (bot_id) =>
      await this.makeRequest('GET', `/public/api/ver1/bots/${bot_id}/show?`, { bot_id })

    /**
     * Grid methods
     */
    this.createAIGridBot = async (params) =>
      await this.makeRequest('POST', `/public/api/ver1/grid_bots/ai?`, params)

    this.createGridBot = async (params) =>
      await this.makeRequest('POST', `/public/api/ver1/grid_bots/manual?`, params)

    this.getAIGridBotsSettings = async (params) =>
      await this.makeRequest('GET', `/public/api/ver1/grid_bots/ai_settings?`, params)

    this.getGridBots = async (params) =>
      await this.makeRequest('GET', `/public/api/ver1/grid_bots?`, params)

    this.getGridBotMarketOrders = async (grid_bot_id) =>
      await this.makeRequest('GET', `/public/api/ver1/grid_bots/${grid_bot_id}/market_orders?`, { grid_bot_id })

    this.getGridBotProfits = async (grid_bot_id) =>
      await this.makeRequest('GET', `/public/api/ver1/grid_bots/${grid_bot_id}/profits?`, { grid_bot_id })

    this.editAIGridBot = async (params) =>
      await this.makeRequest('PATCH', `/public/api/ver1/grid_bots/${params.id}/ai?`, params)

    this.editGridBot = async (params) =>
      await this.makeRequest('PATCH', `/public/api/ver1/grid_bots/${params.id}/manual?`, params)

    this.gridBotShow = async (grid_bot_id) =>
      await this.makeRequest('GET', `/public/api/ver1/grid_bots/${grid_bot_id}?`, { grid_bot_id })

    this.deleteGridBot = async (grid_bot_id) =>
      await this.makeRequest('DELETE', `/public/api/ver1/grid_bots/${grid_bot_id}?`, { grid_bot_id })

    this.disableGridBot = async (grid_bot_id) =>
      await this.makeRequest('POST', `/public/api/ver1/grid_bots/${grid_bot_id}/disable?`, { grid_bot_id })

    this.enableGridBot = async (grid_bot_id) =>
      await this.makeRequest('POST', `/public/api/ver1/grid_bots/${grid_bot_id}/enable?`, { grid_bot_id })

    this.getGridBotRequiredBalances = async (grid_bot_id) =>
      await this.makeRequest('GET', `/public/api/ver1/grid_bots/${grid_bot_id}/required_balances?`, { grid_bot_id })

    /**
     * Smart Trades methods
     */

    this.smartTradesCreateSimpleSell = async (params) =>
      await this.makeRequest('POST', `/public/api/ver1/smart_trades/create_simple_sell?`, params)

    this.smartTradesCreateSimpleBuy = async (params) =>
      await this.makeRequest('POST', `/public/api/ver1/smart_trades/create_simple_buy?`, params)

    this.smartTradesCreateSmartSell = async (params) =>
      await this.makeRequest('POST', `/public/api/ver1/smart_trades/create_smart_sell?`, params)

    this.smartTradesCreateSmartCover = async (params) =>
      await this.makeRequest('POST', `/public/api/ver1/smart_trades/create_smart_cover?`, params)

    this.smartTradesCreateSmartTrade = async (params) =>
      await this.makeRequest('POST', `/public/api/ver1/smart_trades/create_smart_trade?`, params)

    this.smartTrades = async (params) =>
      await this.makeRequest('GET', `/public/api/ver1/smart_trades?`, params)

    this.smartTradesV2 = async (params) =>
      await this.makeRequest('GET', `/public/api/v2/smart_trades?`, params)

    this.smartTradesStepPanicSell = async (params) =>
      await this.makeRequest('POST', `/public/api/ver1/smart_trades/${params.smart_trade_id}/step_panic_sell?`, params)

    this.smartTradesUpdate = async (params) =>
      await this.makeRequest('PATCH', `/public/api/ver1/smart_trades/${params.smart_trade_id}/update?`, params)

    this.smartTradesCancel = async (smart_trade_id) =>
      await this.makeRequest('POST', `/public/api/ver1/smart_trades/${smart_trade_id}/cancel?`, { smart_trade_id })

    this.smartTradesPanicSell = async (smart_trade_id) =>
      await this.makeRequest('POST', `/public/api/ver1/smart_trades/${smart_trade_id}/panic_sell?`, { smart_trade_id })

    this.smartTradesForceProcess = async (smart_trade_id) =>
      await this.makeRequest('POST', `/public/api/ver1/smart_trades/${smart_trade_id}/force_process?`, { smart_trade_id })

  }

  /**
   * Accounts methods
   */

  async accountsNew(params) {
    return await this.makeRequest('POST', `/public/api/ver1/accounts/new?`, params)
  }

  async accounts() {
    return await this.makeRequest('GET', `/public/api/ver1/accounts?`, null)
  }

  async accountsMarketList() {
    return await this.makeRequest('GET', `/public/api/ver1/accounts/market_list?`, null)
  }

  async accountsCurrencyRates() {
    return await this.makeRequest('GET', `/public/api/ver1/accounts/currency_rates?`, null)
  }

  async accountSellAllToUsd(account_id) {
    return await this.makeRequest('POST', `/public/api/ver1/accounts/${account_id}/sell_all_to_usd?`, { account_id })
  }

  async accountSellAllToBtc(account_id) {
    return await this.makeRequest('POST', `/public/api/ver1/accounts/${account_id}/sell_all_to_btc?`, { account_id })
  }

  async accountLoadBalances(account_id) {
    return await this.makeRequest('POST', `/public/api/ver1/accounts/${account_id}/load_balances?`, { account_id })
  }

  async accountRename(params) {
    return await this.makeRequest('POST', `/public/api/ver1/accounts/${params.account_id}/rename?`, params)
  }

  async accountPieChartData(account_id) {
    return await this.makeRequest('POST', `/public/api/ver1/accounts/${account_id}/pie_chart_data?`, { account_id })
  }

  async accountTableData(account_id) {
    return await this.makeRequest('POST', `/public/api/ver1/accounts/${account_id}/account_table_data?`, { account_id })
  }

  async accountRemove(account_id) {
    return await this.makeRequest('POST', `/public/api/ver1/accounts/${account_id}/remove?`, { account_id })
  }

}

module.exports = threeCommasAPI
