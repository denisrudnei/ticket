import AnalystService from '../services/AnalystService'
import {IResolvers} from 'graphql-tools'

const AnalystResolver: IResolvers = {
  Query: {
    Analyst: () => {
      return AnalystService.getAnalysts()
    }
  }  
}
export default AnalystResolver
