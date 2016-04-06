const test = require('ava')
const proxyquire = require('proxyquire')

let ctor_params = {}, create_params = {}, invoke_params = []
let create_return, invoke_return
let invoke_count = 0
let main

const ctor = (params) => {
  ctor_params = params
  return {
    actions: {
      create: (params) => {
        create_params = params
        main = eval('(' + create_params.action + ')')
        return Promise.resolve()
      },
      invoke: (params) => {
        invoke_count++
        invoke_params.push(params)
        return Promise.resolve(main(params.params))
      }
    }
  }
}

const whiskify = proxyquire('../index.js', {'openwhisk-client-js': ctor})({api: 'api', api_key: 'api_key', namespace: 'namespace'})

test('can execute function remotely as array action', t => {
  const source = function (a) {return a*2;}
  const action = whiskify(source)

  t.plan(1)
  return action.map([1, 2, 3]).then((result) => {
    t.same(result, [2, 4, 6])
  })
})
