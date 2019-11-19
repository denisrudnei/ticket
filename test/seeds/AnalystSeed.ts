import faker from 'faker'
import mongoose from 'mongoose'
import generate from './Generate'

const seed = (number: number) => {
  const template = () => ({
    _id: new mongoose.Types.ObjectId(),
    name: faker.name.firstName(),
    role: 'user',
    color: '#fff',
    password: faker.internet.password(),
    address: null,
    active: true,
    email: faker.internet.email()
  })
  return generate(template, number)
}

export default seed
