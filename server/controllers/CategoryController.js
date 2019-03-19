const mongoose = require('mongoose')
const Category = require('../models/Category')

module.exports = app => {
  app.get('/category', (req, res) => {
    Category.find({})
      .populate(['father', 'subs'])
      .exec((err, categories) => {
        if (err || categories === null) return res.status(500).json(err)
        return res.status(200).json(categories)
      })
  })

  app.get('/category/:name', (req, res) => {
    Category.findOne({ name: req.params.name }, (err, result) => {
      if (err) return res.status(500).json(err)
      return res.status(200).json(result)
    })
  })

  app.get('/category/:id/subs', (req, res) => {
    Category.findOne({ _id: req.params.id }).exec((err, result) => {
      if (err) return res.status(500).json(err)
      return res.status(200).json(result)
    })
  })

  app.post('/category', async (req, res) => {
    const category = {
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name
    }

    const father = await Category.findOne({ _id: req.body.father._id }).exec()

    if (father) {
      category.father = father._id
    }

    Category.create(category, (err, category) => {
      if (err || category === null) return res.status(500).json(err)
      if (father !== null) {
        father.subs.push(category)
        father.save()
      }
      return res.sendStatus(200)
    })
  })
}
