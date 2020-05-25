import Seed from './Seed'

class Generate {
  public static many<T extends Seed<any>>(seed: T, number: number) {
    const results = []
    for (let i = 0; i < number; i++) {
      const result = seed.init()
      results.push(result)
    }
    return Promise.all(results)
  }
}
export default Generate
