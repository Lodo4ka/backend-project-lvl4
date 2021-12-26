// @ts-check

import getApp from '../server/index.js';
import { getTestData, prepareData, signIn } from './helpers/index.js';

describe('test statuses CRUD', () => {
  let app;
  let knex;
  let models;
  let cookie;
  const testData = getTestData();

  beforeAll(async () => {
    app = await getApp();
    knex = app.objection.knex;
    models = app.objection.models;
  });

  beforeEach(async () => {
    await knex.migrate.latest();
    await prepareData(app);
    cookie = await signIn(app, testData.users.existing);
  });

  it('GET /statuses', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('statuses'),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('GET /status/new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newStatus'),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('POST /statuses', async () => {
    const updatedData = testData.statuses.new;
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('statusCreate'),
      cookies: cookie,
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
      cookies: cookie,
    });
    expect(response.statusCode).toBe(200);
  });

  it('PATCH status/:id', async () => {
    const { id } = testData.statuses.existing;
    const updatedData = { name: 'new status' };
    const response = await app.inject({
      method: 'PATCH',
      url: app.reverse('updateStatus', { id }),
      cookies: cookie,
      payload: {
        data: updatedData,
      },
    });
    expect(response.statusCode).toBe(302);

    const status = await models.status.query().findById(id);
    expect(status).toMatchObject(updatedData);
  });

  it('DELETE status', async () => {
    const { existing } = testData.statuses;

    const response = await app.inject({
      method: 'DELETE',
      url: app.reverse('deleteStatus', { id: existing.id }),
      cookies: cookie,
    });
    expect(response.statusCode).toBe(302);

    const status2 = await models.status.query().findById(existing.id);
    expect(status2).toBeUndefined();
  });

  afterEach(async () => {
    // после каждого теста откатываем миграции
    await knex.migrate.rollback();
  });

  afterAll(async () => {
    app.close();
  });
});
