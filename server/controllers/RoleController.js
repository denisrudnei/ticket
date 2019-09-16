const RoleService = require('../services/RoleService')

module.exports = {
  getAll: (req, res) => {
    RoleService.getRoles()
      .then(roles => {
        return res.status(200).json(roles)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  },

  updateRole: (req, res) => {
    RoleService.updateRole(req.params.id, req.body)
      .then(() => {
        return res.sendStatus(201)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  },

  setAnalystRole: (req, res) => {
    RoleService.setAnalystRole(req.params.id, req.body.name)
      .then(() => {
        return res.sendStatus(201)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  }
}
