const AddComment = require('../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({ commentRepository, authenticationRepository, authenticationTokenManager }) {
    this._commentRepository = commentRepository;
    this._authenticationRepository = authenticationRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCasePayload) {
    this.verifyPayload(useCasePayload);
    const { content, token, thread } = useCasePayload;

    await this._authenticationRepository.checkAvailabilityToken(token);
    const { id } = await this._authenticationTokenManager
      .decodePayload(token);

    const addComment = new AddComment({
      content,
      owner: id,
      thread,
    });

    return this._commentRepository.addComment(addComment);
  }

  verifyPayload({ content, token, thread }) {
    if (!content || !token || !thread) {
      throw new Error('USE_CASE_ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }
  }
}

module.exports = AddCommentUseCase;
