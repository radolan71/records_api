import { APIGatewayProxyEvent, APIGatewayProxyStructuredResultV2, Context } from 'aws-lambda';
import express from 'express';
import serverlessHttp from 'serverless-http';
import { Application, ApplicationOptions } from './application';

const app = express();

// Application options
const options: ApplicationOptions = {
  logLevel: process.env.LOG_LEVEL || 'debug',
  connectionOptions: {
    connectionString: process.env.DATABASE_URL || '',
  },
};

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyStructuredResultV2> => {
  // Start Application
  const configuredApp = await Application.getApp(app, options);
  const expressHandler = serverlessHttp(configuredApp as serverlessHttp.Application);
  return await expressHandler(event, context);
};
