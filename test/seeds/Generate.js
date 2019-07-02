const generate = (template, number) => {
  const result = []
  for (let i = 0; i < number; i++) {
    result.push(template())
  }
  return result
}

module.exports = generate
