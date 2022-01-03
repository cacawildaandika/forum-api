const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    options: {
      auth: 'jwt_token',
    },
    handler: handler.postCommentsHandler,
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}',
    options: {
      auth: 'jwt_token',
    },
    handler: handler.deleteCommentsHandler,
  },
]);

module.exports = routes;
