import seed from './seed'
import 'mocha'

before(function() {
  this.timeout(0)
  return seed.execute()
})

after(function() {
  this.timeout(0)
  return seed.disconnect()
})
