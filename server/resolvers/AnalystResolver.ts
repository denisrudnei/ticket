import { IResolvers } from 'graphql-tools'
import AnalystService from '../services/AnalystService'

const AnalystResolver: IResolvers = {
  Query: {
    Analyst: () => {
      return AnalystService.getAnalysts()
    }
  }
}
export default AnalystResolver
