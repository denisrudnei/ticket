const faker = require('faker')
const mongoose = require('mongoose')
const Analyst = require('../../server/models/Analyst')
const Status = require('../../server/models/ticket/Status')
const Group = require('../../server/models/ticket/Group')
const Category = require('../../server/models/ticket/Category')
const generate = require('./Generate')
const CategorySeed = require('./CategorySeed')
const AnalystSeed = require('./AnalystSeed')
const GroupSeed = require('./GroupSeed')
const StatusSeed = require('./StatusSeed')

const analyst = AnalystSeed.seed(1)[0]
const group = GroupSeed.seed(1)[0]
const status = StatusSeed.seed(1)[0]
const category = CategorySeed.seed(1)[0]

Promise.all([
  Analyst.create(analyst),
  Status.create(status),
  Group.create(group),
  Category.create(category)
])

const seed = number => {
  const template = () => ({
    _id: new mongoose.Types.ObjectId(),
    resume: faker.lorem.paragraph(),
    content: faker.lorem.paragraph(),
    category: category._id,
    actualUser: analyst._id,
    openedBy: analyst._id,
    group: group._id,
    status: status._id
  })
  return generate(template, number)
}

module.exports = { seed }
