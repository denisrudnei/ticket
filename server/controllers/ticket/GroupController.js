const GroupService = require('../../services/ticket/GroupService')

module.exports = {
  getAll: (req, res) => {
    GroupService.getAll()
      .then(groups => {
        return res.status(200).json(groups)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  },

  getOne: (req, res) => {
    GroupService.getOne(req.params.id)
      .then(group => {
        return res.status(200).json(group)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  },

  create: (req, res) => {
    GroupService.create(req.body)
      .then(() => {
        res.sendStatus(201)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  },

  insertAnalyst: (req, res) => {
    GroupService.insertAnalyst(req.params.groupId, req.body._id)
      .then(() => {
        return res.sendStatus(201)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  },

  edit: (req, res) => {
    GroupService.edit(req.params.id, req.body)
      .then(group => {
        return res.status(200).json(group)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  },

  remove: (req, res) => {
    GroupService.removeAnalyst(req.params.groupId, req.params.analystId)
      .then(() => {
        return res.sendStatus(201)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  }
}
