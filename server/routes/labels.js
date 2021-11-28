// @ts-check

import i18next from 'i18next';

export default (app) => {
  app
    .get('/labels', { name: 'labels', preValidation: app.authenticate }, async (req, reply) => {
      const labels = await app.objection.models.label.query();
      reply.render('labels/index', { labels });
    })
    .get('/labels/new', { name: 'newLabel', preValidation: app.authenticate }, async (req, reply) => {
      const label = new app.objection.models.label();
      reply.render('labels/new', { label });
      return reply;
    })

    .post('/labels', { name: 'labelCreate', preValidation: app.authenticate }, async (req, reply) => {
      try {
        const label = await app.objection.models.label.fromJson(req.body.data);
        await app.objection.models.label.query().insert(label);
        req.flash('info', i18next.t('flash.labels.create.success'));
        reply.redirect(app.reverse('labels'));
      } catch (err) {
        req.flash('error', i18next.t('flash.labels.create.error'));
        const label = new app.objection.models.label().$set(req.body.data);
        reply.render(app.reverse('newLabel'), {
          label, errors: err.data,
        });
        reply.code(422);
      }
    })
    .get('/labels/:id/edit', { name: 'editLabel', preValidation: app.authenticate }, async (req, reply) => {
      const label = await app.objection.models.label.query().findById(req.params.id);
      reply.render('labels/edit', { label });
    })

    .delete('/labels/:id', {
      name: 'deleteLabel', preValidation: app.authenticate,
    }, async (req, reply) => {
      const label = await app.objection.models.label.query().findById(req.params.id);
      const tasks = await label.$relatedQuery('tasks');
      if (tasks.length === 0) {
        await label.$query().delete();
        req.flash('info', i18next.t('flash.labels.delete.success'));
      } else {
        req.flash('error', i18next.t('flash.labels.delete.error'));
      }
      reply.redirect(app.reverse('labels'));
    })

    .patch('/labels/:id', {
      name: 'updateLabel', preValidation: app.authenticate,
    }, async (req, reply) => {
      const label = await app.objection.models.label.query().findById(req.params.id);
      try {
        await label.$query().update(req.body.data);
        req.flash('info', i18next.t('flash.labels.update.success'));
        reply.redirect(app.reverse('labels'));
      } catch (err) {
        req.flash('error', i18next.t('flash.labels.update.error'));
        const labelErr = new app.objection.models.label().$set({ ...label, ...req.body.data });
        reply.render('labels/edit', { label: labelErr, errors: err.data });
        reply.code(422);
      }
    });
};
