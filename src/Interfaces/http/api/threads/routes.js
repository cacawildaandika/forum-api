const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads',
    options: {
      auth: 'jwt_token',
    },
    handler: handler.postThreadHandler,
  },
]);

module.exports = routes;
