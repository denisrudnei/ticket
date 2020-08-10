import Analyst from '~/server/models/Analyst';
import CheckACL from '~/server/models/CheckACL';
import Role from '~/server/models/Role';

class RoleService {
  static async getOne(id: Role['id']): Promise<Role> {
    const role = await Role.findOne(id);
    if (!role) throw new Error('Role not found');
    return role;
  }

  static async getRoles(): Promise<Role[]> {
    await CheckACL.checkDb();
    return Role.find();
  }

  static async updateRole(roleId: Role['id'], roleToEdit: Role): Promise<Role> {
    const role = await Role.findOne(roleId);
      role!.description = roleToEdit.description;
      return role!.save();
  }

  static async setAnalystRole(
    analystId: Analyst['id'],
    roleId: Role['id'],
  ): Promise<Boolean> {
    const analyst = await Analyst.findOne(analystId);
    if (!analyst) throw new Error('Analyst not found');
    const role = await Role.findOne(roleId);
    if (!role) throw new Error('Role not found');
    analyst.role = role;
    await analyst.save();
    return true;
  }
}

export default RoleService;
