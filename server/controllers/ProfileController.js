const _ = require('lodash')
const Ticket = require('../models/Ticket')
const Analyst = require('../models/Analyst')

module.exports = app => {
  app.get('/profile', (req, res) => {
    const id = req.session.authUser._id
    const result = {}
    Ticket.find({})
      .populate(['category', 'status', 'openedBy'])
      .exec((err, tickets) => {
        if (err) return res.status(500).json(err)
        result.opened = tickets.filter(t => {
          return t.openedBy._id.toString() === id
        }).length
        result.total = tickets.length
        result.categories = _(tickets)
          .groupBy('category')
          .map(v => ({
            name: v[0].category.fullName,
            total: v.length
          }))
        result.status = _(tickets)
          .groupBy('status')
          .map(v => ({
            name: v[0].status.name,
            total: v.length
          }))
        result.inName = _(tickets)
          .groupBy('actualUser')
          .map(v => ({
            id: v[0].actualUser._id,
            total: v.length
          }))
          .find(v => {
            return v.id === id
          })
        return res.status(200).json(result)
      })
  })

  app.get('/profile/address', (req, res) => {
    Analyst.findOne({
      _id: req.session.authUser._id
    })
      .populate('address')
      .exec((err, analyst) => {
        if (err) return res.status(500).json(err)
        return res.status(200).json(analyst.address)
      })
  })
}
