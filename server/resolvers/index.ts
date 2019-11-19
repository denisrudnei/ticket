import fs from 'fs'
import path from 'path'

const resolvers: any = {
  Query: {},
  Mutation: {},
  Subscription: {}
}

const folder = path.resolve(__dirname)

fs.readdirSync(folder).forEach(file => {
  const toMerge = require(path.join(folder, file))
  Object.keys(resolvers).forEach(key => {
    resolvers[key] = Object.assign(resolvers[key], toMerge[key])
  })
})

export default resolvers
