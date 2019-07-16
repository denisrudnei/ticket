const faker = require('faker')
const mongoose = require('mongoose')
const Ticket = require('../../server/models/ticket/Ticket')
const Analyst = require('../../server/models/Analyst')
const Status = require('../../server/models/ticket/Status')
const Group = require('../../server/models/ticket/Group')
const Category = require('../../server/models/ticket/Category')
const CategorySeed = require('./CategorySeed')
const AnalystSeed = require('./AnalystSeed')
const GroupSeed = require('./GroupSeed')
const StatusSeed = require('./StatusSeed')

const analyst = async function() {
  await Analyst.create(AnalystSeed.seed(1)[0])
  const result = await Analyst.findOne().exec()
  return result
}
const group = async function() {
  await Group.create(GroupSeed.seed(1)[0])
  const result = await Group.findOne().exec()
  return result
}
const status = async function() {
  await Status.create(StatusSeed.seed(1)[0])
  const result = await Status.findOne().exec()
  return result
}
const category = async function() {
  await Category.create(CategorySeed.seed(1)[0])
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
        openedBy: analystResult._id,
        group: groupResult._id,
        status: statusResult._id
      }
    ]
    const saved = await Ticket.create(ticketsToSave)
    return resolve(saved)
  })
}

module.exports = { seed }
