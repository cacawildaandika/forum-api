const AddLike = require('../../Domains/likes/entities/AddLike');
const InvariantError = require('../../Commons/exceptions/InvariantError');

class AddLikeUseCase {
  constructor({ threadRepository, commentRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCasePayload) {
    this.verifyPayload(useCasePayload);
    const {
      thread, comment, owner, isLike,
    } = useCasePayload;

    try {
      await this._threadRepository.getById(thread);
    } catch (e) {
      throw new Error('USE_CASE_ADD_LIKE.THREAD_NOT_FOUND');
    }

    try {
      const detailComment = await this._commentRepository.getById(comment);

      if (detailComment.deleted_at !== '') throw new InvariantError('comment is deleted');
    } catch (e) {
      if (e.message === 'comment is deleted') throw new Error('USE_CASE_ADD_LIKE.COMMENT_DELETED');
      throw new Error('USE_CASE_ADD_LIKE.COMMENT_NOT_FOUND');
    }

    const lastLike = await this._likeRepository.getLastLikeUser(thread, comment, owner);

    const addLikePayload = {
      thread, comment, owner, isLike,
    };

    if (Object.keys(lastLike).length > 0) {
      addLikePayload.isLike = !lastLike.isLike;
    }

    const addLike = new AddLike(addLikePayload);

    return this._likeRepository.addLike(addLike);
  }

  verifyPayload({
    thread, comment, owner, isLike,
  }) {
    if (!thread || !comment || !owner || !isLike) {
      throw new Error('USE_CASE_ADD_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
    }
  }
}

module.exports = AddLikeUseCase;
