const CategoryService = require('../../server/services/CategoryService')

test('Get Categories', done => {
  CategoryService.getCategories((err, result) => {
    expect(err).toBeNull()
    expect(result).toBeTruthy()
    done()
  })
})

test('Crete a new category', done => {
  CategoryService.create('Teste', (err, result) => {
    expect(err).toBeNull()
    expect(result).toBeTruthy()
    done()
  })
})
