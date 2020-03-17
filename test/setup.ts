import { before, after } from 'mocha'
import CheckACL from '../server/models/CheckACL'
import seed from './seed'

before(function() {
  this.timeout(0)
  CheckACL.checkDb((err: Error) => {
    if (err) throw err
  })
  return seed.execute()
})

after(function() {
  this.timeout(0)
  return seed.disconnect()
})
