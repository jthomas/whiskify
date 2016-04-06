const test = require('ava')
const proxyquire = require('proxyquire')

let create_params = {}, params = {}
let deleted = false

const ctor = (params) => {
  return {
    actions: {
      create: () => {
        create_params = params
        return Promise.resolve()
      },
      delete: (_) => {
        params = _
        return Promise.resolve()
      }
    }
  }
}

const whiskify = proxyquire('../index.js', {'openwhisk-client-js': ctor})({api: 'api', api_key: 'api_key', namespace: 'namespace'})

test('can delete a remote function', t => {
  const source = function (a) {return a*2;}
  const action = whiskify(source)

  t.plan(1)
  return action.delete().then(() => {
    t.is(create_params.actionName, params.actionName)
  })
})
