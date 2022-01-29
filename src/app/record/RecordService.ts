import { Request } from 'express';
import { Application } from '../../Application';
import { Record } from './RecordEntity';
import { RecordSearchRequest } from './RecordMiddleware';

export class RecordService {
  private static instance: RecordService;

  static getInstance(): RecordService {
    if (!RecordService.instance) {
      RecordService.instance = new RecordService();
    }
    return RecordService.instance;
  }

  getByConditions(req: Request): Promise<any> {
    const body: RecordSearchRequest = req.body;
    return new Promise(async (resolve, reject) => {
      const dateQuery = {
        createdAt: { $gte: new Date(body.startDate), $lte: new Date(body.endDate) },
      };
      const countQuery = { totalCount: { $gte: body.minCount, $lte: body.maxCount } };
      const collection = Application.databaseManager.database.collection('records');
      const limit = req.query.limit ? parseInt(req.query.limit.toString()) : 100;
      const results = await collection.aggregate([
        {
          $match: dateQuery,
        },
        { $sort: { createdAt: -1 } },
        {
          $unwind: '$counts',
        },
        {
          $group: {
            _id: '$_id',
            key: { $first: '$_id' },
            createdAt: { $first: '$createdAt' },
            totalCount: { $sum: '$counts' },
          },
        },
        {
          $match: countQuery,
        },
        {
          $project: {
            _id: 0,
            key: 1,
            createdAt: 1,
            totalCount: 1,
          },
        },
        {
          $facet: {
            paginatedResults: [{ $skip: req.skip ?? 0 }, { $limit: limit }],
            totalCount: [
              {
                $count: 'count',
              },
            ],
          },
        },
      ]);
      const array = await results.toArray();
      const itemCount = array && array[0] && array[0].totalCount.lenght ? array[0].totalCount[0].count : 0;
      const pageCount = Math.ceil(itemCount / limit);
      const pagination = {
        page: req.query.page ?? 1,
        per_page: limit,
        page_count: pageCount,
      };

      return resolve({ records: array[0].paginatedResults as Record[], pagination: pagination });
    });
  }
}
