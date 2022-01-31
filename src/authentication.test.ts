import { NextFunction, Response } from 'express';
import { authenticate } from './authentication';
import { mockRequest, mockResponse } from './common/tests/MockHelper';

describe('Authentication Middleware', () => {
  const nextFunction: NextFunction = jest.fn();
  test('Unit - Authorize preflight request without Token', async () => {
    const req = mockRequest({
      method: 'OPTIONS',
      headers: {},
    });
    const res: Response = mockResponse();

    await authenticate(req, res, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
  });

  test('Unit - Blocks unauthorized request', async () => {
    const req = mockRequest({
      method: 'POST',
      headers: {},
      url: '/v1/records',
    });
    const res: Response = mockResponse();

    await authenticate(req, res, nextFunction);
    expect(res.status).toHaveBeenLastCalledWith(401);
  });

  test('Unit - Blocks unauthorized request with invalid token', async () => {
    const req = mockRequest({
      method: 'POST',
      headers: { authorization: 'Bearer 123' },
      url: '/v1/records',
    });
    const res: Response = mockResponse();

    await authenticate(req, res, nextFunction);
    expect(res.status).toHaveBeenLastCalledWith(401);
  });
});
