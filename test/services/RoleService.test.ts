import RoleService from '../../server/services/RoleService'
import Role from '../../server/models/Role'
import Analyst from '../../server/models/Analyst'

describe('Role', () => {
  it('Get roles', async () => {
    await RoleService.getRoles()
  })

  it('Update role', async () => {
    const role = await Role.findOne().exec()
    role.description = 'other description'
    await RoleService.updateRole(role._id, role)
  })

  it('Update analyst role', async () => {
    const analyst = await Analyst.findOne().exec()
    const role = await Role.findOne().exec()
    await RoleService.setAnalystRole(analyst._id, role.name)
  })
})
