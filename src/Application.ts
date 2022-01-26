import Logger, { createLogger, LogLevel } from 'bunyan';
import cors from 'cors';
import express, { Express, Request, Response } from 'express';
import { join } from 'path';
import { ConnectionOptions, Database } from './Database';
import router from './router';

export interface ApplicationOptions {
  logLevel: string | number;
  connectionOptions: ConnectionOptions;
}

export class Application {
  // Singleton application
  private static app: Express;
  public static logger: Logger;
  public static databaseManager: Database;
  //   public static database: Mongoose;

  /**
   * Returns an Express Application with an active database connection
   * @param options
   */
  public static async getApp(app: Express, options: ApplicationOptions): Promise<express.Application> {
    if (this.app) return this.app;

    // Project metadata
    /* eslint @typescript-eslint/no-var-requires: "off" */
    const metadata = require(join('..', 'package.json'));

    // Create logger instance
    this.logger = createLogger({
      name: metadata.name,
      version: metadata.version,
      level: options.logLevel as LogLevel,
      serializers: {
        dbQuery: (data) => {
          let query = JSON.stringify(data.query);
          let options = JSON.stringify(data.options || {});

          return `db.${data.coll}.${data.method}(${query}, ${options});`;
        },
      },
    });

    // Create database Manager instance
    this.databaseManager = new Database(options.connectionOptions as ConnectionOptions, this.logger);
    await this.databaseManager.initialize();

    // Express Application
    this.app = app;
    const corsOptions = {
      maxAge: 86400,
      credentials: true,
    };
    this.app.use(cors(corsOptions));

    this.app.use(express.json());

    //configure logging middleware
    const loggingMiddleware = (req: Request, res: Response, next: express.NextFunction) => {
      this.logger.info(`REQUEST ${req.method} ${req.url}`);
      res.on('finish', () => {
        this.logger.info(`RESPONSE ${res.statusCode} ${req.method} ${req.url}`);
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
      this.logger.error('Unhandled Exception {err}', err);
      if (!res.headersSent) {
        res.status(500);
        res.json({ error: err.message || 'Something went wrong' });
      }
      next(err);
    };

    this.app.use(loggingMiddleware);
    // Set route Base URL `/v1/`
    this.app.use(`/${process.env.BASE_API_URI}`, router);
    // Handle when router did not match
    this.app.use(pageNotFound);
    this.app.use(exceptionHandler);

    return this.app;
  }
}
