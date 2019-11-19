import faker from 'faker'
import mongoose from 'mongoose'
import Ticket from '../../server/models/ticket/Ticket'
import Analyst from '../../server/models/Analyst'
import Status from '../../server/models/ticket/Status'
import Group from '../../server/models/ticket/Group'
import Category from '../../server/models/ticket/Category'
import CategorySeed from './CategorySeed'
import AnalystSeed from './AnalystSeed'
import GroupSeed from './GroupSeed'
import StatusSeed from './StatusSeed'

const analyst = async function() {
  await Analyst.create(AnalystSeed(1)[0])
  const result = await Analyst.findOne().exec()
  return result
}
const group = async function() {
  await Group.create(GroupSeed(1)[0])
  const result = await Group.findOne().exec()
  return result
}
const status = async function() {
  await Status.create(StatusSeed(1)[0])
  const result = await Status.findOne().exec()
  return result
}
const category = async function() {
  await Category.create(CategorySeed(1)[0])
  const result = await Category.findOne().exec()
  return result
}

const seed = () => {
  return new Promise(async (resolve, reject) => {
    await mongoose.connect(
      process.env.MONGODB_TESTING_URI || 'mongodb://127.0.0.1/testing',
      {
        useNewUrlParser: true
      }
    )
    if (mongoose.connection.readyState !== 1) {
      reject(new Error('Disconnected'))
    }
    await Ticket.deleteMany({})

    const analystResult = await analyst()
    const categoryResult = await category()
    const groupResult = await group()
    const statusResult = await status()
    const ticketsToSave = [
      {
        _id: new mongoose.Types.ObjectId(),
        resume: faker.lorem.paragraph(),
        content: faker.lorem.paragraph(),
        category: categoryResult._id,
        actualUser: analystResult._id,
        affectedUser: analystResult._id,
        openedBy: analystResult._id,
        group: groupResult._id,
        status: statusResult._id
      }
    ]
    const saved = await Ticket.create(ticketsToSave)
    return resolve(saved)
  })
}

export default seed
