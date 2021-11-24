// @ts-check

import getApp from '../server/index.js';
import { getTestData, prepareData, signIn } from './helpers/index.js';

describe('test tasks CRUD', () => {
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

  it('GET /tasks', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('tasks'),
      cookies: cookie,
    });
    expect(response.statusCode).toBe(200);
  });

  it('GET /tasks/new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newTask'),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('POST /tasks', async () => {
    const {
      tasks: { new: updatedTaskData },
    } = testData;
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('createTask'),
      cookies: cookie,
      payload: {
        data: {
          ...updatedTaskData,
        },
      },
    });
    expect(response.statusCode).toBe(302);
    const task = await models.task.query().findOne({ name: updatedTaskData.name });
    expect(task).toMatchObject(updatedTaskData);
  });

  it('GET /tasks/:id/edit', async () => {
    const existedTask = testData.tasks.existing;
    const response = await app.inject({
      method: 'GET',
      cookies: cookie,
      url: app.reverse('editTask', { id: existedTask.id }),
    });
    expect(response.statusCode).toBe(200);
  });

  afterEach(async () => {
    // после каждого теста откатываем миграции
    await knex.migrate.rollback();
  });

  afterAll(async () => {
    app.close();
  });
});
