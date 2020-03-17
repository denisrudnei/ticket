import CategoryService from '../../server/services/ticket/CategoryService'
import Category from '../../server/models/ticket/Category'
import 'mocha'

describe('CategoryService', function() {
  this.timeout(0)

  it('Get Categories', async () => {
    await CategoryService.getCategories()
  })

  it('Crete a new category', async () => {
    const category = new Category({
      name: 'Test',
      father: null
    })
    await CategoryService.create(category)
  })

  it('Crete a new category with father', async () => {
    const father = await Category.findOne().exec()
    const category = new Category({
      name: 'Test',
      father: father
    })
    await CategoryService.create(category)
  })

  it('Show full name', async () => {
    const category = await Category.findOne()
    /* eslint-disable-next-line */
    console.log(category.fullName)
  })

  it('Edit category', async () => {
    const category = await Category.findOne()
    category.name = 'test name'
    await CategoryService.edit(category._id, category)
  })

  it('Create a new category with fields', async () => {
    const field1 = {
      text: 'text of field',
      limits: {
        min: 0,
        max: 5
      }
    }
    const category = new Category({
      name: 'test',
      father: null,
      fields: [field1]
    })
    await CategoryService.create(category)
  })

  it('Get all categories', async () => {
    await CategoryService.getCategories()
  })

  it('Get one category', async () => {
    const category = await Category.findOne().exec()
    await CategoryService.getOne(category._id)
  })

  it('Get subs', async () => {
    const category = await Category.findOne().exec()
    await CategoryService.getSubsForCategory(category._id)
  })
})
