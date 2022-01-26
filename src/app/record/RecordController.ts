import { Request, Response } from 'express';
import { RecordService } from './RecordService';

const service = () => RecordService.getInstance();

export interface RecordSearchRequest {
  startDate: string;
  endDate: string;
  minCount: number;
  maxCount: number;
}

export class RecordController {
  list = (req: Request, res: Response): void => {
    Promise.resolve(service().list()).then((result) => {
      res.status(200).json(result);
    });
  };

  getByConditions(req: Request, res: Response): void {
    Promise.resolve(service().getByConditions(req.body)).then((result) => {
      if (!result) {
        res.status(404).send({
          error: [{ description: `Record with condition(s) ${JSON.stringify(req.query)} not found ` }],
        });
      } else {
        res.status(200).json(result);
      }
    });
  }
}
