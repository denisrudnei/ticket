import Analyst from '~/server/models/Analyst'
import CheckACL from '~/server/models/CheckACL'
import Role from '~/server/models/Role'

class RoleService {
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

  updateRole(roleId: Role['id'], roleToEdit: Role): Promise<void> {
    return new Promise((resolve, reject) => {
      Role.findOne(roleId).then(role => {
        role!.description = roleToEdit.description
        role!.save().then(() => {
          resolve()
        })
      })
    })
  }

  setAnalystRole(analystId: Analyst['id'], roleName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      Analyst.findOne(analystId).then(analyst => {
        analyst!.role = roleName
        analyst!.save().then(() => {
          resolve()
        })
      })
    })
  }
}

export default new RoleService()
