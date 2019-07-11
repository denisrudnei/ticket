const mongoose = require('mongoose')
const seed = require('./seed')

before(function(done) {
  this.timeout(0)

  mongoose.connect(
    process.env.MONGODB_TESTING_URI || 'mongodb://127.0.0.1/testing',
    {
      useNewUrlParser: true
    },
    function(err) {
      if (err) throw err
      seed.execute(() => done())
    }
  )
})

after(function(done) {
  mongoose.disconnect(() => {
    done()
  })
})
