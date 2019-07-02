const faker = require('faker')
const mongoose = require('mongoose')
const generate = require('./Generate')

const seed = number => {
  const template = () => ({
    _id: new mongoose.Types.ObjectId(),
    name: faker.name.firstName(),
    role: 'user',
    color: '#fff',
    password: faker.internet.password(),
    adress: null,
    active: true,
    email: faker.internet.email()
  })
  return generate(template, number)
}

module.exports = { seed }
