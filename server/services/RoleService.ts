import Analyst, { IAnalyst } from '~/server/models/Analyst'
import CheckACL from '~/server/models/CheckACL'
import Role, { IRole } from '~/server/models/Role'

class RoleService {
  getRoles(): Promise<IRole[]> {
    return new Promise((resolve, reject) => {
      CheckACL.checkDb((err: Error) => {
        if (err) return reject(err)
      })
      Role.find({}).exec((err: Error, roles: IRole[]) => {
        if (err) return reject(err)
        return resolve(roles)
      })
    })
  }

  updateRole(roleId: IRole['_id'], role: IRole): Promise<void> {
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
      ).exec((err: Error) => {
        if (err) return reject(err)
        return resolve()
      })
    })
  }

  setAnalystRole(analystId: IAnalyst['_id'], roleName: string): Promise<void> {
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
      ).exec((err: Error) => {
        if (err) return reject(err)
        return resolve()
      })
    })
  }
}

export default new RoleService()
