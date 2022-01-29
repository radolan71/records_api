import express from 'express';
import { body, validationResult } from 'express-validator';
import { createResponse } from '../../common/responseHelper';
import { validateDate } from '../../common/validators';

export interface RecordSearchRequest {
  startDate: string;
  endDate: string;
  minCount: number;
  maxCount: number;
}

export class RecordMiddleware {
  private static instance: RecordMiddleware;

  static getInstance(): RecordMiddleware {
    if (!RecordMiddleware.instance) {
      RecordMiddleware.instance = new RecordMiddleware();
    }
    return RecordMiddleware.instance;
  }

  async validateFields(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    await body('maxCount').notEmpty().isInt({ min: req.body.minCount }).run(req);
    await body('minCount').notEmpty().isInt({ min: 0, max: req.body.maxCount }).run(req);
    await body('startDate').notEmpty().custom(validateDate).run(req);
    await body('endDate').notEmpty().custom(validateDate).run(req);
    await body('startDate').isBefore(req.body.endDate);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      createResponse(res, 400, 100, 'Validation Error', [], errors.array());
      return;
    }

    next();
  }
}
