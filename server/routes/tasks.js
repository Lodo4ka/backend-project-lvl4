// @ts-check

import i18next from 'i18next';

export default (app) => {
  app
    .get('/tasks', { name: 'tasks', preValidation: app.authenticate }, async (req, reply) => {
      const tasksQuery = await app.objection.models.task.query()
        .withGraphJoined('[creator, executor, status]');
      reply.render('tasks/index', { tasks: tasksQuery });
      return reply;
    })
    .get('/tasks/new', { name: 'newTask', preValidation: app.authenticate }, async (req, reply) => {
      const task = await new app.objection.models.task();
      const [users, statuses] = await Promise.all([
        app.objection.models.user.query(),
        app.objection.models.status.query(),
      ]);
      reply.render('tasks/new', {
        task, users, statuses,
      });
      return reply;
    })
    .post('/tasks', { name: 'createTask', preValidation: app.authenticate }, async (req, reply) => {
      try {
        const data = await app.objection.models.task.fromJson({
          ...req.body.data,
          creatorId: req.user.id,
        });
        await app.objection.models.task.query().insert(data);
        req.flash('info', i18next.t('flash.task.create.success'));
        reply.redirect(app.reverse('tasks'));
      } catch (err) {
        req.flash('error', i18next.t('flash.task.create.error'));
        const task = new app.objection.models.task().$set(req.body.data);
        const [users, statuses] = await Promise.all([
          app.objection.models.user.query(),
          app.objection.models.task.query(),
        ]);
        reply.render(app.reverse('newTask'), {
          task, users, statuses, errors: err.data,
        });
      }
    })
    .get('/tasks/:id', { name: 'showTask', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      try {
        const task = await app.objection.models.task
          .query().findById(id).withGraphJoined('[creator, executor, status]');
        reply.render('tasks/show', { task });
      } catch (err) {
        req.flash('error', i18next.t('flash.task.showError'));
        reply.redirect(app.reverse('tasks'));
      }
      return reply;
    })
    .get('/tasks/:id/edit', { name: 'editTask', preValidation: app.authenticate }, async (req, reply) => {
      const [task, users, statuses] = await Promise.all([
        app.objection.models.task.query().findById(req.params.id)
          .withGraphJoined('[creator, executor, status]'),
        app.objection.models.user.query(),
        app.objection.models.status.query(),
      ]);
      reply.render('tasks/edit', {
        task,
        users,
        statuses,
      });
      return reply;
    })
    .delete('/tasks/:id', {
      name: 'deleteTask',
      preValidation: app.authenticate,
    }, async (req, reply) => {
      const { creatorId } = await app.objection.models.task.query().findById(req.params.id);
      if (req.user.id !== creatorId) {
        req.flash('error', i18next.t('flash.task.authError'));
      } else {
        await app.objection.models.task.query().deleteById(req.params.id);
        req.flash('info', i18next.t('flash.task.delete.success'));
      }
      reply.redirect(app.reverse('tasks'));
      return reply;
    })
    .patch('/tasks/:id', { name: 'updateTask', preValidation: app.authenticate }, async (req, reply) => {
      const oldTask = await app.objection.models.task.query()
        .findById(req.params.id);
      try {
        const taskData = await app.objection.models.task.fromJson({
          ...oldTask,
          ...req.body.data,
        });
        await app.objection.models.task.transaction(async (trx) => {
          await app.objection.models.task.query(trx)
            .upsertGraph(taskData, { relate: true, unrelate: true, noDelete: true });
        });
        req.flash('info', i18next.t('flash.task.update.success'));
        reply.redirect(app.reverse('tasks'));
      } catch (err) {
        req.flash('error', i18next.t('flash.task.update.error'));
        const task = new app.objection.models.task().$set({ ...oldTask, ...req.body.data });
        const [users, statuses] = await Promise.all([
          app.objection.models.user.query(),
          app.objection.models.taskStatus.query(),
        ]);

        reply.render('tasks/edit', {
          task,
          users,
          statuses,
          errors: err.data,
        });
      }
      return reply;
    });
};
