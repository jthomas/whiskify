const test = require('ava')
const proxyquire = require('proxyquire')

let create_params = {}, invoke_params = {}
let main

const ctor = (params) => {
  return {
    actions: {
      create: (params) => {
        create_params = params
        main = eval('(' + create_params.action + ')')
        return Promise.resolve()
      },
      invoke: (params) => {
        invoke_params = params
        const ret = {
          response: {result: main(params.params)}
        }
        return Promise.resolve(ret)
      }
    }
  }
}

const whiskify = proxyquire('../index.js', {'openwhisk': ctor})({api: 'api', api_key: 'api_key', namespace: 'namespace'})

test('can create function as remote action', t => {
  const action = whiskify(function () { return 'hello world'})
  t.true(typeof action === 'function')
  t.true(action.hasOwnProperty('map'))
})

test('can execute function remotely as action', t => {
  const source = function (a, b, c) {return [a+1, b+1, c+1]}
  const action = whiskify(source)

  t.plan(3)
  return action(1, 2, 3).then((result) => {
    t.is(create_params.actionName.length, 32)
    t.same(result, [2, 3, 4])
    t.is(create_params.actionName, invoke_params.actionName)
  })
})
