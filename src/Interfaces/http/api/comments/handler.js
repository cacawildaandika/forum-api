const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;
    this.postCommentsHandler = this.postCommentsHandler.bind(this);
  }

  async postCommentsHandler(request, h) {
    const instance = this._container.getInstance(AddCommentUseCase.name);
    const addedComment = await instance.execute({
      ...request.payload,
      owner: request.auth.credentials.user.id,
      thread: request.params.threadId,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = ThreadsHandler;
