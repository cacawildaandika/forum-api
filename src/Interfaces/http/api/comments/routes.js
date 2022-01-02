const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    options: {
      auth: 'jwt_token',
    },
    handler: handler.postCommentsHandler,
  },
]);

module.exports = routes;
