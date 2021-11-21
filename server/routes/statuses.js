// @ts-check

import i18next from 'i18next';

export default (app) => {
  app
    .get('/statuses', { name: 'statuses', preValidation: app.authenticate }, async (req, reply) => {
      const statuses = await app.objection.models.status.query();
      reply.render('statuses/index', { statuses });
    })
    .get('/status/new', { name: 'newStatus' }, async (req, reply) => {
      const status = await new app.objection.models.status();
      reply.render('statuses/new', { status });
    })
    .post('/statuses', { name: 'statusCreate', preValidation: app.authenticate }, async (req, reply) => {
      try {
        const data = await app.objection.models.status.fromJson(req.body.data);
        await app.objection.models.status.query().insert(data);
        req.flash('info', i18next.t('flash.status.create.success'));
        reply.redirect(app.reverse('statuses'));
      } catch (error) {
        req.flash('error', i18next.t('flash.status.create.error'));
        const status = new app.objection.models.status().$set(req.body.data);
        reply.render(app.reverse('newStatus'), { status, errors: error.data });
        reply.code(422);
      }
    })
    .get('/status/:id/edit', { name: 'editStatus', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      const status = await app.objection.models.status.query().findById(id);
      reply.render('statuses/edit', { status });
    })
    .patch('/statuses/:id', { name: 'updateStatus' }, async (req, reply) => {
      const { id } = req.params;
      const currentStatus = await app.objection.models.status.query().findById(id);
      try {
        await currentStatus.$query().update(req.body.data);
        req.flash('info', i18next.t('flash.status.update.success'));
        reply.redirect(app.reverse('statuses'));
      } catch (err) {
        req.flash('error', i18next.t('flash.status.update.error'));
        const status = new app.objection.models.status()
          .$set({ ...currentStatus, ...req.body.data });
        reply.render('statuses/edit', { status, errors: err.data });
        reply.code(422);
      }
    });
};
