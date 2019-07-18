const seed = require('./seed')

before(async function() {
  this.timeout(0)
  await seed.execute()
})

after(async function() {
  await seed.disconnect()
})
