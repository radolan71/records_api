import { Request, Response } from 'express';
import { createResponse } from '../../common/responseHelper';
import { RecordService } from './RecordService';

const service = () => RecordService.getInstance();

export interface RecordSearchRequest {
  startDate: string;
  endDate: string;
  minCount: number;
  maxCount: number;
}

export class RecordController {
  getByConditions = (req: Request, res: Response): void => {
    Promise.resolve(service().getByConditions(req)).then((result) => {
      createResponse(res, 200, 0, '', result.records, [], result.pagination);
    });
  };
}
