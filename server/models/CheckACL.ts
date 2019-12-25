import mongoose from 'mongoose'
import Role from './Role'
const AclRules = require('../../nacl.json')

interface IPermission {
  resource: string
  methods: string
  action: string
}

interface IRule {
  group: string
  permissions: [IPermission]
}

const CheckACL = {
  checkDb: (next: Function) => {
    AclRules.forEach((rule: IRule) => {
      Role.findOne({
        name: rule.group
      }).exec((err: Error, result) => {
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

export default CheckACL
