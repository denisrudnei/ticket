import mongoose from 'mongoose'
import generate from './Generate'
const seed = (number: number) => {
  const template = () => ({
    _id: new mongoose.Types.ObjectId(),
    objectName: 'category',
    property: 'name',
    name: 'categories'
  })
  return generate(template, number)
}

export default seed
