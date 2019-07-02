const seeder = require('mongoose-seed')
const AnalystSeed = require('./seeds/AnalystSeed')
const CategorySeed = require('./seeds/CategorySeed')
const TicketSeed = require('./seeds/TicketSeed')
const GroupSeed = require('./seeds/GroupSeed')
const StatusSeed = require('./seeds/StatusSeed')

seeder.setLogOutput(false)

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
    model: 'Ticket',
    documents: TicketSeed.seed(5)
  }
]

const models = [
  './server/models/Analyst.js',
  './server/models/Group.js',
  './server/models/Status.js',
  './server/models/Category.js',
  './server/models/Path.js',
  './server/models/Ticket.js'
]

const seed = {
  execute: callback => {
    seeder.connect(
      'mongodb://127.0.0.1/testing',
      function(err) {
        if (err) throw err
        seeder.loadModels(models)
        seeder.clearModels(data.map(m => m.model), function() {
          seeder.populateModels(data, function() {
            callback()
          })
        })
      }
    )
  },
  finish() {
    seeder.disconnect()
  }
}

module.exports = seed
