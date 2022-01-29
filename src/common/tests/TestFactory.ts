import express from 'express';
import { Server } from 'http';
import { Db, MongoClient } from 'mongodb';
import * as path from 'path';
import supertest from 'supertest';
import { Application, ApplicationOptions } from '../../Application';

const root: string = path.resolve(__dirname, '../../..');

// Set env to test
process.env.NODE_ENV = 'test';
process.env.BASE_API_URI = 'v1';

// Hostname to serve application on
const HOST = 'localhost';

/**
 * Loaded in each unit test using in memory db
 */
export class TestFactory {
  private app: express.Application;
  private server: Server;
  private connection: MongoClient;
  private static instance: TestFactory;
  private initialized = false;
  private db: Db;

  static getInstance(): TestFactory {
    if (!TestFactory.instance) {
      TestFactory.instance = new TestFactory();
    }
    return TestFactory.instance;
  }

  public getApp(): supertest.SuperTest<supertest.Test> {
    return supertest(this.app);
  }

  public getConnection(): MongoClient {
    return this.connection;
  }

  /**
   * Connect to DB and start server
   */
  public async init(): Promise<void> {
    if (this.initialized) {
      return;
    }
    // console.log(new Date().toLocaleString() + ': Initialising Factory');
    const options: ApplicationOptions = {
      logLevel: process.env.LOG_LEVEL || 'debug',
      connectionOptions: {
        connectionString: process.env.MONGO_URL as string, //use in memory url
      },
    };

    const configuredApp = await Application.getApp(express(), options);
    if (!configuredApp) {
      throw Error('Unable to configure testing app');
    }

    this.app = configuredApp as express.Application;
    this.server = await this.app.listen(0, HOST);

    this.connection = Application.databaseManager.client;
    this.db = Application.databaseManager.database;
    await this.seedDatabase();

    // console.log(await this.db.collection('records').find({}).toArray());

    // console.log(new Date().toLocaleString() + ': Test Factory Initialised');
    this.initialized = true;
  }

  /**
   * Seeds the Database with the Seeders data
   */
  private async seedDatabase(): Promise<void> {
    const records = this.db.collection('records');

    const mockRecords = [
      {
        key: 'TAKwGc6Jr4i8Z487',
        createdAt: '2014-01-28T01:22:14.398Z',
        counts: [120],
        value: 'Getir Task',
      },
      {
        key: 'cqgTPAdM',
        value: 'JaugKbZRIJSG',
        createdAt: '2015-10-14T08:43:13.661Z',
        counts: [854, 1793, 127],
      },
      {
        key: 'wgDZfKYA',
        value: 'fqkQYKzZguYo',
        createdAt: '2016-12-27T03:12:14.477Z',
        counts: [2, 1340, 651],
      },
    ];
    await records.insertMany(mockRecords);
  }

  // /**
  //  * Loads the fixtures to the Database
  //  */
  // private async loadFixtures(): Promise<void> {
  //   const loader = new Loader();
  //   loader.load(path.resolve(`${root}/src/common/tests/fixtures`));

  //   const resolver = new Resolver();
  //   const fixtures = resolver.resolve(loader.fixtureConfigs);
  //   const builder = new Builder(this.connection, new Parser());
  //   for (const fixture of fixturesIterator(fixtures)) {
  //     const entity = await builder.build(fixture);
  //     await this.connection.manager.save(entity);
  //   }
  // }

  /**
   * Close server and DB connection
   */
  public async close(): Promise<void> {
    // console.log(new Date().toLocaleString() + ': Test Factory Close Connections');
    await this.server.close();
    await this.connection.close();
  }
}
