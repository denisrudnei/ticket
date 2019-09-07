const mongoose = require('mongoose')
const faker = require('faker')
const generate = require('./Generate')

const seed = number => {
  const template = () => ({
    _id: new mongoose.Types.ObjectId(),
    name: 'Test address',
    city: faker.address.city(),
    state: faker.address.state(),
    country: faker.address.country(),
    street: faker.address.streetName()
  })

  return generate(template, number)
}

module.exports = { seed }
