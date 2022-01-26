import { RecordSearchRequest } from './RecordController';
import { Record } from './RecordEntity';

export class RecordService {
  private static instance: RecordService;

  static getInstance(): RecordService {
    if (!RecordService.instance) {
      RecordService.instance = new RecordService();
    }
    return RecordService.instance;
  }

  list(): Promise<Record[]> {
    return new Promise((resolve, reject) => {
      return resolve([]);
    });
  }

  getByConditions(request: RecordSearchRequest): Promise<Record[]> {
    return new Promise((resolve, reject) => {
      return resolve([]);
    });
  }
}
