import Role from './Role';

const AclRules = require('~/nacl.json');

interface IPermission {
  resource: string
  methods: string
  action: string
}

interface IRule {
  group: string
  permissions: [IPermission]
}

class CheckACL {
  static async checkDb() {
    const roles = AclRules.map(async (rule: IRule) => {
      const result = await Role.findOne({
        where: {
          name: rule.group,
        },
      });
      if (!result) {
        const role = Role.create();
        role!.name = rule.group;
        role!.description = 'Gerado automaticamente com base nas regras do servidor';
        const saved = await role.save();
        return saved;
      }
      return result;
    });
    return Promise.all(roles);
  }
}

export default CheckACL;
