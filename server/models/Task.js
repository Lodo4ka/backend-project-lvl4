// @ts-check

import path from 'path';
import { Model } from 'objection';

export default class Task extends Model {
  static get tableName() {
    return 'tasks';
  }

  $parseJson(json, opt) {
    const parsed = super.$parseJson(json, opt);
    return {
      ...(parsed.id && { id: Number(parsed.id) }),
      ...(parsed.name && { name: parsed.name.trim() }),
      ...(parsed.description && { description: parsed.description.trim() }),
      ...(parsed.statusId && { statusId: Number(parsed.statusId) }),
      ...(parsed.executorId && { executorId: Number(parsed.executorId) }),
      ...(parsed.creatorId && { creatorId: Number(parsed.creatorId) }),
    };
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'creatorId', 'statusId'],

      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1, maxLength: 30 },
        description: { type: 'string' },
        creatorId: { type: 'integer' },
        statusId: { type: 'integer' },
        executorId: { type: 'integer' },
      },
    };
  }

  static get relationMappings() {
    return {
      creator: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'User'),
        join: {
          from: 'tasks.creatorId',
          to: 'users.id',
        },
      },
      executor: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'User'),
        join: {
          from: 'tasks.executorId',
          to: 'users.id',
        },
      },
      status: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'Status'),
        join: {
          from: 'tasks.statusId',
          to: 'statuses.id',
        },
      },
    };
  }
}
