import mongoose from 'mongoose'
import faker from 'faker'
import generate from './Generate'

const seed = (number: number) => {
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

export default seed
