// @ts-check

// import i18next from 'i18next';

export default (app) => {
  app
    .get('/statuses', { name: 'statuses' }, async (req, reply) => {
      const statuses = await app.objection.models.status.query();
      reply.render('statuses/index', { statuses });
      return reply;

      // const users = await app.objection.models.user.query();
      // reply.render('users/index', { users });
      // return reply;
    });
};
