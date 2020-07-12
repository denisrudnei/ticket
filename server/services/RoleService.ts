import Analyst from '~/server/models/Analyst'
import CheckACL from '~/server/models/CheckACL'
import Role from '~/server/models/Role'

class RoleService {
  getOne(id: Role['id']): Promise<Role> {
    return new Promise((resolve, reject) => {
      Role.findOne(id).then(role => {
        resolve(role)
      })
    })
  }

  getRoles(): Promise<Role[]> {
    return new Promise((resolve, reject) => {
      CheckACL.checkDb((err: Error) => {
        if (err) reject(err)
      })
      Role.find().then(roles => {
        return resolve(roles)
      })
    })
  }

  updateRole(roleId: Role['id'], roleToEdit: Role): Promise<Role> {
    return new Promise((resolve, reject) => {
      Role.findOne(roleId).then(role => {
        role!.description = roleToEdit.description
        role!.save().then(role => {
          resolve(role)
        })
      })
    })
  }

  setAnalystRole(
    analystId: Analyst['id'],
    roleId: Role['id']
  ): Promise<Boolean> {
    return new Promise((resolve, reject) => {
      Analyst.findOne(analystId).then(async analyst => {
        const role = await Role.findOne(roleId)
        analyst!.role = role!
        analyst!.save().then(() => {
          resolve(true)
        })
      })
    })
  }
}

export default new RoleService()
