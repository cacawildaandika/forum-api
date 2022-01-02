const AddComment = require('../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    this.verifyPayload(useCasePayload);
    const { content, owner, thread } = useCasePayload;

    const addComment = new AddComment({
      content,
      owner,
      thread,
    });

    return this._commentRepository.addComment(addComment);
  }

  verifyPayload({ content, owner, thread }) {
    if (!content || !owner || !thread) {
      throw new Error('USE_CASE_ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }
  }
}

module.exports = AddCommentUseCase;
