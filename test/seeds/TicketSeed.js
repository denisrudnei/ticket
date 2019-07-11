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

const seed = async _ => {
  const categoryResult = await category()
  const analystResult = await analyst()
  const groupResult = await group()
  const statusResult = await status()

  return [
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
}

module.exports = { seed }
