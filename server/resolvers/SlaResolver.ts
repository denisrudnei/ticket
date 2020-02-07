import SlaService from '@/server/services/ticket/SlaService'

const SlaResolver = {
  Query: {
    Sla: () => {
      return SlaService.getAll()
    }
  },
  Mutation: {
    CreateSla: (_: any, { sla }: any) => {
      return SlaService.create(sla)
    }
  }
}

export default SlaResolver
