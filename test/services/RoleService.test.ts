import RoleService from '../../server/services/RoleService';
import Role from '../../server/models/Role';
import Analyst from '../../server/models/Analyst';

describe('Role', () => {
  it('Get roles', async () => {
    await RoleService.getRoles();
  });

  it('Update role', async () => {
    const role = await Role.findOne();
    role!.description = 'other description';
    await RoleService.updateRole(role!.id, role!);
  });

  it('Update analyst role', async () => {
    const analyst = await Analyst.findOne();
    const role = await Role.findOne();
    await RoleService.setAnalystRole(analyst!.id, role!.id);
  });
});
