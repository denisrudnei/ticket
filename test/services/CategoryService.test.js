const expect = require('expect')
const CategoryService = require('../../server/services/ticket/CategoryService')

describe('CategoryService', function() {
  this.timeout(0)

  it('Get Categories', () => {
    CategoryService.getCategories()
      .then(result => {
        expect(result).toBeTruthy()
      })
      .catch(e => {
        expect(e).toBeNull()
      })
  })

  it('Crete a new category', () => {
    CategoryService.create('Teste', null)
      .then(result => {
        expect(result).toBeTruthy()
      })
      .catch(e => {
        expect(e).toBeTruthy()
      })
  })
})
