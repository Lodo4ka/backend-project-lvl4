// @ts-check

import i18next from 'i18next';
import debug from 'debug';
import { isEmpty } from 'lodash';

const logApp = debug('app:routes:users');

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
        reply.render('users/edit', { user });
        return reply;
      } catch (e) {
        req.flash('info', i18next.t('flash.users.update.error'));
        return reply;
      }
    })
    .post('/users', async (req, reply) => {
      try {
        const user = await app.objection.models.user.fromJson(req.body.data);
        await app.objection.models.user.query().insert(user);
        req.flash('info', i18next.t('flash.users.create.success'));
        reply.redirect(app.reverse('root'));
        return reply;
      } catch (e) {
        req.flash('error', i18next.t('flash.users.create.error'));
        reply.render('users/new', { user: req.body.data, errors: e.data });
        return reply;
      }
    })
    .patch('/users/:id', { name: 'updateUser' }, async (req, reply) => {
      const { id } = req.params;
      const params = req.body.data;
      logApp('patch req.body.data-> %O', req.body.data);
      const currentUser = await app.objection.models.user.query()
        .findById(id);
      try {
        await currentUser.$query().update(params);
        req.flash('info', i18next.t('flash.users.update.success'));
        reply.redirect(app.reverse('users'));
      } catch (e) {
        req.flash('info', i18next.t('flash.users.update.error'));
        reply.render('users/edit', { user: currentUser, errors: e.data });
      }
      return reply;
    })
    .delete('/users/:id', { name: 'deleteUser' }, async (req, reply) => {
      const { id } = req.params;

      if (Number(id) !== req.user.id) {
        req.flash('error', i18next.t('flash.user.accessError'));
        reply.redirect(app.reverse('users'));
        return reply;
      }
      const user = await app.objection.models.user.query().findById(id);
      const taskCreator = await user.$relatedQuery('createdTasks');
      const taskExecutor = await user.$relatedQuery('assignedTasks');

      if (isEmpty(taskCreator) && isEmpty(taskExecutor)) {
        await app.objection.models.user.query().deleteById(id);
        await req.logOut();
        req.flash('info', i18next.t('flash.user.delete.success'));
      } else {
        req.flash('error', i18next.t('flash.user.delete.error'));
      }

      reply.redirect(app.reverse('users'));

      return reply;
    });
};
