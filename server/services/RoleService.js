const Role = require('../models/Role')
const CheckACL = require('../models/CheckACL')
const Analyst = require('../models/Analyst')

const RoleService = {
  getRoles() {
    return new Promise((resolve, reject) => {
      CheckACL.checkDb(err => {
        if (err) return reject(err)
      })
      Role.find({}).exec((err, roles) => {
        if (err) return reject(err)
        return resolve(roles)
      })
    })
  },
  updateRole(roleId, role) {
    return new Promise((resolve, reject) => {
      Role.updateOne(
        {
          _id: roleId
        },
        {
          $set: {
            description: role.description
          }
        }
      ).exec(err => {
        if (err) return reject(err)
        return resolve()
      })
    })
  },
  setAnalystRole(analystId, roleName) {
    return new Promise((resolve, reject) => {
      Analyst.updateOne(
        {
          _id: analystId
        },
        {
          $set: {
            role: roleName
          }
        }
      ).exec(err => {
        if (err) return reject(err)
        return resolve()
      })
    })
  }
}

module.exports = RoleService
