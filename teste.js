const mongoose = require('mongoose')
const Category = require('./server/models/ticket/Category')
const Field = require('./server/models/ticket/Field')

mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://localhost/test',
  { useNewUrlParser: true },
  function() {
    Category.findOne({
      _id: '5cf83b311b75162daf921132'
    }).exec((err, category) => {
      if (err) throw err
      console.log(category)
    })
  }
)
