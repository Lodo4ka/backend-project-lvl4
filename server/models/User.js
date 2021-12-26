// @ts-check

import { Model } from 'objection';
import objectionUnique from 'objection-unique';

import path from 'path';
import encrypt from '../lib/secure.js';

const unique = objectionUnique({ fields: ['email'] });

export default class User extends unique(Model) {
  static get virtualAttributes() {
    return ['fullName'];
  }

  $parseJson(json, options) {
    const parsed = super.$parseJson(json, options);
    return {
      ...parsed,
      ...(parsed.firstName && { firstName: parsed.firstName.trim() }),
      ...(parsed.lastName && { lastName: parsed.lastName.trim() }),
      ...(parsed.email && { email: parsed.email.trim() }),
      ...(parsed.password && { password: parsed.password.trim() }),
    };
  }

  static get tableName() {
    return 'users';
  }

  fullName() {
    return [this.firstName, this.lastName].join(' ');
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        id: { type: 'integer' },
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 3 },
        firstName: { type: 'string', minLength: 1 },
        lastName: { type: 'string', minLength: 1 },
      },
    };
  }

  set password(value) {
    this.passwordDigest = encrypt(value);
  }

  verifyPassword(password) {
    return encrypt(password) === this.passwordDigest;
  }

  static get relationMappings() {
    return {
      creatorTasks: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, 'Task'),
        join: {
          from: 'users.id',
          to: 'tasks.creatorId',
        },
      },
      executorTasks: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, 'Task'),
        join: {
          from: 'users.id',
          to: 'tasks.executorId',
        },
      },
    };
  }
}
