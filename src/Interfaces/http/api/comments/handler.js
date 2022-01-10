const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;
    this.postCommentsHandler = this.postCommentsHandler.bind(this);
    this.deleteCommentsHandler = this.deleteCommentsHandler.bind(this);
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

  async deleteCommentsHandler(request, h) {
    const instance = this._container.getInstance(DeleteCommentUseCase.name);
    await instance.execute({
      owner: request.auth.credentials.user.id,
      thread: request.params.threadId,
      comment: request.params.commentId,
    });

    const response = h.response({
      status: 'success',
      data: {},
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
