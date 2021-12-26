// @ts-check

import _ from 'lodash';
import getApp from '../server/index.js';
import encrypt from '../server/lib/secure.js';
import { getTestData, prepareData, signIn } from './helpers/index.js';

describe('test users CRUD', () => {
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
    // тесты не должны зависеть друг от друга
    // перед каждым тестом выполняем миграции
    // и заполняем БД тестовыми данными
    await knex.migrate.latest();
    await prepareData(app);
    cookie = await signIn(app, testData.users.existing);
  });

  it('index', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('users'),
    });

    expect(response.statusCode).toBe(200);
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newUser'),
    });

    expect(response.statusCode).toBe(200);
  });

  it('create', async () => {
    const params = testData.users.new;
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('users'),
      cookies: cookie,
      payload: {
        data: params,
      },
    });

    expect(response.statusCode).toBe(302);
    const expected = {
      ..._.omit(params, 'password'),
      passwordDigest: encrypt(params.password),
    };
    const user = await models.user.query().findOne({ email: params.email });
    expect(user).toMatchObject(expected);
  });

  it('update', async () => {
    // const user = await models.user.query().findOne({ email: testData.users.existing.email });
    const user = testData.users.existing;
    const params = {
      email: 'test@mail.com',
      password: '123',
    };
    const response = await app.inject({
      method: 'PATCH',
      url: app.reverse('updateUser', { id: user.id }),
      cookies: cookie,
      payload: {
        data: params,
      },
    });
    expect(response.statusCode).toBe(302);
    const expected = {
      ..._.omit(params, 'password'),
      passwordDigest: encrypt(params.password),
    };
    const updatedUser = await models.user.query().findOne({ email: params.email });
    expect(updatedUser).toMatchObject(expected);
  });

  it('delete', async () => {
    const user = testData.users.existing3;
    const response = await app.inject({
      method: 'DELETE',
      url: app.reverse('deleteUser', { id: user.id }),
      cookies: await signIn(app, user),
    });
    expect(response.statusCode).toBe(302);
    const userDeleted = await models.user.query().findById(user.id);
    expect(userDeleted).toBeUndefined();
  });

  it('edit', async () => {
    const user = testData.users.existing;
    const { id: userID } = await models.user.query().findOne({ email: user.email });
    const response = await app.inject({
      method: 'GET',
      cookies: cookie,
      url: app.reverse('userEdit', { id: userID }),
    });
    expect(response.statusCode).toBe(200);
    const userExisting = await models.user.query().findById(userID);
    expect(userExisting.email).toEqual(user.email);
  });

  afterEach(async () => {
    // после каждого теста откатываем миграции
    await knex.migrate.rollback();
  });

  afterAll(() => {
    app.close();
  });
});
