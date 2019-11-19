const generate = (template: any, number: number) => {
  const result = []
  for (let i = 0; i < number; i++) {
    result.push(template())
  }
  return result
}
export default generate
