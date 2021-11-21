// @ts-check

import i18next from 'i18next';

export default (app) => {
  app
    .get('/tasks', { name: 'tasks', preValidation: app.authenticate }, async (req, reply) => {
      const tasks = await app.objection.models.task.query();
      reply.render('tasks/index', { tasks });
    })
    .get('/tasks/new', { name: 'newTask', preValidation: app.authenticate }, async (req, reply) => {
      const task = await new app.objection.models.task();
      const [users, statuses] = await Promise.all([
        app.objection.models.user.query(),
        app.objection.models.status.query(),
      ]);
      console.log(users);
      reply.render('tasks/new', {
        task, users, statuses,
      });
    })
    .post('/tasks', { name: 'createTask', preValidation: app.authenticate }, async (req, reply) => {
      try {
        const data = await app.objection.models.task.fromJson(req.body.data);
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
      return reply;
    });
};
