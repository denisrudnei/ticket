import Analyst from '~/server/models/Analyst';
import CheckACL from '~/server/models/CheckACL';
import Role from '~/server/models/Role';

class RoleService {
  static getOne(id: Role['id']): Promise<Role> {
    return new Promise((resolve, reject) => {
      Role.findOne(id).then((role) => {
        resolve(role);
      });
    });
  }

  static getRoles(): Promise<Role[]> {
    return new Promise((resolve, reject) => {
      CheckACL.checkDb((err: Error) => {
        if (err) reject(err);
      });
      Role.find().then((roles) => resolve(roles));
    });
  }

  static async updateRole(roleId: Role['id'], roleToEdit: Role): Promise<Role> {
    const role = await Role.findOne(roleId);
      role!.description = roleToEdit.description;
      return role!.save();
  }

  static setAnalystRole(
    analystId: Analyst['id'],
    roleId: Role['id'],
  ): Promise<Boolean> {
    return new Promise((resolve, reject) => {
      Analyst.findOne(analystId).then(async (analyst) => {
        const role = await Role.findOne(roleId);
        analyst!.role = role!;
        analyst!.save().then(() => {
          resolve(true);
        });
      });
    });
  }
}

export default RoleService;
