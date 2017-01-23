// @flow
import { Template } from 'meteor/templating'
import { TemplateVar } from 'meteor/frozeman:template-var'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { ReactivePromise } from 'meteor/deanius:promise'
import { moment } from 'meteor/momentjs:moment'

import ClosableSection from '/client/tmpl/components/closableSection'
import Identity from '/client/lib/identity'
import StockWatcher from '/client/lib/ethereum/stocks'
import StockSaleWatcher from '/client/lib/ethereum/stocksales'
import { Company } from '/client/lib/ethereum/deployed'
import { Stock } from '/client/lib/ethereum/contracts'
import web3 from '/client/lib/ethereum/web3'

const Stocks = StockWatcher.Stocks

const tmpl = Template.Module_Fundraising_New_Bounded.extend([ClosableSection])

tmpl.onRendered(function () {
  TemplateVar.set('selectedStock', -1)

  this.$('.dropdown').dropdown({
    onChange: (v) => TemplateVar.set(this, 'selectedStock', +v),
  })
  this.$('.form').form({
    onSuccess: async (e) => {
      e.preventDefault()
      this.$('.dimmer').trigger('loading')

      const title = this.$('input[name=title]').val()
      const selectedStock = TemplateVar.get(this, 'selectedStock')
      const price = web3.toWei(this.$('input[name=price]').val(), 'ether')
      const min = this.$('input[name=min]').val()
      const cap = this.$('input[name=cap]').val()
      const closes = +moment(this.$('[type=date]').val()) / 1000

      const address = Identity.current(true).ethereumAddress

      await StockSaleWatcher
        .createBoundedSale(address, selectedStock, min, cap, price, closes, title)

      this.$('.dimmer').trigger('finished', { state: 'success' })
      return false
    },
  })
})

tmpl.helpers({
  selectedRecipient: () => (TemplateVar.get('recipient')),
  entity: ReactivePromise(Identity.get),
  stocks: () => Stocks.find(),
  defaultAddress: () => Identity.current(true).ethereumAddress,
  availableShares: ReactivePromise((selectedStock) => {
    const stock = Stocks.findOne({ index: +selectedStock })
    if (!stock) { return Promise.reject() }
    return Stock.at(stock.address).balanceOf(Company.address).then(x => x.valueOf())
  }, '', '0'),
})

tmpl.events({
  'select .identityAutocomplete': (e, instance, user) => (TemplateVar.set('recipient', user)),
  'success .dimmer': () => FlowRouter.go('/fundraising'),
})
