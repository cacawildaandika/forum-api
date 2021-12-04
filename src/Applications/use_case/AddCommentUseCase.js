const AddComment = require('../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const addComment = new AddComment({
      content: useCasePayload.content,
    });

    return this._commentRepository.addComment(addComment);
  }
}

module.exports = AddCommentUseCase;
