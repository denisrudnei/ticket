const path = require('path')
const mongoose = require('mongoose')
const AnalystSeed = require('./seeds/AnalystSeed')
const CategorySeed = require('./seeds/CategorySeed')
const TicketSeed = require('./seeds/TicketSeed')
const GroupSeed = require('./seeds/GroupSeed')
const StatusSeed = require('./seeds/StatusSeed')
const NotificationSeed = require('./seeds/NotificationSeed')
const AddressSeed = require('./seeds/AddressSeed')

const data = [
  {
    model: 'Analyst',
    documents: AnalystSeed.seed(5)
  },
  {
    model: 'Category',
    documents: CategorySeed.seed(5)
  },
  {
    model: 'Status',
    documents: StatusSeed.seed(5)
  },
  {
    model: 'Group',
    documents: GroupSeed.seed(5)
  },
  {
    model: 'Notification',
    documents: NotificationSeed.seed(5)
  },
  {
    model: 'Address',
    documents: AddressSeed.seed(5)
  }
]

const models = [
  './server/models/Analyst.js',
  './server/models/ticket/Group.js',
  './server/models/ticket/Status.js',
  './server/models/ticket/Category.js',
  './server/models/Path.js',
  './server/models/ticket/Ticket.js',
  './server/models/Address.js',
  './server/models/Notification.js'
]

const seed = {
  data: data,
  execute: () => {
    return new Promise(async (resolve, reject) => {
      await mongoose.connect(
        process.env.MONGODB_TESTING_URI || 'mongodb://127.0.0.1/testing',
        {
          useNewUrlParser: true,
          useUnifiedTopology: true
        },
        async function(err) {
          if (err) return reject(err)
          await seed.loadModels(models)
          await seed.clearModels(data.map(v => v.model))
          await seed.populate(data)
          await TicketSeed.seed()
          return resolve()
        }
      )
    })
  },
  loadModels: paths => {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < paths.length; i++) {
        const Model = require(path.resolve(paths[i]))
        Model()
      }
      resolve()
    })
  },
  populate: data => {
    return new Promise(async (resolve, reject) => {
      for (let i = 0; i < data.length; i++) {
        const modelName = data[i].model
        const Model = mongoose.model(modelName)

        for (let j = 0; j < data[i].documents.length; j++) {
          await Model.create(data[i].documents[j])
        }
      }
      resolve()
    })
  },
  clearModels: models => {
    return new Promise(async (resolve, reject) => {
      for (let i = 0; i < models.length; i++) {
        const Model = mongoose.model(models[i])
        await Model.deleteMany({})
      }
      resolve()
    })
  },
  disconnect: async () => {
    await mongoose.disconnect
  }
}

module.exports = seed
