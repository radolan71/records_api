import Logger from 'bunyan';
// import mongoose from 'mongoose';
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
    // try {
    this.client = new MongoClient(this.connectionOptions.connectionString);
    await this.client.connect();
    this.database = this.client.db('getir-case-study');
    //   const records = this.database.collection('records');
    //   let o_id = new ObjectId('5ee21587e07f053f990ceafd');
    //   const query = { _id: o_id };
    //   const record = await records
    //     .find({ createdDate: { $gte: new ISODate('2017-04-14T23:59:59Z'), $lte: new ISODate('2017-04-15T23:59:59Z') } })
    //     .count();
    //   console.log('record', record);
    // } finally {
    //   // Ensures that the client will close when you finish/error
    //   await this.client.close();
    // }
  }
}
