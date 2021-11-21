// @ts-check

import getApp from '../server/index.js';
import { getTestData, prepareData } from './helpers/index.js';

describe('test statuses CRUD', () => {
  let app;
  let knex;
  let models;
  const testData = getTestData();

  beforeAll(async () => {
    app = await getApp();
    knex = app.objection.knex;
    models = app.objection.models;
  });

  beforeEach(async () => {
    await knex.migrate.latest();
    await prepareData(app);
  });

  it('GET /statuses', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('statuses'),
    });

    expect(response.statusCode).toBe(200);
  });

  it('GET /status/new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newStatus'),
    });

    expect(response.statusCode).toBe(200);
  });

  it('POST /statuses', async () => {
    const updatedData = testData.statuses.new;
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('statusCreate'),
      payload: {
        data: updatedData,
      },
    });
    expect(response.statusCode).toBe(302);
    const status = await models.status.query().findOne({ name: updatedData.name });
    expect(status).toMatchObject(updatedData);
  });

  it('GET status/:id/edit', async () => {
    const { id } = testData.statuses.existing;
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('editStatus', { id }),
    });
    expect(response.statusCode).toBe(200);
  });

  it('PATCH status/:id', async () => {
    const { id } = testData.statuses.existing;
    const updatedData = { name: 'new status' };
    const response = await app.inject({
      method: 'PATCH',
      url: app.reverse('updateStatus', { id }),
      payload: {
        data: updatedData,
      },
    });
    expect(response.statusCode).toBe(302);

    const status = await models.status.query().findById(id);
    expect(status).toMatchObject(updatedData);
  });

  afterEach(async () => {
    // после каждого теста откатываем миграции
    await knex.migrate.rollback();
  });

  afterAll(async () => {
    app.close();
  });
});
