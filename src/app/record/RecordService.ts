import { Request } from 'express';
import { Application } from '../../Application';
import { Record } from './RecordEntity';

export class RecordService {
  private static instance: RecordService;

  static getInstance(): RecordService {
    if (!RecordService.instance) {
      RecordService.instance = new RecordService();
    }
    return RecordService.instance;
  }

  getByConditions(req: Request): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const dateQuery = {
        $and: [{ createdAt: { $gt: new Date(req.body.startDate), $lt: new Date(req.body.endDate) } }],
      };

      const collection = Application.databaseManager.database.collection('records');
      const limit = req.query.limit ? parseInt(req.query.limit.toString()) : 100;
      const [results, itemCount] = await Promise.all([
        collection.aggregate([
          {
            $match: dateQuery,
          },
          { $sort: { createdAt: -1 } },
          { $skip: req.skip ?? 0 },
          { $limit: limit },
          {
            $unwind: '$counts',
          },
          {
            $group: {
              _id: '$_id',
              totalCount: { $sum: '$counts' },
            },
          },
          {
            $project: {
              _id: 0,
              key: '$_id',
              createdAt: 1,
              totalCount: '$totalCount',
            },
          },
        ]),
        collection.count({}),
      ]);

      const pageCount = Math.ceil(itemCount / limit);
      const array = await results.toArray();

      const pagination = {
        page: req.query.page ?? 1,
        per_page: limit,
        page_count: pageCount,
        total_count: itemCount,
      };

      return resolve({ records: array as Record[], pagination: pagination });
    });
  }
}
