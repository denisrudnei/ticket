import fs from 'fs'
import path from 'path'

const folder = path.resolve(__dirname)

fs.readdirSync(folder).forEach(file => {
  module.exports[file] = require(path.join(folder, file))
})
