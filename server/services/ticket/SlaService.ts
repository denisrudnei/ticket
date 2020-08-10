import Sla from '@/server/models/ticket/Sla';

class SlaService {
  static async getAll(): Promise<Sla[]> {
    return Sla.find();
  }

  static async getOne(slaId: Sla['id']): Promise<Sla> {
    const sla = await Sla.findOne(slaId);
    if (!sla) throw new Error('Sla not found');
    return sla;
  }

  static async create(sla: Sla): Promise<Sla> {
    const newSla = new Sla();

    newSla!.name = sla.name;
    newSla!.limit = sla.limit;

    return Sla.create(newSla).save();
  }

  static async edit(slaId: Sla['id'], slaToEdit: Sla): Promise<Sla> {
    const sla = await Sla.findOne(slaId);
    if (!sla) throw new Error('Sla not found');
    sla.name = slaToEdit.name;
    sla.limit = slaToEdit.limit;
    await sla.save();
    return SlaService.getOne(slaId);
  }
}

export default SlaService;
