const mongoose = require('mongoose')
const AclRules = require('../../nacl.json')
const Role = require('./Role')

const CheckACL = {
  checkDb: next => {
    AclRules.forEach(rule => {
      Role.findOne({
        name: rule.group
      }).exec((err, result) => {
        if (err) return next(err)
        if (result === null) {
          Role.create({
            _id: new mongoose.Types.ObjectId(),
            name: rule.group,
            description:
              'Gerado automaticamente com base nas regras do servidor'
          })
        }
      })
    })
    return next(null)
  }
}

module.exports = CheckACL
