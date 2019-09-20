const fs = require('fs')
const path = require('path')

const resolvers = {
  Query: {},
  Mutation: {}
}

const folder = path.resolve(__dirname)

fs.readdirSync(folder).forEach(file => {
  const toMerge = require(path.join(folder, file))
  Object.keys(resolvers).forEach(key => {
    resolvers[key] = Object.assign(resolvers[key], toMerge[key])
  })
})

module.exports = resolvers
