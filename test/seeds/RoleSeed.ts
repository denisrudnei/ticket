import Role from '../../server/models/Role'
import Seed from './Seed'
import Generate from './Generate'

class RoleSeed implements Seed<Role> {
  init(): Promise<Role> {
    const role = new Role()
    role.name = 'user'
    role.description = 'default description'
    return role.save()
  }

  generateMany(number: number): Promise<Role[]> {
    return Generate.many<RoleSeed>(new RoleSeed(), number)
  }

  destroy(): Promise<import('typeorm').DeleteResult> {
    return Role.delete({})
  }
}

export default RoleSeed
