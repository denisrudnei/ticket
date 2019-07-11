const seeder = require('mongoose-seed')
const AnalystSeed = require('./seeds/AnalystSeed')
const CategorySeed = require('./seeds/CategorySeed')
const TicketSeed = require('./seeds/TicketSeed')
const GroupSeed = require('./seeds/GroupSeed')
const StatusSeed = require('./seeds/StatusSeed')

seeder.setLogOutput(false)

const data = async function() {
  return [
    {
      model: 'Analyst',
      documents: AnalystSeed.seed(1)
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
      model: 'Ticket',
      documents: await TicketSeed.seed(5)
    }
  ]
}

const models = [
  './server/models/Analyst.js',
  './server/models/ticket/Group.js',
  './server/models/ticket/Status.js',
  './server/models/ticket/Category.js',
  './server/models/Path.js',
  './server/models/ticket/Ticket.js'
]

const seed = {
  execute: async callback => {
    await seeder.connect(
      process.env.MONGODB_TESTING_URI || 'mongodb://127.0.0.1/testing',
      async function(err) {
        if (err) throw err
        seeder.loadModels(models)
        const d = await data()
        seeder.clearModels(d.map(m => m.model), function() {
          seeder.populateModels(data, function() {
            callback()
          })
        })
      }
    )
  },
  disconnect: seeder.disconnect
}

module.exports = seed
