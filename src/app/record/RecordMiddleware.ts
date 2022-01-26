import express from 'express';
import { body, validationResult } from 'express-validator';
import { validateIsoDate } from '../../common/validators';

export class RecordMiddleware {
  private static instance: RecordMiddleware;

  static getInstance(): RecordMiddleware {
    if (!RecordMiddleware.instance) {
      RecordMiddleware.instance = new RecordMiddleware();
    }
    return RecordMiddleware.instance;
  }

  async validateFields(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    await body('maxCount').notEmpty().isInt().run(req);
    await body('minCount').notEmpty().isInt().run(req);
    await body('startDate').notEmpty().custom(validateIsoDate).run(req);
    await body('endDate').notEmpty().custom(validateIsoDate).run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).send({ errors: errors.array() });
      return;
    }

    next();
  }
}
