import { Request, Response } from 'express';
import { createResponse } from '../../common/responseHelper';
import { RecordService } from './RecordService';

const service = () => RecordService.getInstance();

export class RecordController {
  getByConditions = async (req: Request, res: Response): Promise<void> => {
    const result = await service().getByConditions(req);
    createResponse(res, 200, 0, '', result.records, [], result.pagination);
  };
}
