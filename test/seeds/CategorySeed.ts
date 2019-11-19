import mongoose from 'mongoose'
import generate from './Generate'

const seed = (number: number) => {
  const template = () => ({
    _id: new mongoose.Types.ObjectId(),
    name: 'Teste'
  })
  return generate(template, number)
}

export default seed
