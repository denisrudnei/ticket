const expect = require('expect')
const CategoryService = require('../../server/services/ticket/CategoryService')

it('Get Categories', done => {
  CategoryService.getCategories((err, result) => {
    expect(err).toBeNull()
    expect(result).toBeTruthy()
    done()
  })
})

it('Crete a new category', done => {
  CategoryService.create('Teste', (err, result) => {
    expect(err).toBeNull()
    expect(result).toBeTruthy()
    done()
  })
})
