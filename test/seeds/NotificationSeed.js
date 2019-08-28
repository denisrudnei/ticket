const mongoose = require('mongoose')
const generate = require('./Generate')
const AnalystSeed = require('./AnalystSeed')

const seed = number => {
  const analysts = AnalystSeed.seed(5)

  const template = () => ({
    _id: new mongoose.Types.ObjectId(),
    name: 'notification',
    content: 'Notication created',
    to: analysts,
    from: analysts[0]
  })
  return generate(template, number)
}

module.exports = { seed }
