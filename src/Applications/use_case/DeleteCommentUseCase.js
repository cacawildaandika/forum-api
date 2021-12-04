module.exports = class DeleteCommentUseCase {
  constructor({ commentRepository, authenticationRepository, authenticationTokenManager }) {
    this._commentRepository = commentRepository;
    this._authenticationRepository = authenticationRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCasePayload) {
    this.verifyPayload(useCasePayload);

    const { token, thread, comment } = useCasePayload;

    await this._authenticationRepository.checkAvailabilityToken(token);
    const decodedToken = await this._authenticationTokenManager
      .decodePayload(token);

    const detailComment = await this._commentRepository.getById(comment);

    if (!detailComment) throw new Error('USE_CASE_DELETE_COMMENT.NOT_FOUND');
    if (detailComment.thread !== thread) throw new Error('USE_CASE_DELETE_COMMENT.NOT_FOUND');
    if (detailComment.owner !== decodedToken.id) throw new Error('USE_CASE_DELETE_COMMENT.UNAUTHORIZED');

    await this._commentRepository.deleteComment(detailComment.id);
    return true;
  }

  verifyPayload({ token, thread, comment }) {
    if (!comment || !token || !thread) throw new Error('USE_CASE_DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  }
};
