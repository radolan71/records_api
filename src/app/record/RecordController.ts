import { Request, Response } from 'express';
import { createResponse } from '../../common/responseHelper';
import { RecordService } from './RecordService';

const service = () => RecordService.getInstance();

export class RecordController {
  getByConditions = async (req: Request, res: Response): Promise<void> => {
    Promise.resolve(service().getByConditions(req)).then((result) => {
      createResponse(res, 200, 0, '', result.records, [], result.pagination);
    });
  };
}
