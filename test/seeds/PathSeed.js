const mongoose = require('mongoose')
const generate = require('./Generate')
const seed = number => {
  const template = () => ({
    _id: mongoose.Types.ObjectId(),
    objectName: 'category',
    property: 'name',
    name: 'categories'
  })
  return generate(template, number)
}

module.exports = { seed }
