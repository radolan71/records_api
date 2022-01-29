import { NextFunction, Response } from 'express';
import { mockRequest, mockResponse } from '../../common/tests/MockHelper';
import { RecordMiddleware, RecordSearchRequest } from './RecordMiddleware';

describe('Unit - Tests RecordMiddleware', () => {
  const recordMiddleware = new RecordMiddleware();
  const nextFunction: NextFunction = jest.fn();

  it('Test validateFields with valid data', async () => {
    const req = mockRequest({
      body: {
        startDate: '2016-01-26',
        endDate: '2018-02-02',
        minCount: 2700,
        maxCount: 3000,
      } as Partial<RecordSearchRequest>,
    });
    const res: Response = mockResponse();

    await recordMiddleware.validateFields(req, res, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
  });

  it('Unit - Test validateFields with missing fields', async () => {
    const req = mockRequest({
      body: {
        startDate: '2016-01-26',
        endDate: '2018-02-02',
      } as Partial<RecordSearchRequest>,
    });
    const res: Response = mockResponse();

    await recordMiddleware.validateFields(req, res, nextFunction);
    expect(res.status).toHaveBeenLastCalledWith(400);
  });

  it('Unit - Test validateFields with invalid date', async () => {
    const req = mockRequest({
      body: {
        startDate: '2016-26-01',
        endDate: '2018-02-02',
        minCount: 2700,
        maxCount: 3000,
      } as Partial<RecordSearchRequest>,
    });
    const res: Response = mockResponse();

    await recordMiddleware.validateFields(req, res, nextFunction);
    expect(res.status).toHaveBeenLastCalledWith(400);
  });

  it('Unit - Test validateFields with invalid date , end is earlier than start ', async () => {
    const req = mockRequest({
      body: {
        startDate: '2016-26-01',
        endDate: '2014-02-02',
        minCount: 2700,
        maxCount: 3000,
      } as Partial<RecordSearchRequest>,
    });
    const res: Response = mockResponse();

    await recordMiddleware.validateFields(req, res, nextFunction);
    expect(res.status).toHaveBeenLastCalledWith(400);
  });

  it('Unit - Test validateFields with invalid count , maxCount is bigger than minCount ', async () => {
    const req = mockRequest({
      body: {
        startDate: '2016-26-01',
        endDate: '2014-02-02',
        minCount: 27000,
        maxCount: 3000,
      } as Partial<RecordSearchRequest>,
    });
    const res: Response = mockResponse();

    await recordMiddleware.validateFields(req, res, nextFunction);
    expect(res.status).toHaveBeenLastCalledWith(400);
  });
});
