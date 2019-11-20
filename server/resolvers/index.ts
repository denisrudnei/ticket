import fs from 'fs'
import path from 'path'

const resolvers: any = {
  Query: {},
  Mutation: {},
  Subscription: {}
}

const folder = path.resolve(__dirname)

fs.readdirSync(folder).forEach(async file => {
  const toMerge = require(path.join(folder, file))
  Object.keys(resolvers).forEach(key => {
    if (Object.prototype.hasOwnProperty.call(toMerge.default, key)) {
      resolvers[key] = Object.assign(resolvers[key], toMerge.default[key])
    }
  })
})

export default resolvers
