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

const CheckACL = {
  checkDb: (next: Function) => {
    AclRules.forEach((rule: IRule) => {
      Role.findOne({
        where: {
          name: rule.group,
        },
      }).then((result) => {
        if (!result) {
          const role = Role.create();
          role!.name = rule.group;
          role!.description = 'Gerado automaticamente com base nas regras do servidor';
          role.save();
        }
      });
    });
    return next(null);
  },
};

export default CheckACL;
