import Sla from '@/server/models/ticket/Sla';

class SlaService {
  static getAll(): Promise<Sla[]> {
    return new Promise((resolve, reject) => {
      Sla.find().then((results: Sla[]) => {
        resolve(results);
      });
    });
  }

  static getOne(slaId: Sla['id']): Promise<Sla> {
    return new Promise((resolve, reject) => {
      Sla.findOne(slaId).then((result) => {
        resolve(result);
      });
    });
  }

  static create(sla: Sla): Promise<Sla> {
    return new Promise((resolve, reject) => {
      const newSla = new Sla();
      newSla!.name = sla.name;
      newSla!.limit = sla.limit;

      resolve(Sla.create(newSla).save());
    });
  }

  static edit(slaId: Sla['id'], slaToEdit: Sla): Promise<Sla> {
    return new Promise((resolve, reject) => {
      Sla.findOne(slaId).then((sla) => {
        sla!.name = slaToEdit.name;
        sla!.limit = slaToEdit.limit;
        sla!.save().then(() => {
          resolve(SlaService.getOne(slaId));
        });
      });
    });
  }
}

export default SlaService;
