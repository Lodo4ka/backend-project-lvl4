// @ts-check

import i18next from 'i18next';

export default (app) => {
  app
    .get('/users', { name: 'users' }, async (req, reply) => {
      const users = await app.objection.models.user.query();
      reply.render('users/index', { users });
      return reply;
    })
    .get('/users/new', { name: 'newUser' }, (req, reply) => {
      const user = new app.objection.models.user();
      reply.render('users/new', { user });
    })
    .get('/users/:id/edit', { name: 'userEdit' }, async (req, reply) => {
      const { id } = req.params;
      try {
        const user = await app.objection.models.user.query().findById(id);
        reply.render('users/:id/edit', { user });
        return reply;
      } catch (e) {
        req.flash('info', i18next.t('flash.users.update.error'));
        return reply;
      }
    })
    .post('/users', async (req, reply) => {
      try {
        const user = await app.objection.models.user.fromJson(req.body.data);
        console.log('create user', user);
        await app.objection.models.user.query().insert(user);
        req.flash('info', i18next.t('flash.users.create.success'));
        reply.redirect(app.reverse('root'));
        return reply;
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.users.create.error'));
        reply.render('users/new', { user: req.body.data, errors: data });
        return reply;
      }
    })
    .patch('/users/:id', { name: 'user' }, async (req, reply) => {
      const { id } = req.params;
      const params = req.body.data;
      try {
        const currentUser = await app.objection.models.user.query()
          .findById(id);
        await currentUser.$query().update({ email: params.email, password: params.password });
        req.flash('info', i18next.t('flash.users.update.success'));
        reply.redirect(app.reverse('users'));
      } catch (e) {
        req.flash('info', i18next.t('flash.users.update.error'));
      }
    })
    .delete('/users/:id', { name: 'deleteUser' }, async (req, reply) => {
      const { id } = req.params;
      try {
        await app.objection.models.user.query().deleteById(id);
        req.flash('info', i18next.t('flash.users.delete.success'));
        reply.redirect(app.reverse('users'));
      } catch (e) {
        req.flash('info', i18next.t('flash.users.delete.error'));
      }
    });
};
