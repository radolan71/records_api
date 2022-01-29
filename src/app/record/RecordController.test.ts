import { TestFactory } from '../../common/tests/TestFactory';

describe('Integration - Record Controller Test', () => {
  const factory: TestFactory = TestFactory.getInstance();

  beforeAll(async () => {
    await factory.init();
  });

  afterAll(async () => {
    await factory.close();
  });

  it('GET /v1', async () => {
    const res = await factory.getApp().get('/v1').set('Accept', 'application/json');

    expect(res.status).toBe(200);
    expect(res.type).toEqual('application/json');
  });

  it('GET /v1/records - Valide only POST are accepted', async () => {
    const res = await factory.getApp().get('/v1/records/').set('Accept', 'application/json');
    expect(res.status).toBe(404);
  });

  it('POST /v1/records - Should receive Validation Error', async () => {
    const res = await factory.getApp().post('/v1/records/').set('Accept', 'application/json');
    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({
      code: 100,
      msg: 'Validation Error',
      records: [],
      metadata: {},
      errors: {},
    });
    expect(res.type).toEqual('application/json');
  });

  it('POST /v1/records - Should receive no results', async () => {
    const res = await factory.getApp().post('/v1/records/').set('Accept', 'application/json').send({
      startDate: '2016-01-26',
      endDate: '2018-02-02',
      minCount: 2700,
      maxCount: 3000,
    });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      code: 0,
      msg: '',
      records: [],
      metadata: {},
    });
    expect(res.type).toEqual('application/json');
  });

  it('POST /v1/records - Should receive results', async () => {
    const res = await factory.getApp().post('/v1/records/').set('Accept', 'application/json').send({
      startDate: '2016-01-26',
      endDate: '2018-02-02',
      minCount: 0,
      maxCount: 3000,
    });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      code: 0,
      msg: '',
      records: [],
      metadata: {},
    });
    expect(res.type).toEqual('application/json');
  });
});
