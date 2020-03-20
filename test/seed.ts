import path from 'path'
import mongoose from 'mongoose'
import AnalystSeed from './seeds/AnalystSeed'
import CategorySeed from './seeds/CategorySeed'
import TicketSeed from './seeds/TicketSeed'
import GroupSeed from './seeds/GroupSeed'
import StatusSeed from './seeds/StatusSeed'
import NotificationSeed from './seeds/NotificationSeed'
import AddressSeed from './seeds/AddressSeed'
import PathSeed from './seeds/PathSeed'
import SlaSeed from './seeds/SlaSeed'
import PrioritySeed from './seeds/PrioritySeed'

interface IData {
  model: string
  documents: any[]
}

const data: IData[] = [
  {
    model: 'Analyst',
    documents: AnalystSeed(5)
  },
  {
    model: 'Category',
    documents: CategorySeed(5)
  },
  {
    model: 'Status',
    documents: StatusSeed(5)
  },
  {
    model: 'Group',
    documents: GroupSeed(5)
  },
  {
    model: 'Notification',
    documents: NotificationSeed(5)
  },
  {
    model: 'Address',
    documents: AddressSeed(5)
  },
  {
    model: 'Path',
    documents: PathSeed(5)
  },
  {
    model: 'Priority',
    documents: PrioritySeed(5)
  },
  {
    model: 'Sla',
    documents: SlaSeed(5)
  }
]

const models: string[] = [
  './server/models/Analyst.ts',
  './server/models/ticket/Log.ts',
  './server/models/ticket/Group.ts',
  './server/models/ticket/Status.ts',
  './server/models/ticket/Category.ts',
  './server/models/Path.ts',
  './server/models/knowledge/KnowledgeStatus.ts',
  './server/models/knowledge/Knowledge.ts',
  './server/models/ticket/Field.ts',
  './server/models/ticket/Ticket.ts',
  './server/models/Address.ts',
  './server/models/Notification.ts',
  './server/models/Path.ts',
  './server/models/ticket/Priority',
  './server/models/ticket/Sla'
]

const seed = {
  data: data,
  execute: async () => {
    await mongoose.connect(
      process.env.MONGODB_TESTING_URI || 'mongodb://127.0.0.1/testing',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      },
      async function(err) {
        if (err) throw err
        await seed.loadModels(models as [string])
        await seed.clearModels(data.map((v: IData) => v.model) as [string])
        await seed.populate(data as [IData])
        await TicketSeed()
      }
    )
  },
  loadModels: (paths: [string]) => {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < paths.length; i++) {
        const Model = require(path.resolve(paths[i])).default
        Model()
      }
      resolve()
    })
  },
  populate: async (data: [IData]) => {
    for (let i = 0; i < data.length; i++) {
      const modelName = data[i].model
      const Model = mongoose.model(modelName)

      for (let j = 0; j < data[i].documents.length; j++) {
        await Model.create(data[i].documents[j])
      }
    }
  },
  clearModels: async (models: [string]) => {
    for (let i = 0; i < models.length; i++) {
      const Model = mongoose.model(models[i])
      await Model.deleteMany({})
    }
  },
  disconnect: mongoose.disconnect
}

export default seed
