import { Response } from 'express';
import { ValidationError } from 'express-validator';
import { Record } from '../app/record/RecordEntity';

export interface BaseResponse {
  code: number;
  msg: string;
  records: Record[];
  metadata: Partial<ResponseMetadata>;
}

export type ErrorResponse = BaseResponse & {
  errors: ValidationError[];
};

export interface ResponseMetadata {
  page: number;
  per_page: number;
  page_count: number;
  total_count: number;
}

export const createResponse = (
  res: Response,
  httpCode = 200,
  appCode = 0,
  message = '',
  records: Record[] = [],
  errors: ValidationError[] = [],
  metadata: Partial<ResponseMetadata> = {},
): void => {
  const responseBody: Partial<ErrorResponse> = { code: appCode, msg: message, records: records, metadata: metadata };
  if (errors.length) {
    responseBody.errors = errors;
  }

  res.status(httpCode).send(responseBody);
};
