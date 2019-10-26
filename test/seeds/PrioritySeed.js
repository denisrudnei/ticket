const mongoose = require('mongoose')
const generate = require('./Generate')

const seed = number => {
  const template = () => ({
    _id: new mongoose.Types.ObjectId(),
    name: 'test',
    weight: 0
  })
  return generate(template, number)
}

module.exports = { seed }
