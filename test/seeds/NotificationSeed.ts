import mongoose from 'mongoose'
import generate from './Generate'
import AnalystSeed from './AnalystSeed'

const seed = (number: number) => {
  const analysts = AnalystSeed(5)

  const template = () => ({
    _id: new mongoose.Types.ObjectId(),
    name: 'notification',
    content: 'Notification created',
    to: analysts,
    from: analysts[0]
  })
  return generate(template, number)
}

export default seed
