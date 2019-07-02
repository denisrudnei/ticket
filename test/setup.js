const mongoose = require('mongoose')
const seed = require('./seed')

mongoose.connect(
  process.env.MONGODB_TESTING_URI || 'mongodb://127.0.0.1/testing',
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

afterAll(done => {
  mongoose.disconnect()
  done()
})
