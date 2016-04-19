'use strict'

const openwhisk = require('openwhisk')
const randomstring = require('randomstring')

const Whiskify = params => {
  const ow = openwhisk(params)

  return (func) => {
    const action_name = randomstring.generate()
    const create = ow.actions.create({
      actionName: action_name,
      action: 'function main(params) { var f = (' + func.toString() + '); return {ret: f.apply(this, params.args)};}'
    })

    const call = function () {
      const args = Array.prototype.slice.call(arguments)
      return create.then(() => {
        return ow.actions
          .invoke({actionName: action_name, params: {args: args}, blocking: true})
          .then(result => result.response.result.ret)
      })
    }

    call.map = (items) => {
      return Promise.all(items.map(item => call(item)))
    }

    call.delete = () => {
      return create.then(() => {
        return ow.actions.delete({actionName: action_name})
      })
    }

    return call
  }
}

module.exports = Whiskify
