const mongoose = require('mongoose')
const seed = require('./seed')

mongoose.connect(
  'mongodb://127.0.0.1/testing',
  {
    useNewUrlParser: true
  },
  function(err) {
    if (err) throw err
  }
)

beforeAll(done => {
  seed.execute(() => {
    done()
  })
})
