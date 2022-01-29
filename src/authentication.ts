import express from 'express';
import { createResponse } from './common/responseHelper';

const UNATHORIZED_RESPONSE = {
  status: 401,
  statusDescription: 'Unauthorized',
};

/**
 * Authentication middleware
 *
 * @param req
 * @param res
 * @param next
 * @returns
 */
export async function authenticate(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): Promise<any> {
  if (allowAuthorizationOverride(req)) {
    return next();
  }
  if (!('authorization' in req.headers) || req.headers.authorization?.length == 0) {
    return res.status(UNATHORIZED_RESPONSE.status).send(UNATHORIZED_RESPONSE.statusDescription);
  }

  const response = UNATHORIZED_RESPONSE;

  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token === 'getir-challenge') {
    return next();
  }

  return createResponse(res, response.status, 0, response.statusDescription, [], []);
}

/**
 * Checks if authorization should be disabled for the current request
 * @param  {Object} request
 * @return {Boolean}
 */
function allowAuthorizationOverride(request: express.Request) {
  // In CORS-enabled requests, there's a preflight OPTIONS request to validate permissions
  // Let the request continue to the Origin so it can get the server CORS headers
  if (!('authorization' in request.headers) && request.method === 'OPTIONS') {
    return true;
  }

  return false;
}
