const AddLike = require('../../Domains/likes/entities/AddLike');
const InvariantError = require('../../Commons/exceptions/InvariantError');

class AddLikeDislikeUseCase {
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
      // eslint-disable-next-line camelcase,prefer-const
      let { likecount, deleted_at } = await this._commentRepository.getById(comment);

      // eslint-disable-next-line camelcase
      if (deleted_at !== '' && deleted_at !== null) throw new InvariantError('comment is deleted');

      const lastLike = await this._likeRepository.getLastLikeUser({ thread, comment, owner });

      const addLikePayload = {
        thread, comment, owner, isLike,
      };

      if (Object.keys(lastLike).length > 0) {
        addLikePayload.isLike = !lastLike.is_like;
      }

      const addLike = new AddLike(addLikePayload);

      likecount = likecount === undefined ? 0 : likecount;

      if (addLike.isLike) {
        likecount += 1;
      } else {
        likecount -= 1;
      }

      await this._commentRepository.updateLikeCount(comment, likecount);

      return this._likeRepository.addLike(addLike);
    } catch (e) {
      if (e.message === 'comment is deleted') throw new Error('USE_CASE_ADD_LIKE.COMMENT_DELETED');
      throw new Error('USE_CASE_ADD_LIKE.COMMENT_NOT_FOUND');
    }
  }

  verifyPayload({
    thread, comment, owner, isLike,
  }) {
    if (!thread || !comment || !owner || !isLike) {
      throw new Error('USE_CASE_ADD_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
    }
  }
}

module.exports = AddLikeDislikeUseCase;
