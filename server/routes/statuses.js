// @ts-check

import i18next from 'i18next';

export default (app) => {
  app
    .get('/statuses', { name: 'statuses' }, async (req, reply) => {
      const statuses = await app.objection.models.status.query();
      reply.render('statuses/index', { statuses });
    })
    .get('/status/new', { name: 'newStatus' }, async (req, reply) => {
      const status = await new app.objection.models.status();
      reply.render('statuses/new', { status });
    })
    .post('/statuses', { name: 'statusCreate' }, async (req, reply) => {
      try {
        const data = await app.objection.models.status.fromJson(req.body.data);
        await app.objection.models.status.query().insert(data); req.flash('info', i18next.t('flash.status.create.success'));
        reply.redirect(app.reverse('statuses'));
      } catch (error) {
        req.flash('error', i18next.t('flash.status.create.error'));
        const status = new app.objection.models.taskStatus().$set(req.body.data);
        reply.render(app.reverse('newStatus'), { status, errors: error.data });
        reply.code(422);
      }
    });
};
