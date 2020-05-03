import mongoose from 'mongoose'
import generate from './Generate'

const seed = (number: number) => {
  const template = () => ({
    _id: new mongoose.Types.ObjectId(),
    name: 'Test',
    sla: {
      _id: mongoose.Types.ObjectId(),
      name: 'test sla',
      limit: new Date()
    }
  })
  return generate(template, number)
}

export default seed
