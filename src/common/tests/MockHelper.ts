import type { Response, Request, NextFunction } from 'express';

export const mockResponse = (opts?: Partial<Response>): Response =>
  ({
    send: jest.fn().mockReturnValue({}),
    json: jest.fn(),
    status: jest.fn().mockReturnValue({ send: jest.fn().mockReturnValue({}) }),
    ...opts,
  } as unknown as Response);

export const mockRequest = (opts?: Partial<Request>): Request =>
  ({
    ...opts,
  } as unknown as Request);

export const mockNext: NextFunction = jest.fn();
