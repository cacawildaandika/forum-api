const InvariantError = require('../../Commons/exceptions/InvariantError');

module.exports = class DeleteCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    this.verifyPayload(useCasePayload);

    const { owner, thread, comment } = useCasePayload;

    // Check thread availability
    if (await this._threadRepository.verifyDeletedThread(thread)) throw new Error('DELETE_COMMENT_USE_CASE.THREAD_NOT_FOUND');
    try {
      await this._threadRepository.getById(thread);
    } catch (e) {
      throw new InvariantError('DELETE_COMMENT_USE_CASE.THREAD_NOT_FOUND');
    }

    const detailComment = await this._commentRepository.getById(comment);

    if (!detailComment) throw new Error('DELETE_COMMENT_USE_CASE.NOT_FOUND');

    if (detailComment.user_id !== owner) throw new Error('DELETE_COMMENT_USE_CASE.UNAUTHORIZED');

    await this._commentRepository.deleteComment(detailComment.id);
    return true;
  }

  verifyPayload({ thread, comment, owner }) {
    if (!comment || !thread || !owner) throw new Error('USE_CASE_DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  }
};
