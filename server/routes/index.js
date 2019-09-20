const fs = require('fs')
const path = require('path')
const router = require('express').Router()

const folder = path.resolve(__dirname)

fs.readdirSync(folder).forEach(file => {
  const m = require(path.join(folder, file))
  if (!file.includes('.js')) {
    Object.keys(m).forEach(innerModule => {
      if (innerModule !== 'index.js') {
        router.use(m[innerModule])
      }
    })
  }
  if (file !== 'index.js' && file.includes('.js')) router.use(m)
})

module.exports = router
