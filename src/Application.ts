import Logger, { createLogger, LogLevel } from 'bunyan';
import cors from 'cors';
import express, { Express, Request, Response } from 'express';
import { join } from 'path';
import { Application } from 'serverless-http';
import { authenticate } from './authentication';
import { ConnectionOptions, DatabaseManager } from './databaseManager';
import router from './router';

export interface ApplicationOptions {
  logLevel: string | number;
  connectionOptions: ConnectionOptions;
}

// Singleton application
let app: Express;
let logger: Logger;
export let databaseManager: DatabaseManager;

/**
 * Returns an Express Application with an active database connection
 * @param options
 */
export const getApp = async (appParameter?: Express, options?: ApplicationOptions): Promise<Application> => {
  if (app !== undefined) return app;

  if (!appParameter) {
    throw new Error('Application has not been initialized yet');
  }

  if (!options) {
    throw new Error('Missing basic app condiguration');
  }

  // Project metadata
  /* eslint @typescript-eslint/no-var-requires: "off" */
  const metadata = require(join('..', 'package.json'));

  // Create logger instance
  logger = createLogger({
    name: metadata.name,
    version: metadata.version,
    level: options.logLevel as LogLevel,
    serializers: {
      dbQuery: (data) => {
        const query = JSON.stringify(data.query);
        const options = JSON.stringify(data.options || {});

        return `db.${data.coll}.${data.method}(${query}, ${options});`;
      },
    },
  });

  // Create database Manager instance
  databaseManager = new DatabaseManager(options.connectionOptions as ConnectionOptions, logger);
  await databaseManager.initialize();

  // Express Application
  app = appParameter;
  const corsOptions = {
    maxAge: 86400,
    credentials: true,
  };
  app.use(cors(corsOptions));

  app.use(express.json());

  //configure logging middleware
  const loggingMiddleware = (req: Request, res: Response, next: express.NextFunction) => {
    logger.info(`REQUEST ${req.method} ${req.url}`);
    res.on('finish', () => {
      logger.info(`RESPONSE ${res.statusCode} ${req.method} ${req.url}`);
    });
    next();
  };

  //configure page nor found middleware
  const pageNotFound = (req: Request, res: Response, next: express.NextFunction) => {
    let body;
    const contentType = req.headers['content-type'] || '';
    if (contentType.length && contentType.indexOf('application/json')) {
      body = { error: 'Not Found' };
    } else {
      body = 'Not Found';
    }
    if (!res.headersSent) res.status(404).send(body);
    else next();
  };
  //configure exception handler middleware
  const exceptionHandler = (err: any, req: Request, res: Response, next: express.NextFunction) => {
    logger.error('Unhandled Exception {err}', err);
    if (!res.headersSent) {
      res.status(500);
      res.json({ error: err.message || 'Something went wrong' });
    }
    next(err);
  };

  if (process.env.NODE_ENV !== 'test') {
    app.use(authenticate);
  }

  if (options.logLevel === 'debug') {
    app.use(loggingMiddleware);
  }

  // Set route Base URL `/v1/`
  app.use(`/${process.env.BASE_API_URI}`, router);
  // Handle when router did not match
  app.use(pageNotFound);
  app.use(exceptionHandler);

  return app;
};
