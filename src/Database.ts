import Logger from 'bunyan';
import mongoose from 'mongoose';

export interface ConnectionOptions {
  connectionString: string;
}

export class Database {
  connectionOptions: ConnectionOptions;
  logger: Logger;

  constructor(connectionOptions: ConnectionOptions, logger: Logger) {
    this.connectionOptions = connectionOptions;
    this.logger = logger;
  }

  /**
   * Initializes the database connection
   */
  async initialize(): Promise<void> {
    mongoose.set('debug', (coll, method, query, doc, options) => {
      let set = {
        coll: coll,
        method: method,
        query: query,
        doc: doc,
        options: options,
      };

      this.logger.info({
        dbQuery: set,
      });
    });
    await mongoose.connect(this.connectionOptions.connectionString);
  }
}
