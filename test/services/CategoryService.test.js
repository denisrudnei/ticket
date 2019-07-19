const CategoryService = require('../../server/services/ticket/CategoryService')

describe('CategoryService', function() {
  this.timeout(0)

  it('Get Categories', async () => {
    await CategoryService.getCategories()
  })

  it('Crete a new category', async () => {
    await CategoryService.create('Teste', null)
  })
})
