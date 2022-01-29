import Logger from 'bunyan';
import { Db, MongoClient } from 'mongodb';

export interface ConnectionOptions {
  connectionString: string;
}
export class DatabaseManager {
  connectionOptions: ConnectionOptions;
  logger: Logger;
  client: MongoClient;
  database: Db;

  constructor(connectionOptions: ConnectionOptions, logger: Logger) {
    this.connectionOptions = connectionOptions;
    this.logger = logger;
  }

  /**
   * Initializes the database connection
   */
  async initialize(): Promise<void> {
    this.client = new MongoClient(this.connectionOptions.connectionString);
    await this.client.connect();
    this.database = this.client.db('getir-case-study');
  }
}
